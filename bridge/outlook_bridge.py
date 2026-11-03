#!/usr/bin/env python3
"""Local-only Outlook on the web session bridge.

How it works
------------
* ``login`` opens a real Chrome window at Outlook on the web. The user signs in
  on Microsoft's (or the school's) own login page, including MFA. This script
  never sees or stores the password.
* ``sync`` reuses that browser profile headlessly and reads the inbox and the
  calendar through the same JSON service (``/owa/service.svc``) that the
  Outlook web app itself calls.

Authentication follows whatever the web app is doing at the time:
* classic Outlook on the web (outlook.office.com) authenticates
  ``service.svc`` with session cookies plus an ``X-OWA-CANARY`` cookie;
* the new Outlook (outlook.cloud.microsoft, 2025+) gets a short-lived bearer
  token in the page and sends it in the ``Authorization`` header.
The bridge watches the requests the page itself makes, reuses the same
headers for its own read-only calls, and keeps them in memory only.
* ``logout`` deletes the browser profile and the marker file.

The ``service.svc`` actions are not a documented public API. They have been
stable for years, but Microsoft can change them. When a request fails, the
error code ``OWA_API_CHANGED`` is returned so the UI can say so plainly, and
``--debug`` prints the raw response to stderr to help whoever fixes it.

Everything is read-only: nothing is sent, deleted, moved or marked as read.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote, urlparse

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / ".data"
PROFILE_DIR = DATA_DIR / "outlook-profile"
MARKER_FILE = DATA_DIR / "outlook-bridge.json"
DEFAULT_BASE_URL = "https://outlook.office.com"
# Outlook on the web has moved between these hosts; the sign-in may redirect to any of them.
OWA_HOSTS = {"outlook.office.com", "outlook.office365.com", "outlook.cloud.microsoft"}
AUTH_HEADERS = ("authorization", "x-anchormailbox", "x-owa-sessionid", "x-owa-hosted-ux", "x-routingparameter-sessionkey")

MAIL_LIMIT = 40          # newest inbox messages to list
BODY_LIMIT = 25          # of those, how many get a full text body
BODY_CHARS = 12_000
CALENDAR_PAST_DAYS = 1
CALENDAR_FUTURE_DAYS = 21
DEBUG = False


class BridgeError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def emit(payload: dict[str, Any], code: int = 0) -> None:
    print(json.dumps(payload, ensure_ascii=False))
    raise SystemExit(code)


def debug(label: str, value: Any) -> None:
    if DEBUG:
        text = value if isinstance(value, str) else json.dumps(value, ensure_ascii=False)
        print(f"[outlook-bridge] {label}: {text[:4000]}", file=sys.stderr)


def clean_text(value: Any, limit: int = 500) -> str:
    if not isinstance(value, str):
        return ""
    return re.sub(r"\s+", " ", value).strip()[:limit]


def body_text(value: Any) -> str:
    """Plain text body: keep paragraph breaks, drop HTML if any slipped through."""
    if not isinstance(value, str) or not value:
        return ""
    text = value
    if "<" in text and re.search(r"</?(p|div|br|span|table|html)\b", text, re.I):
        text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", text, flags=re.I | re.S)
        text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
        text = re.sub(r"</(p|div|li|tr|h[1-6])>", "\n", text, flags=re.I)
        text = re.sub(r"<[^>]+>", " ", text)
        text = html.unescape(text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t ]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()[:BODY_CHARS]


def short_id(value: str) -> str:
    return hashlib.sha1(value.encode("utf-8")).hexdigest()[:16]


def iso(value: Any) -> str | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.isoformat()


# --------------------------------------------------------------------------- #
# OWA JSON service
# --------------------------------------------------------------------------- #

HEADER = {
    "__type": "JsonRequestHeaders:#Exchange",
    "RequestServerVersion": "Exchange2013",
    "TimeZoneContext": {
        "__type": "TimeZoneContext:#Exchange",
        "TimeZoneDefinition": {"__type": "TimeZoneDefinitionType:#Exchange", "Id": "UTC"},
    },
}


def prop(field: str) -> dict[str, str]:
    return {"__type": "PropertyUri:#Exchange", "FieldURI": field}


def owa_call(page: Any, base_url: str, auth: dict[str, str], action: str, body: dict[str, Any]) -> dict[str, Any]:
    result = page.evaluate(
        """
        async ({ url, action, auth, payload }) => {
          const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
              ...auth,
              "content-type": "application/json; charset=utf-8",
              "action": action,
              "x-req-source": "Mail"
            },
            body: JSON.stringify(payload)
          });
          return { status: response.status, text: await response.text() };
        }
        """,
        {
            "url": f"{base_url}/owa/service.svc?action={action}&app=Mail",
            "action": action,
            "auth": auth,
            "payload": body,
        },
    )
    status = result.get("status", 0)
    text = result.get("text", "")
    debug(f"{action} HTTP {status}", text)
    if status in (401, 440):
        raise BridgeError("AUTH_EXPIRED", "Outlook 登录状态已失效，请重新登录。")
    if status >= 400:
        raise BridgeError("OWA_API_CHANGED", f"Outlook 网页版接口返回 HTTP {status}，可能是微软改了接口。")
    try:
        data = json.loads(text)
    except json.JSONDecodeError as error:
        raise BridgeError("OWA_API_CHANGED", "Outlook 网页版没有返回 JSON，可能是微软改了接口。") from error
    messages = (data.get("Body") or {}).get("ResponseMessages", {}).get("Items")
    if isinstance(messages, list) and messages and messages[0].get("ResponseClass") == "Error":
        raise BridgeError(
            "OWA_API_CHANGED",
            f"Outlook 网页版拒绝了请求：{clean_text(messages[0].get('MessageText'), 160) or messages[0].get('ResponseCode')}",
        )
    return data


def find_inbox(page: Any, base_url: str, auth: dict[str, str]) -> list[dict[str, Any]]:
    body = {
        "__type": "FindItemJsonRequest:#Exchange",
        "Header": HEADER,
        "Body": {
            "__type": "FindItemRequest:#Exchange",
            "ItemShape": {
                "__type": "ItemResponseShape:#Exchange",
                "BaseShape": "IdOnly",
                "AdditionalProperties": [
                    prop("item:Subject"),
                    prop("item:DateTimeReceived"),
                    prop("item:Preview"),
                    prop("item:HasAttachments"),
                    prop("item:Importance"),
                    prop("message:From"),
                    prop("message:IsRead"),
                ],
            },
            "ParentFolderIds": [{"__type": "DistinguishedFolderId:#Exchange", "Id": "inbox"}],
            "Traversal": "Shallow",
            "Paging": {
                "__type": "IndexedPageView:#Exchange",
                "BasePoint": "Beginning",
                "Offset": 0,
                "MaxEntriesReturned": MAIL_LIMIT,
            },
            "SortOrder": [
                {"__type": "SortResults:#Exchange", "Order": "Descending", "Path": prop("item:DateTimeReceived")}
            ],
        },
    }
    data = owa_call(page, base_url, auth, "FindItem", body)
    try:
        items = data["Body"]["ResponseMessages"]["Items"][0]["RootFolder"]["Items"]
    except (KeyError, IndexError, TypeError) as error:
        raise BridgeError("OWA_API_CHANGED", "无法识别 Outlook 收件箱的返回格式，可能是微软改了接口。") from error
    return items if isinstance(items, list) else []


def get_bodies(page: Any, base_url: str, auth: dict[str, str], item_ids: list[str]) -> dict[str, str]:
    if not item_ids:
        return {}
    body = {
        "__type": "GetItemJsonRequest:#Exchange",
        "Header": HEADER,
        "Body": {
            "__type": "GetItemRequest:#Exchange",
            "ItemShape": {
                "__type": "ItemResponseShape:#Exchange",
                "BaseShape": "IdOnly",
                "BodyType": "Text",
                "AdditionalProperties": [prop("item:Body")],
            },
            "ItemIds": [{"__type": "ItemId:#Exchange", "Id": item_id} for item_id in item_ids],
        },
    }
    data = owa_call(page, base_url, auth, "GetItem", body)
    bodies: dict[str, str] = {}
    for response in (data.get("Body") or {}).get("ResponseMessages", {}).get("Items", []) or []:
        for item in response.get("Items") or []:
            item_id = (item.get("ItemId") or {}).get("Id")
            value = (item.get("Body") or {}).get("Value")
            if item_id:
                bodies[item_id] = body_text(value)
    return bodies


def calendar_items(page: Any, base_url: str, auth: dict[str, str]) -> tuple[list[dict[str, Any]], str | None]:
    """Try OWA's calendar view action first, then the generic FindItem form."""
    now = datetime.now(timezone.utc)
    start = (now - timedelta(days=CALENDAR_PAST_DAYS)).replace(hour=0, minute=0, second=0, microsecond=0)
    end = now + timedelta(days=CALENDAR_FUTURE_DAYS)
    attempts = [
        (
            "GetCalendarView",
            {
                "__type": "GetCalendarViewJsonRequest:#Exchange",
                "Header": HEADER,
                "Body": {
                    "__type": "GetCalendarViewRequest:#Exchange",
                    "CalendarId": {
                        "__type": "TargetFolderId:#Exchange",
                        "BaseFolderId": {"__type": "DistinguishedFolderId:#Exchange", "Id": "calendar"},
                    },
                    "RangeStart": start.isoformat(),
                    "RangeEnd": end.isoformat(),
                },
            },
            lambda data: data["Body"]["Items"],
        ),
        (
            "FindItem",
            {
                "__type": "FindItemJsonRequest:#Exchange",
                "Header": HEADER,
                "Body": {
                    "__type": "FindItemRequest:#Exchange",
                    "ItemShape": {
                        "__type": "ItemResponseShape:#Exchange",
                        "BaseShape": "IdOnly",
                        "AdditionalProperties": [
                            prop("item:Subject"),
                            prop("calendar:Start"),
                            prop("calendar:End"),
                            prop("calendar:Location"),
                            prop("calendar:IsAllDayEvent"),
                            prop("calendar:Organizer"),
                        ],
                    },
                    "ParentFolderIds": [{"__type": "DistinguishedFolderId:#Exchange", "Id": "calendar"}],
                    "Traversal": "Shallow",
                    "Paging": {
                        "__type": "CalendarPageView:#Exchange",
                        "StartDate": start.isoformat(),
                        "EndDate": end.isoformat(),
                        "MaxEntriesReturned": 200,
                    },
                },
            },
            lambda data: data["Body"]["ResponseMessages"]["Items"][0]["RootFolder"]["Items"],
        ),
    ]
    last_error = None
    for action, body, pick in attempts:
        try:
            items = pick(owa_call(page, base_url, auth, action, body))
            if isinstance(items, list):
                return items, None
        except BridgeError as error:
            if error.code == "AUTH_EXPIRED":
                raise
            last_error = str(error)
        except (KeyError, IndexError, TypeError):
            last_error = "无法识别日历的返回格式"
    return [], f"日历没有读到：{last_error or '未知原因'}。邮件不受影响。"


