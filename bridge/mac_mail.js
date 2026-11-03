// PolyFlow: read mail and calendar that are already synced to this Mac.
//
// Run with:  osascript -l JavaScript bridge/mac_mail.js <mail|outlook> [--no-calendar]
//
// * mail     Apple Mail (the built-in "Mail" app), all inboxes.
// * outlook  Microsoft Outlook for Mac, legacy mode. "New Outlook" has no scripting
//            support, so it reports OUTLOOK_NEW_UNSUPPORTED instead.
// * Calendar comes from the macOS calendar database through EventKit, so recurring
//   classes are expanded. It covers every account added to the Calendar app.
//
// Read-only: nothing is sent, moved, deleted or marked as read.
// macOS asks once for permission to control Mail/Outlook and to read calendars.
// Output: one JSON line on stdout, same schema as bridge/outlook_bridge.py.

ObjC.import("Foundation");

const MAIL_LIMIT = 40;
const BODY_LIMIT = 25;
const BODY_CHARS = 12000;
const CAL_PAST_DAYS = 1;
const CAL_FUTURE_DAYS = 21;

function clean(value, limit) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim().slice(0, limit || 500);
}

function bodyText(value) {
  if (!value) return "";
  return String(value)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, BODY_CHARS);
}

function hash(text) {
  // Small stable hash for ids (FNV-1a, hex).
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return ("0000000" + h.toString(16)).slice(-8);
}

function isoDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

function parseSender(raw) {
  const text = clean(raw, 300);
  const match = text.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (match) return { name: clean(match[1], 160) || clean(match[2], 200), email: clean(match[2], 200) };
  return { name: text || "未知发件人", email: /@/.test(text) ? text : "" };
}

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

// Indexes of the newest `limit` messages, given an array of dates.
function newest(dates, limit) {
  return dates
    .map((date, index) => ({ index, time: date ? new Date(date).getTime() : 0 }))
    .sort((a, b) => b.time - a.time)
    .slice(0, limit)
    .map((entry) => entry.index);
}

// ---------------------------------------------------------------- Apple Mail
function readAppleMail() {
  const Mail = Application("Mail");
  const messages = Mail.inbox.messages;
  const dates = messages.dateReceived();
  const picked = newest(dates, MAIL_LIMIT);
  return picked.map((index, position) => {
    const message = messages[index];
    const sender = parseSender(message.sender());
    const messageId = clean(message.messageId(), 500);
    let body = "";
    if (position < BODY_LIMIT) {
      try {
        body = bodyText(message.content());
      } catch (e) {
        body = "";
      }
    }
    return {
      id: `mac-${hash(messageId || `${sender.email}${dates[index]}`)}`,
      sender: sender.name,
      senderEmail: sender.email,
      subject: clean(message.subject(), 300) || "（无主题）",
      receivedAt: isoDate(dates[index]),
      unread: !message.readStatus(),
      preview: clean(body, 200),
      body,
      hasAttachments: false,
      important: Boolean(message.flaggedStatus()),
      link: messageId ? `message://%3C${encodeURIComponent(messageId)}%3E` : null
    };
  });
}

// ----------------------------------------------------- Outlook for Mac (legacy)
function readOutlook() {
  let Outlook;
  try {
    Outlook = Application("Microsoft Outlook");
  } catch (e) {
    fail("APP_NOT_FOUND", "这台 Mac 上没有找到 Microsoft Outlook。");
  }
  let messages, dates;
  try {
    messages = Outlook.inbox.messages;
    dates = messages.timeReceived();
  } catch (e) {
    if (e.errorNumber === -1743) throw e;
    fail(
      "OUTLOOK_NEW_UNSUPPORTED",
      "新版 Outlook for Mac 不支持被其他程序读取。请在 Outlook 菜单里关闭“新版 Outlook”，或改用 Apple 邮件 / 浏览器登录。"
    );
  }
  const picked = newest(dates, MAIL_LIMIT);
  return picked.map((index, position) => {
    const message = messages[index];
    let sender = { name: "未知发件人", email: "" };
    try {
      const raw = message.sender();
      sender = { name: clean(raw.name, 160) || clean(raw.address, 200), email: clean(raw.address, 200) };
    } catch (e) {
      /* some system messages have no sender */
    }
    let body = "";
    if (position < BODY_LIMIT) {
      try {
        body = bodyText(message.plainTextContent());
      } catch (e) {
        body = "";
      }
    }
    const id = String(message.id());
    return {
      id: `mac-${hash(`outlook-${id}`)}`,
      sender: sender.name,
      senderEmail: sender.email,
      subject: clean(message.subject(), 300) || "（无主题）",
      receivedAt: isoDate(dates[index]),
      unread: !message.isRead(),
      preview: clean(body, 200),
      body,
      hasAttachments: false,
      important: false,
      link: null
    };
  });
}

