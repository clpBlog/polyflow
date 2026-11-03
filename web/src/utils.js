const TZ = "Asia/Hong_Kong";

export const fmt = {
  full: new Intl.DateTimeFormat("zh-CN", { timeZone: TZ, month: "long", day: "numeric", weekday: "long" }),
  short: new Intl.DateTimeFormat("zh-CN", { timeZone: TZ, month: "numeric", day: "numeric" }),
  weekday: new Intl.DateTimeFormat("zh-CN", { timeZone: TZ, weekday: "short" }),
  time: new Intl.DateTimeFormat("zh-CN", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }),
  monthTitle: new Intl.DateTimeFormat("zh-CN", { timeZone: TZ, year: "numeric", month: "long" })
};

/** Calendar parts of a date in Hong Kong time. */
export function hkParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hour12: false, weekday: "short"
  }).formatToParts(new Date(date));
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { y: Number(get("year")), m: Number(get("month")), d: Number(get("day")), h: Number(get("hour")) % 24, wd };
}

/** Day key (YYYY-MM-DD) in HKT. */
export function dayKey(date) {
  const { y, m, d } = hkParts(date);
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Midnight HKT for a day key, as Date. */
export function fromDayKey(key) {
  return new Date(`${key}T00:00:00+08:00`);
}

export function addDays(key, n) {
  const date = fromDayKey(key);
  date.setUTCDate(date.getUTCDate() + n);
  return dayKey(date);
}

export function daysUntil(iso) {
  if (!iso) return Infinity;
  return Math.round((fromDayKey(dayKey(iso)) - fromDayKey(dayKey(new Date()))) / 86400000);
}

export function dueLabel(iso) {
  if (!iso) return "无截止时间";
  const d = daysUntil(iso);
  if (d < 0) return `已逾期 ${-d} 天`;
  if (d === 0) return "今天截止";
  if (d === 1) return "明天截止";
  if (d <= 7) return `${d} 天后截止`;
  return `${fmt.short.format(new Date(iso))} 截止`;
}

export function relativeDay(iso) {
  if (!iso) return "待定";
  const d = daysUntil(iso);
  if (d === 0) return "今天";
  if (d === 1) return "明天";
  if (d === -1) return "昨天";
  if (d > 1 && d < 7) return fmt.weekday.format(new Date(iso));
  return fmt.short.format(new Date(iso));
}

export function dateTime(iso) {
  if (!iso) return "无截止时间";
  const date = new Date(iso);
  return `${fmt.short.format(date)} ${fmt.time.format(date)}`;
}

export function countdown(iso) {
  if (!iso) return null;
  const ms = new Date(iso) - Date.now();
  if (ms <= 0) return { text: "已过截止时间", overdue: true };
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(hours / 24);
  if (days >= 1) return { text: `${days} 天 ${hours % 24} 小时`, days, hours: hours % 24 };
  const minutes = Math.floor((ms % 3600000) / 60000);
  return { text: `${hours} 小时 ${minutes} 分`, days: 0, hours };
}

export function greeting() {
  const h = hkParts().h;
  if (h < 5) return "夜深了";
  if (h < 12) return "早上好";
  if (h < 18) return "下午好";
  return "晚上好";
}

const COURSE_HUES = ["#2F7D74", "#4459A8", "#8A3F77", "#6E7F2E", "#2C6E9E", "#B0562E", "#5B5F97"];
const courseIndex = new Map();
export function courseColor(name = "") {
  if (!name) return "#8A928D";
  if (!courseIndex.has(name)) {
    let hash = 0;
    for (const ch of name) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
    courseIndex.set(name, COURSE_HUES[hash % COURSE_HUES.length]);
  }
  return courseIndex.get(name);
}

export function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable */
  }
}

export async function api(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(path, {
      method,
      cache: "no-store",
      headers: { accept: "application/json", ...(body ? { "content-type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    const error = new Error("连不上本地服务。请用“启动 PolyFlow”或 npm start 启动后再试。");
    error.code = "PROXY_UNREACHABLE";
    throw error;
  }
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) {
    const error = new Error(data.message || `请求失败（HTTP ${response.status}）`);
    error.code = data.code;
    error.status = response.status;
    throw error;
  }
  return data;
}
