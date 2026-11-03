// Offline tests for bridge/mac_mail.js: fake Mail / Outlook / EventKit objects, run in Node.
// Run: node tests/test_mac_mail.mjs
import { readFileSync } from "node:fs";
import vm from "node:vm";
const src = readFileSync(new URL("../bridge/mac_mail.js", import.meta.url), "utf8");

function mailMock({ deny = false } = {}) {
  const msgs = [
    { d: new Date("2026-10-30T10:00:00Z"), s: "Old", f: "Library <lib@polyu.edu.hk>", r: true, id: "a@x", c: "Old body" },
    { d: new Date("2026-11-02T09:00:00Z"), s: "Newest", f: '"Prof. Wong" <km.wong@polyu.edu.hk>', r: false, id: "b@x", c: "Line1\r\n\r\n\r\nLine2" },
    { d: new Date("2026-11-01T09:00:00Z"), s: "", f: "noreply@teams.microsoft.com", r: true, id: "c@x", c: "" },
  ];
  const coll = msgs.map((m) => ({ subject: () => m.s, sender: () => m.f, readStatus: () => m.r, messageId: () => m.id, content: () => m.c, flaggedStatus: () => false }));
  coll.dateReceived = () => { if (deny) { const e = new Error("Not authorized"); e.errorNumber = -1743; throw e; } return msgs.map((m) => m.d); };
  return { inbox: { messages: coll } };
}
function outlookNew() { return { inbox: { get messages() { return { timeReceived() { throw new Error("not supported"); } }; } } }; }

// EventKit fake: authorized, two events
function eventKit(status) {
  const ev = (t, s, e, loc) => ({ title: t, startDate: s, endDate: e, location: loc, allDay: false, eventIdentifier: t, calendar: { title: "PolyU" } });
  const list = [ev("Lecture B", new Date("2026-11-04T01:30:00Z"), new Date("2026-11-04T04:20:00Z"), "N001"), ev("Lecture A", new Date("2026-11-03T01:30:00Z"), new Date("2026-11-03T04:20:00Z"), "Y302")];
  return {
    EKEventStore: { authorizationStatusForEntityType: () => status, alloc: { init: { predicateForEventsWithStartDateEndDateCalendars: () => ({}), eventsMatchingPredicate: () => ({ count: list.length, objectAtIndex: (i) => list[i] }) } } },
    NSDate: { dateWithTimeIntervalSince1970: (x) => x, dateWithTimeIntervalSinceNow: (x) => x },
    NSRunLoop: { currentRunLoop: { runUntilDate() {} } }
  };
}

function runWith(apps, $, argv) {
  const ctx = { ObjC: { import() {}, unwrap: (x) => x }, $, Application: (name) => { if (!apps[name]) throw new Error("not found"); return apps[name]; }, console };
  vm.createContext(ctx);
  vm.runInContext(src + "\n;this.__out = run(" + JSON.stringify(argv) + ");", ctx);
  return JSON.parse(ctx.__out);
}

let r = runWith({ Mail: mailMock() }, eventKit(3), ["mail"]);
console.log(r.counts, r.warnings, r.mails.map((m) => [m.subject, m.sender, m.senderEmail, m.unread]), r.events.map((e) => e.title));
if (r.mails[0].subject !== "Newest" || r.mails[0].body !== "Line1\n\nLine2" || r.mails[0].link !== "message://%3Cb%40x%3E") throw new Error("mail order/body/link");
if (r.mails[1].subject !== "（无主题）" || r.mails[2].sender !== "Library") throw new Error("parse");
if (r.events[0].title !== "Lecture A") throw new Error("event sort");

r = runWith({ Mail: mailMock() }, eventKit(2), ["mail"]);
console.log("calendar denied ->", r.warnings[0].slice(0, 20), r.counts);
r = runWith({ Mail: mailMock({ deny: true }) }, eventKit(3), ["mail"]);
console.log("automation denied ->", r.code);
r = runWith({ "Microsoft Outlook": outlookNew() }, eventKit(3), ["outlook"]);
console.log("new outlook ->", r.code);
r = runWith({}, eventKit(3), ["outlook"]);
console.log("no outlook ->", r.code);
console.log("JXA logic OK");