def account_info(page: Any, base_url: str, auth: dict[str, str]) -> dict[str, str] | None:
    try:
        data = owa_call(page, base_url, auth, "GetOwaUserConfiguration", {})
        session = data.get("SessionSettings") or {}
        name = clean_text(session.get("UserDisplayName"), 160)
        email = clean_text(session.get("UserEmailAddress"), 200)
        if name or email:
            return {"name": name or email, "email": email}
    except Exception as error:  # account name is cosmetic, never fail the sync for it
        debug("account", str(error))
    return None


# --------------------------------------------------------------------------- #
# normalisation (shared schema with bridge/mac_mail.js)
# --------------------------------------------------------------------------- #

def normalize_mail(item: dict[str, Any], body: str, base_url: str) -> dict[str, Any]:
    item_id = (item.get("ItemId") or {}).get("Id") or ""
    sender = ((item.get("From") or {}).get("Mailbox") or {})
    preview = clean_text(item.get("Preview"), 300)
    return {
        "id": f"owa-{short_id(item_id or json.dumps(item, sort_keys=True))}",
        "sender": clean_text(sender.get("Name"), 160) or clean_text(sender.get("EmailAddress"), 200) or "未知发件人",
        "senderEmail": clean_text(sender.get("EmailAddress"), 200),
        "subject": clean_text(item.get("Subject"), 300) or "（无主题）",
        "receivedAt": iso(item.get("DateTimeReceived")),
        "unread": item.get("IsRead") is False,
        "preview": preview,
        "body": body or preview,
        "hasAttachments": bool(item.get("HasAttachments")),
        "important": item.get("Importance") == "High",
        "link": f"{base_url}/mail/inbox/id/{quote(item_id, safe='')}" if item_id else f"{base_url}/mail/",
    }


