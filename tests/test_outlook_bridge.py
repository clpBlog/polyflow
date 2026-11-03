# Offline tests for bridge/outlook_bridge.py: a fake Outlook web page returns canned JSON.
# Run: python3 tests/test_outlook_bridge.py  (Playwright is not needed)
import json, sys, importlib.util
spec = importlib.util.spec_from_file_location("ob", str(__import__("pathlib").Path(__file__).resolve().parent.parent / "bridge" / "outlook_bridge.py"))
ob = importlib.util.module_from_spec(spec); spec.loader.exec_module(ob)

BASE = "https://outlook.cloud.microsoft"
AUTH = {"authorization": "Bearer TOKEN", "x-anchormailbox": "PUID:1@t"}
ITEMS = [
  {"ItemId": {"Id": "AAMk+abc/1=="}, "Subject": "Final project checklist", "DateTimeReceived": "2026-11-02T01:42:00Z",
   "Preview": "Before submitting, please verify...", "From": {"Mailbox": {"Name": "Prof. Wong", "EmailAddress": "km.wong@polyu.edu.hk"}},
   "IsRead": False, "HasAttachments": True, "Importance": "High"},
  {"ItemId": {"Id": "AAMk+def/2=="}, "Subject": "", "DateTimeReceived": "2026-11-01T08:00:00Z",
   "Preview": "Maintenance", "From": {"Mailbox": {"EmailAddress": "its@polyu.edu.hk"}}, "IsRead": True},
]
class Page:
    def __init__(s, calendar_mode): s.calls=[]; s.calendar_mode=calendar_mode
    def evaluate(s, script, arg):
        a = arg["action"]; s.calls.append(a)
        assert arg["auth"] == AUTH, arg["auth"]; assert arg["url"].startswith(BASE + "/owa/service.svc?action=")
        if a == "FindItem" and arg["payload"]["Body"]["ParentFolderIds"][0]["Id"] == "inbox":
            return {"status": 200, "text": json.dumps({"Body": {"ResponseMessages": {"Items": [{"ResponseClass": "Success", "RootFolder": {"Items": ITEMS}}]}}})}
        if a == "GetItem":
            items = [{"ResponseClass":"Success","Items":[{"ItemId":{"Id":i["Id"]},"Body":{"Value":"Dear students,\r\n\r\n\r\nPlease   check.\r\nThanks"}}]} for i in arg["payload"]["Body"]["ItemIds"]]
            return {"status": 200, "text": json.dumps({"Body": {"ResponseMessages": {"Items": items}}})}
        if a == "GetCalendarView":
            if s.calendar_mode == "view":
                return {"status": 200, "text": json.dumps({"Body": {"Items": [{"ItemId":{"Id":"ev1"},"Subject":"COMP5421 Lecture","Start":"2026-11-03T01:30:00Z","End":"2026-11-03T04:20:00Z","Location":{"DisplayName":"Y302"},"IsAllDayEvent":False}]}})}
            return {"status": 500, "text": "<html>error</html>"}
        if a == "FindItem":  # calendar fallback
            return {"status": 200, "text": json.dumps({"Body": {"ResponseMessages": {"Items": [{"ResponseClass":"Error","MessageText":"bad request"}]}}})}
        if a == "GetOwaUserConfiguration":
            return {"status": 200, "text": json.dumps({"SessionSettings": {"UserDisplayName": "Chan Tai Man", "UserEmailAddress": "student@connect.polyu.hk"}})}
        raise AssertionError(a)

for mode in ["view", "broken"]:
    p = ob.read_everything(Page(mode), BASE, AUTH)
    print(mode, json.dumps({"counts": p["counts"], "warnings": p["warnings"], "account": p["account"]}, ensure_ascii=False))
m = p["mails"]
assert m[0]["sender"] == "Prof. Wong" and m[0]["unread"] and m[0]["important"] and m[0]["body"] == "Dear students,\n\nPlease check.\nThanks", m[0]
assert m[0]["link"] == BASE + "/mail/inbox/id/AAMk%2Babc%2F1%3D%3D"
assert m[1]["subject"] == "（无主题）" and m[1]["sender"] == "its@polyu.edu.hk" and not m[1]["unread"]
assert m[0]["id"].startswith("owa-") and len(m[0]["id"]) == 20

# auth expiry maps to AUTH_EXPIRED
class Expired(Page):
    def evaluate(s, script, arg): return {"status": 440, "text": ""}
try:
    ob.read_everything(Expired("view"), BASE, AUTH); raise SystemExit("should fail")
except ob.BridgeError as e:
    assert e.code == "AUTH_EXPIRED"; print("440 ->", e.code)
# HTML instead of JSON -> OWA_API_CHANGED
class Html(Page):
    def evaluate(s, script, arg): return {"status": 200, "text": "<html>"}
try:
    ob.read_everything(Html("view"), BASE, AUTH)
except ob.BridgeError as e:
    print("html ->", e.code)

# --- sign-in detection -------------------------------------------------------
class Req:
    def __init__(s, url, headers): s.url = url; s.headers = headers
class LoginPage:
    """Simulates: Microsoft login -> redirect to new Outlook -> page fires its own service call."""
    def __init__(s, steps): s.steps = steps; s.i = 0; s.url = steps[0][0]
    def is_closed(s): return False
    def reload(s, **k): pass
    def wait_for_timeout(s, ms):
        s.i = min(s.i + 1, len(s.steps) - 1); s.url, fire = s.steps[s.i]
        if fire: watcher.on_request(fire)
class NoCookies:
    def cookies(s, urls): return []
class CanaryCookies:
    def cookies(s, urls): return [{"name": "X-OWA-CANARY", "value": "C1"}]

watcher = ob.AuthWatcher()
steps = [("https://login.microsoftonline.com/common/oauth2/v2.0/authorize", None),
         ("https://outlook.cloud.microsoft/mail/", None),
         ("https://outlook.cloud.microsoft/mail/", Req("https://outlook.cloud.microsoft/owa/service.svc?action=GetAccessTokenforResource",
              {"authorization": "Bearer abc", "x-anchormailbox": "PUID:1@t", "cookie": "secret", "action": "X"}))]
got = ob.wait_signed_in(LoginPage(steps), NoCookies(), "https://outlook.office.com", watcher, 5)
assert got == ("https://outlook.cloud.microsoft", {"authorization": "Bearer abc", "x-anchormailbox": "PUID:1@t"}), got
print("new Outlook bearer ->", got[0], sorted(got[1]))

watcher = ob.AuthWatcher()
got = ob.wait_signed_in(LoginPage([("https://outlook.office.com/mail/", None)]), CanaryCookies(), "https://outlook.office.com", watcher, 3)
assert got == ("https://outlook.office.com", {"x-owa-canary": "C1"}), got
print("classic canary ->", got)

watcher = ob.AuthWatcher()
got = ob.wait_signed_in(LoginPage([("https://login.microsoftonline.com/x", None)]), NoCookies(), "https://outlook.office.com", watcher, 2)
assert got is None
print("still on login page -> None")
print("python bridge OK")