// ------------------------------------------------------------------ Calendar
function readCalendar() {
  ObjC.import("EventKit");
  const ENTITY_EVENT = 0;
  const status = Number($.EKEventStore.authorizationStatusForEntityType(ENTITY_EVENT));
  const store = $.EKEventStore.alloc.init;
  // 0 not determined, 1 restricted, 2 denied, 3 full access, 4 write-only
  if (status === 0) {
    let done = false;
    const callback = () => {
      done = true;
    };
    if (store.respondsToSelector("requestFullAccessToEventsWithCompletion:")) {
      store.requestFullAccessToEventsWithCompletion(callback);
    } else {
      store.requestAccessToEntityTypeCompletion(ENTITY_EVENT, callback);
    }
    for (let i = 0; i < 600 && !done; i++) {
      $.NSRunLoop.currentRunLoop.runUntilDate($.NSDate.dateWithTimeIntervalSinceNow(0.1));
    }
  }
  const finalStatus = Number($.EKEventStore.authorizationStatusForEntityType(ENTITY_EVENT));
  if (finalStatus !== 3) {
    return {
      events: [],
      warning: "日历没有读取权限。请在“系统设置 → 隐私与安全性 → 日历”里允许“终端”（或你启动 PolyFlow 的程序），然后重新同步。"
    };
  }
  const reader = finalStatus === status ? store : $.EKEventStore.alloc.init;
  const start = new Date();
  start.setDate(start.getDate() - CAL_PAST_DAYS);
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setDate(end.getDate() + CAL_FUTURE_DAYS);
  const predicate = reader.predicateForEventsWithStartDateEndDateCalendars(
    $.NSDate.dateWithTimeIntervalSince1970(start.getTime() / 1000),
    $.NSDate.dateWithTimeIntervalSince1970(end.getTime() / 1000),
    null
  );
  const found = reader.eventsMatchingPredicate(predicate);
  const events = [];
  for (let i = 0; i < Number(found.count); i++) {
    const event = found.objectAtIndex(i);
    const startDate = ObjC.unwrap(event.startDate);
    const identifier = clean(ObjC.unwrap(event.eventIdentifier), 300);
    events.push({
      id: `mac-ev-${hash(`${identifier}${isoDate(startDate)}`)}`,
      title: clean(ObjC.unwrap(event.title), 200) || "（无标题）",
      start: isoDate(startDate),
      end: isoDate(ObjC.unwrap(event.endDate)),
      allDay: Boolean(event.allDay),
      location: clean(ObjC.unwrap(event.location), 200),
      organizer: clean(ObjC.unwrap(event.calendar.title), 160)
    });
  }
  events.sort((a, b) => String(a.start).localeCompare(String(b.start)));
  return { events, warning: null };
}

// ---------------------------------------------------------------------- main
function run(argv) {
  const app = argv[0] === "outlook" ? "outlook" : "mail";
  const withCalendar = argv.indexOf("--no-calendar") === -1;
  try {
    const mails = app === "outlook" ? readOutlook() : readAppleMail();
    const warnings = [];
    let events = [];
    if (withCalendar) {
      try {
        const calendar = readCalendar();
        events = calendar.events;
        if (calendar.warning) warnings.push(calendar.warning);
      } catch (e) {
        warnings.push(`日历没有读到：${clean(e.message, 160)}。邮件不受影响。`);
      }
    }
    if (!mails.length) {
      warnings.push(
        app === "outlook"
          ? "Outlook 没有返回任何邮件。如果你用的是新版 Outlook，它不支持被读取：请在 Outlook 菜单里关闭“新版 Outlook”，或改用“邮件”App / 浏览器登录。"
          : "“邮件”App 的收件箱是空的。请确认学校邮箱已经添加到“邮件”App 并完成同步。"
      );
    }
    return JSON.stringify({
      source: "local",
      app,
      account: null,
      fetchedAt: new Date().toISOString(),
      mails,
      events,
      warnings,
      counts: { mails: mails.length, unread: mails.filter((m) => m.unread).length, events: events.length }
    });
  } catch (e) {
    let code = e.code || "LOCAL_MAIL_ERROR";
    let message = clean(e.message, 400) || "读取本机邮件失败。";
    if (e.errorNumber === -1743) {
      code = "AUTOMATION_DENIED";
      message = `macOS 没有允许 PolyFlow 读取${app === "outlook" ? " Outlook" : "“邮件”App"}。请在“系统设置 → 隐私与安全性 → 自动化”里，为“终端”（或你启动 PolyFlow 的程序）勾选${app === "outlook" ? " Microsoft Outlook" : "“邮件”"}，再重试。`;
    } else if (e.errorNumber === -600 || e.errorNumber === -609) {
      code = "APP_NOT_RUNNING";
      message = `${app === "outlook" ? "Outlook" : "“邮件”App"} 没有响应。请先打开它并等收件箱加载完，再重试。`;
    }
    return JSON.stringify({ code, message });
  }
}
