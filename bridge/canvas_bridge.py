#!/usr/bin/env python3
"""Local-only Canvas session bridge.

The first login is completed by the user in a real Chrome window, including any
MFA challenge. Passwords are never accepted as command-line arguments or saved
by this script. Later syncs reuse Playwright's local browser profile.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from playwright.sync_api import BrowserContext, Page, TimeoutError as PlaywrightTimeout, sync_playwright


ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / ".data"
PROFILE_DIR = DATA_DIR / "canvas-profile"
MARKER_FILE = DATA_DIR / "canvas-bridge.json"
DEFAULT_BASE_URL = "https://canvas.polyu.edu.hk"


def emit(payload: dict[str, Any], code: int = 0) -> None:
    print(json.dumps(payload, ensure_ascii=False))
    raise SystemExit(code)


def clean_text(value: Any, limit: int = 500) -> str:
    if not isinstance(value, str):
        return ""
    return re.sub(r"\s+", " ", value).strip()[:limit]


def description_text(value: Any) -> str:
    if not isinstance(value, str) or not value:
        return ""
    text = re.sub(r"<br\s*/?>", "\n", value, flags=re.I)
    text = re.sub(r"</(?:p|li|div|h[1-6])>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()[:8_000]


def submission_type_label(types: Any) -> str:
    labels = {
        "online_upload": "文件上传",
        "online_text_entry": "文字提交",
        "online_url": "链接提交",
        "online_quiz": "在线测验",
        "discussion_topic": "讨论回复",
        "media_recording": "媒体录制",
        "student_annotation": "文档批注",
        "external_tool": "外部工具",
    }
    if not isinstance(types, list) or not types:
        return "在线提交"
    return " · ".join(labels.get(item, str(item)) for item in types)


def submission_state(submission: Any) -> str:
    if not isinstance(submission, dict):
        return "unknown"
    workflow = clean_text(submission.get("workflow_state"), 60)
    attempt = int(submission.get("attempt") or 0)
    if workflow in {"submitted", "graded", "pending_review"} or submission.get("submitted_at") or attempt > 0:
        return "graded" if workflow == "graded" else "submitted"
    return workflow or "unsubmitted"


def fetch_json(page: Page, path: str) -> Any:
    result = page.evaluate(
        """
        async (path) => {
          const response = await fetch(path, {
            credentials: "include",
            headers: { accept: "application/json" }
          });
          const text = await response.text();
          return { status: response.status, text };
        }
        """,
        path,
    )
    if result["status"] in {401, 403}:
        raise PermissionError("AUTH_REQUIRED")
    if result["status"] >= 400:
        raise RuntimeError(f"Canvas returned HTTP {result['status']}")
    try:
        return json.loads(result["text"])
    except json.JSONDecodeError as error:
        raise RuntimeError("Canvas returned a non-JSON response") from error


def is_authenticated_page(page: Page, base_url: str) -> bool:
    if "adfs." in page.url or "/login" in page.url:
        return False
    if not page.url.startswith(base_url):
        return False
    try:
        user = fetch_json(page, "/api/v1/users/self")
        return bool(user.get("id"))
    except Exception:
        return False


def page_ready(page: Page, base_url: str, timeout_seconds: int = 180) -> bool:
    deadline = time.monotonic() + timeout_seconds
    while time.monotonic() < deadline:
        if is_authenticated_page(page, base_url):
            return True
        if page.is_closed():
            return False
        page.wait_for_timeout(700)
    return False


def open_dashboard(context: BrowserContext, base_url: str) -> Page:
    page = context.pages[0] if context.pages else context.new_page()
    try:
        page.goto(f"{base_url}/dashboard", wait_until="domcontentloaded", timeout=45_000)
    except PlaywrightTimeout:
        pass
    return page


def launch_context(playwright: Any, base_url: str, headless: bool) -> BrowserContext:
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
    # The persistent profile avoids asking the user to sign in on every sync.
    try:
        return playwright.chromium.launch_persistent_context(channel="chrome", **options)
    except Exception:
        return playwright.chromium.launch_persistent_context(**options)


def extract_data(page: Page, base_url: str, account: dict[str, Any]) -> dict[str, Any]:
    courses_raw = fetch_json(page, "/api/v1/courses?enrollment_state=active&per_page=100")
    courses = [
        {
            "id": str(course["id"]),
            "name": clean_text(course.get("name"), 160),
            "code": clean_text(course.get("course_code"), 80),
        }
        for course in courses_raw
        if isinstance(course, dict) and course.get("id") and not course.get("access_restricted_by_date")
    ]

    assignments: list[dict[str, Any]] = []
    materials: list[dict[str, Any]] = []
    type_map = {
        "File": ("FILE", "file"),
        "Page": ("PAGE", "book"),
        "ExternalUrl": ("LINK", "link"),
        "ExternalTool": ("TOOL", "link"),
        "Assignment": ("TASK", "task"),
        "Quiz": ("QUIZ", "task"),
        "Discussion": ("DISCUSSION", "book"),
    }
    colors = ["", "teal", "gold", "blue", "ink"]

    for course in courses:
        course_id = course["id"]
        try:
            assignment_items = fetch_json(
                page,
                f"/api/v1/courses/{course_id}/assignments"
                "?per_page=100&order_by=due_at&include[]=submission",
            )
        except Exception:
            assignment_items = []
        for item in assignment_items if isinstance(assignment_items, list) else []:
            if not isinstance(item, dict) or not item.get("id") or not item.get("name"):
                continue
            if item.get("published") is False:
                continue
            submission = item.get("submission")
            if not isinstance(submission, dict):
                try:
                    submission = fetch_json(
                        page,
                        f"/api/v1/courses/{course_id}/assignments/{item['id']}/submissions/self",
                    )
                except Exception:
                    submission = None
            state = submission_state(submission)
            description = description_text(item.get("description"))
            label = submission_type_label(item.get("submission_types"))
            requirements = [
                line.strip()
                for line in description.splitlines()
                if len(line.strip()) >= 12
            ][:4]
            if not requirements:
                requirements = ["打开 Canvas 作业页查看完整要求"]
            requirements.append(f"提交方式：{label}")
            assignments.append(
                {
                    "id": f"canvas-bridge-{course_id}-{item['id']}",
                    "courseId": course_id,
                    "assignmentId": str(item["id"]),
                    "course": course["name"],
                    "code": course["code"],
                    "title": clean_text(item.get("name"), 240),
                    "titleEn": clean_text(item.get("name"), 240),
                    "due": item.get("due_at") or "",
                    "points": "未设置分值"
                    if item.get("points_possible") is None
                    else f"{item.get('points_possible')} 分",
                    "submission": label,
                    "format": label,
                    "priority": "已提交" if state == "submitted" else "待提交",
                    "summary": (description.splitlines()[0][:180] if description else "打开 Canvas 查看完整作业说明。"),
                    "description": description or "请打开 Canvas 查看详情。",
                    "requirements": requirements,
                    "source": item.get("html_url")
                    or f"{base_url}/courses/{course_id}/assignments/{item['id']}",
                    "submissionState": state,
                    "submittedAt": submission.get("submitted_at") if isinstance(submission, dict) else None,
                    "attempt": int(submission.get("attempt") or 0) if isinstance(submission, dict) else 0,
                    "isSubmitted": state in {"submitted", "graded"},
                    "category": "attendance"
                    if re.search(r"class[\s_-]*attendance", str(item.get("name") or ""), re.I)
                    else "assignment",
                    "live": True,
                    "sourceMode": "browser-session",
                }
            )

        try:
            modules = fetch_json(
                page,
                f"/api/v1/courses/{course_id}/modules?per_page=100&include[]=items",
            )
        except Exception:
            modules = []
        for module in modules if isinstance(modules, list) else []:
            for item in module.get("items", []):
                if not isinstance(item, dict) or not item.get("title") or item.get("type") == "SubHeader":
                    continue
                display_type, icon = type_map.get(
                    item.get("type"), (clean_text(item.get("type"), 30).upper(), "book")
                )
                materials.append(
                    {
                        "id": f"canvas-bridge-material-{course_id}-{item.get('id')}",
                        "course": course["name"],
                        "title": clean_text(item.get("title"), 240),
                        "type": display_type,
                        "icon": icon,
                        "color": colors[len(materials) % len(colors)],
                        "meta": f"{clean_text(module.get('name'), 100)} · Canvas",
                        "updated": "来自浏览器会话",
                        "source": item.get("html_url")
                        or f"{base_url}/courses/{course_id}/modules/{module.get('id')}",
                        "live": True,
                    }
                )
                if len(materials) >= 80:
                    break
            if len(materials) >= 80:
                break

    fetched_at = datetime.now(timezone.utc).isoformat()
    marker = {
        "account": account,
        "baseUrl": base_url,
        "connectedAt": marker_account_connected_at(),
        "lastSync": fetched_at,
    }
    MARKER_FILE.write_text(json.dumps(marker, ensure_ascii=False, indent=2), encoding="utf-8")
    try:
        MARKER_FILE.chmod(0o600)
    except OSError:
        pass
    return {
        "fetchedAt": fetched_at,
        "account": account,
        "courses": courses,
        "assignments": assignments[:160],
        "materials": materials,
        "counts": {
            "courses": len(courses),
            "assignments": len(assignments),
            "materials": len(materials),
        },
        "sourceMode": "browser-session",
    }


def marker_account_connected_at() -> str:
    try:
        existing = json.loads(MARKER_FILE.read_text(encoding="utf-8"))
        return existing.get("connectedAt") or datetime.now(timezone.utc).isoformat()
    except Exception:
        return datetime.now(timezone.utc).isoformat()


def run_login(base_url: str) -> None:
    with sync_playwright() as playwright:
        context = launch_context(playwright, base_url, headless=False)
        page = open_dashboard(context, base_url)
        if not page_ready(page, base_url):
            context.close()
            emit(
                {
                    "code": "LOGIN_REQUIRED",
                    "message": "浏览器登录会话尚未完成，请重新打开登录窗口。",
                },
                3,
            )
        account = fetch_json(page, "/api/v1/users/self")
        data = extract_data(
            page,
            base_url,
            {"id": str(account.get("id")), "name": clean_text(account.get("name"), 160)},
        )
        context.close()
        emit(data)


def run_sync(base_url: str) -> None:
    if not PROFILE_DIR.exists():
        emit(
            {
                "code": "LOGIN_REQUIRED",
                "message": "需要先打开一次 Canvas 登录窗口。",
            },
            3,
        )
    with sync_playwright() as playwright:
        context = launch_context(playwright, base_url, headless=True)
        page = open_dashboard(context, base_url)
        if not page_ready(page, base_url, timeout_seconds=15):
            context.close()
            emit(
                {
                    "code": "AUTH_EXPIRED",
                    "message": "Canvas 登录状态已失效，请重新打开登录窗口。",
                },
                3,
            )
        account = fetch_json(page, "/api/v1/users/self")
        data = extract_data(
            page,
            base_url,
            {"id": str(account.get("id")), "name": clean_text(account.get("name"), 160)},
        )
        context.close()
        emit(data)


def run_logout() -> None:
    shutil.rmtree(PROFILE_DIR, ignore_errors=True)
    try:
        MARKER_FILE.unlink()
    except FileNotFoundError:
        pass
    emit({"ok": True})


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["login", "sync", "logout"])
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    args = parser.parse_args()
    base_url = args.base_url.rstrip("/")
    try:
        if args.command == "login":
            run_login(base_url)
        elif args.command == "sync":
            run_sync(base_url)
        else:
            run_logout()
    except Exception as error:
        emit(
            {
                "code": "BRIDGE_ERROR",
                "message": clean_text(str(error), 500) or "本机 Canvas 桥接失败。",
            },
            2,
        )


if __name__ == "__main__":
    main()