def normalize_event(item: dict[str, Any]) -> dict[str, Any] | None:
    start = iso(item.get("Start"))
    if not start:
        return None
    location = item.get("Location")
    if isinstance(location, dict):
        location = location.get("DisplayName")
    organizer = ((item.get("Organizer") or {}).get("Mailbox") or {}).get("Name")
    raw_id = (item.get("ItemId") or {}).get("Id") or f"{item.get('Subject')}{start}"
    return {
        "id": f"owa-ev-{short_id(raw_id)}",
        "title": clean_text(item.get("Subject"), 200) or "（无标题）",
        "start": start,
        "end": iso(item.get("End")),
        "allDay": bool(item.get("IsAllDayEvent")),
        "location": clean_text(location, 200),
        "organizer": clean_text(organizer, 160),
    }


# --------------------------------------------------------------------------- #
# browser
# --------------------------------------------------------------------------- #

def launch_context(playwright: Any, headless: bool) -> Any:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    try:
        PROFILE_DIR.chmod(0o700)
    except OSError:
        pass
    options: dict[str, Any] = {
        "user_data_dir": str(PROFILE_DIR),
        "headless": headless,
        "viewport": {"width": 1280, "height": 900},
        "locale": "zh-CN",
    }
    try:
        return playwright.chromium.launch_persistent_context(channel="chrome", **options)
    except Exception:
        return playwright.chromium.launch_persistent_context(**options)


class AuthWatcher:
    """Remembers the auth headers the Outlook page sends with its own service calls."""

    def __init__(self) -> None:
        self.headers = {}
        self.origin = None
        self.seen = 0

    def on_request(self, request: Any) -> None:
        url = request.url
        if "/owa/" not in url and "startupdata" not in url:
            return
        headers = request.headers
        if self.seen < 25:
            self.seen += 1
            parsed = urlparse(url)
            names = sorted(name for name in headers if name.startswith(("x-", "author", "action")))
            debug("page request", f"{parsed.netloc}{parsed.path} headers={names}")
        token = headers.get("authorization", "")
        if token.lower().startswith("bearer "):
            self.headers = {name: headers[name] for name in AUTH_HEADERS if headers.get(name)}
            parsed = urlparse(url)
            self.origin = f"{parsed.scheme}://{parsed.netloc}"


def canary_cookie(context: Any, origin: str) -> str:
    for cookie in context.cookies([origin]):
        if cookie.get("name", "").upper() == "X-OWA-CANARY":
            return cookie.get("value", "")
    return ""


def page_origin(page: Any) -> str:
    parsed = urlparse(page.url)
    return f"{parsed.scheme}://{parsed.netloc}"


def on_mailbox(page: Any, base_url: str) -> bool:
    current = urlparse(page.url)
    hosts = OWA_HOSTS | {urlparse(base_url).netloc}
    return current.netloc in hosts and current.path.startswith(("/mail", "/owa"))


def session_auth(page: Any, context: Any, watcher: AuthWatcher) -> tuple[str, dict[str, str]] | None:
    """(service origin, headers) once the page is signed in and we know how it authenticates."""
    if watcher.headers.get("authorization"):
        return watcher.origin or page_origin(page), dict(watcher.headers)
    origin = page_origin(page)
    canary = canary_cookie(context, origin)
    if canary:
        return origin, {"x-owa-canary": canary}
    return None


def wait_signed_in(page: Any, context: Any, base_url: str, watcher: AuthWatcher, timeout_seconds: int) -> tuple[str, dict[str, str]] | None:
    deadline = time.monotonic() + timeout_seconds
    on_mail_since = None
    reloaded = False
    while time.monotonic() < deadline:
        if page.is_closed():
            return None
        if on_mailbox(page, base_url):
            auth = session_auth(page, context, watcher)
            if auth:
                return auth
            on_mail_since = on_mail_since or time.monotonic()
            # Signed in but the page made no authenticated call we could see yet: reload once.
            if not reloaded and time.monotonic() - on_mail_since > 15:
                reloaded = True
                try:
                    page.reload(wait_until="domcontentloaded", timeout=45_000)
                except Exception:
                    pass
        page.wait_for_timeout(700)
    debug("wait", f"gave up on {urlparse(page.url).netloc}{urlparse(page.url).path}")
    return None


def open_mail(context: Any, base_url: str) -> Any:
    page = context.pages[0] if context.pages else context.new_page()
    try:
        page.goto(f"{base_url}/mail/", wait_until="domcontentloaded", timeout=45_000)
    except Exception:
        pass
    return page


def read_everything(page: Any, base_url: str, auth: dict[str, str]) -> dict[str, Any]:
    items = find_inbox(page, base_url, auth)
    ids = [(item.get("ItemId") or {}).get("Id") for item in items[:BODY_LIMIT]]
    warnings: list[str] = []
    try:
        bodies = get_bodies(page, base_url, auth, [i for i in ids if i])
    except BridgeError as error:
        if error.code == "AUTH_EXPIRED":
            raise
        bodies = {}
        warnings.append(f"邮件正文没有读到，只显示预览：{error}")
    mails = [normalize_mail(item, bodies.get((item.get("ItemId") or {}).get("Id"), ""), base_url) for item in items]
    raw_events, calendar_warning = calendar_items(page, base_url, auth)
    if calendar_warning:
        warnings.append(calendar_warning)
    events = [event for event in (normalize_event(item) for item in raw_events) if event]
    events.sort(key=lambda event: event["start"])
    return {
        "source": "bridge",
        "account": account_info(page, base_url, auth),
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "mails": mails,
        "events": events,
        "warnings": warnings,
        "counts": {"mails": len(mails), "unread": sum(1 for mail in mails if mail["unread"]), "events": len(events)},
    }


def write_marker(base_url: str, payload: dict[str, Any]) -> None:
    previous: dict[str, Any] = {}
    try:
        previous = json.loads(MARKER_FILE.read_text(encoding="utf-8"))
    except Exception:
        pass
    marker = {
        "source": "bridge",
        "baseUrl": base_url,
        "account": payload.get("account") or previous.get("account"),
        "connectedAt": previous.get("connectedAt") or datetime.now(timezone.utc).isoformat(),
        "lastSync": payload["fetchedAt"],
    }
    MARKER_FILE.write_text(json.dumps(marker, ensure_ascii=False, indent=2), encoding="utf-8")
    try:
        MARKER_FILE.chmod(0o600)
    except OSError:
        pass


def run(command: str, base_url: str) -> None:
    from playwright.sync_api import sync_playwright

    if command == "sync" and not PROFILE_DIR.exists():
        emit({"code": "LOGIN_REQUIRED", "message": "需要先用浏览器登录一次 Outlook。"}, 3)
    with sync_playwright() as playwright:
        context = launch_context(playwright, headless=(command == "sync"))
        watcher = AuthWatcher()
        context.on("request", watcher.on_request)
        try:
            page = open_mail(context, base_url)
            ready = wait_signed_in(page, context, base_url, watcher, 240 if command == "login" else 45)
            if not ready:
                if command == "login":
                    emit({"code": "LOGIN_REQUIRED", "message": "Outlook 登录没有完成。请重新点“用浏览器登录”，并在窗口里完成登录。"}, 3)
                emit({"code": "AUTH_EXPIRED", "message": "Outlook 登录状态已失效，请重新登录。"}, 3)
            page.wait_for_timeout(1200)  # let OWA finish its own start-up requests
            service_origin, auth = session_auth(page, context, watcher) or ready
            debug("auth", f"origin={service_origin} via={sorted(auth)}")
            payload = read_everything(page, service_origin, auth)
            write_marker(service_origin, payload)
        finally:
            context.close()
    emit(payload)


def run_logout() -> None:
    shutil.rmtree(PROFILE_DIR, ignore_errors=True)
    try:
        MARKER_FILE.unlink()
    except FileNotFoundError:
        pass
    emit({"ok": True})


def main() -> None:
    global DEBUG
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("command", choices=["login", "sync", "logout"])
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--debug", action="store_true", help="print raw OWA responses to stderr")
    args = parser.parse_args()
    DEBUG = args.debug
    base_url = args.base_url.rstrip("/")
    try:
        if args.command == "logout":
            run_logout()
        run(args.command, base_url)
    except BridgeError as error:
        emit({"code": error.code, "message": str(error)}, 2)
    except ModuleNotFoundError:
        emit({"code": "BRIDGE_SETUP", "message": "没有找到 Playwright。请按 README 创建 .venv 并安装 bridge/requirements.txt。"}, 2)
    except SystemExit:
        raise
    except Exception as error:
        emit({"code": "BRIDGE_ERROR", "message": clean_text(str(error), 500) or "本机 Outlook 桥接失败。"}, 2)


if __name__ == "__main__":
    main()
