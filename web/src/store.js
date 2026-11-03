import { reactive, computed, watch } from "vue";
import { demoAssignments, demoMaterials, demoMails, demoEvents } from "./demo.js";
import { api, daysUntil, readStorage, writeStorage, dayKey, fmt } from "./utils.js";

const ROUTES = ["home", "assignments", "materials", "inbox", "settings"];
const DEMO_COUNTS = { courses: 5, assignments: 7, materials: 7 };

export const state = reactive({
  route: "home",
  assignments: demoAssignments(),
  materials: demoMaterials(),
  mails: demoMails(),
  events: demoEvents(),
  profile: { displayName: "同学", subtitle: "自托管学习空间", ...readStorage("polyflow-profile", {}) },
  app: { name: "PolyFlow", institution: "Your University", version: "0.3.0" },
  completed: new Set(readStorage("polyflow-completed", [])),
  saved: new Set(readStorage("polyflow-saved", ["m6"])),
  preferences: {
    chineseFirst: true,
    deadlineAlerts: true,
    conciseSummary: true,
    emailDigest: false,
    autoAi: false,
    ...readStorage("polyflow-preferences", {})
  },
  theme: readStorage("polyflow-theme", "system"),
  demoDismissed: readStorage("polyflow-demo-dismissed", false),
  integration: {
    loading: true,
    reachable: false,
    deepseek: { configured: false, model: "deepseek-chat", mock: false },
    canvas: { configured: false, mode: "demo", baseUrl: "https://canvas.polyu.edu.hk", bridgeEnabled: false, source: null, account: null },
    outlook: { configured: false, source: null, app: null, account: null, lastSync: null, bridgeEnabled: false, localEnabled: false }
  },
  mailSync: { busy: false, connecting: null, lastSync: null, error: null, errorCode: null, warnings: [] },
  canvasSync: { busy: false, connecting: false, lastSync: null, error: null, errorCode: null, counts: { ...DEMO_COUNTS } },
  aiBusy: null,
  overlay: null, // { type: 'assignment'|'search'|'calendar'|'canvas'|'outlook'|'deepseek', id? }
  toast: null,
  menuOpen: false,
  profileMenu: false,
  inbox: { filter: "all", selected: "mail-1", showTranslation: true, readerOpen: false }
});

// ---------- derived ----------
export const isAttendance = (a) => a?.category === "attendance" || /class[\s_-]*attendance|课堂出席|出席记录/i.test(a?.title || "");
export const isSubmitted = (a) => Boolean(a?.isSubmitted || ["submitted", "graded", "pending_review"].includes(a?.submissionState));
export const isComplete = (a) => state.completed.has(a.id);
export const isResolved = (a) => isComplete(a) || isSubmitted(a);
export const isUrgent = (a) => !isResolved(a) && a.due && daysUntil(a.due) <= 2 && daysUntil(a.due) >= -1;

export function statusOf(a) {
  if (isSubmitted(a)) return a.submissionState === "graded" ? "已评分" : "已提交";
  if (isComplete(a)) return "已完成";
  return null;
}

const byDue = (a, b) => (a.due ? new Date(a.due) : Infinity) - (b.due ? new Date(b.due) : Infinity);

export const pending = computed(() =>
  state.assignments
    .filter((a) => !isResolved(a) && !isAttendance(a) && a.due && daysUntil(a.due) >= -30 && daysUntil(a.due) <= 365)
    .sort(byDue)
);
export const upcoming = computed(() => pending.value.filter((a) => daysUntil(a.due) >= 0));
export const undated = computed(() => state.assignments.filter((a) => !isResolved(a) && !isAttendance(a) && !a.due));
export const unreadCount = computed(() => state.mails.filter((m) => m.unread).length);
export const isLive = computed(() => state.integration.canvas.configured);
/** Canvas session expired or never completed: retrying will not help, the user has to sign in again. */
export const mailLive = computed(() => state.integration.outlook.configured);
export const outlookNeedsLogin = computed(() => ["AUTH_EXPIRED", "LOGIN_REQUIRED"].includes(state.mailSync.errorCode));
export const needsLogin = computed(() => ["AUTH_EXPIRED", "LOGIN_REQUIRED", "CANVAS_NOT_CONFIGURED"].includes(state.canvasSync.errorCode));

// ---------- persistence ----------
watch(() => [...state.completed], (v) => writeStorage("polyflow-completed", v));
watch(() => [...state.saved], (v) => writeStorage("polyflow-saved", v));
watch(() => ({ ...state.preferences }), (v) => writeStorage("polyflow-preferences", v));
watch(() => state.theme, (v) => {
  writeStorage("polyflow-theme", v);
  applyTheme();
});

export function applyTheme() {
  const root = document.documentElement;
  if (state.theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", state.theme);
}

// ---------- routing (hash) ----------
function readRoute() {
  const route = location.hash.replace(/^#\/?/, "") || "home";
  return ROUTES.includes(route) ? route : "home";
}
export function initRouter() {
  state.route = readRoute();
  window.addEventListener("hashchange", () => {
    state.route = readRoute();
    state.menuOpen = false;
    window.scrollTo({ top: 0 });
  });
}
export function go(route) {
  if (location.hash !== `#${route}`) location.hash = route;
  else state.route = route;
  state.menuOpen = false;
}

// ---------- ui ----------
let toastTimer;
export function toast(message) {
  clearTimeout(toastTimer);
  state.toast = { message, key: Date.now() };
  toastTimer = setTimeout(() => (state.toast = null), 3000);
}
export function open(type, id) {
  state.profileMenu = false;
  state.overlay = { type, id };
}
export function close() {
  state.overlay = null;
}

// ---------- local actions ----------
export function toggleComplete(id) {
  const a = state.assignments.find((x) => x.id === id);
  if (state.completed.has(id)) {
    state.completed.delete(id);
    toast(`已重新打开“${a?.title || "任务"}”`);
  } else {
    state.completed.add(id);
    toast(`已将“${a?.title || "任务"}”标记为完成`);
  }
}
export function toggleSaved(id) {
  if (state.saved.has(id)) {
    state.saved.delete(id);
    toast("已取消收藏");
  } else {
    state.saved.add(id);
    toast("已收藏");
  }
}
export function openMaterial(m) {
  if (m?.source) window.open(m.source, "_blank", "noopener");
  else toast(`演示资料：连接 Canvas 后可直接打开“${m?.title}”`);
}
export function openMail(id) {
  const mail = state.mails.find((m) => m.id === id);
  if (!mail) return;
  mail.unread = false;
  state.inbox.selected = id;
  state.inbox.readerOpen = true;
  state.inbox.showTranslation = state.preferences.chineseFirst;
  close();
  go("inbox");
  autoAi(mail);
}

/** Optional: generate summary (and translation) when a real mail is opened. Off by default. */
export function autoAi(mail) {
  if (!mail?.live || !state.preferences.autoAi || !state.integration.deepseek.configured || state.aiBusy) return;
  if (!mail.summary) {
    rewriteMail("summarize", mail).then(() => {
      if (!mail.translation && state.preferences.chineseFirst) rewriteMail("translate", mail);
    });
  } else if (!mail.translation && state.preferences.chineseFirst) {
    rewriteMail("translate", mail);
  }
}
export function dismissDemo() {
  state.demoDismissed = true;
  writeStorage("polyflow-demo-dismissed", true);
}
export function saveName(name) {
  const value = name.trim().slice(0, 40);
  if (!value) return toast("名字不能为空");
  state.profile.displayName = value;
  writeStorage("polyflow-profile", { ...state.profile });
  toast("名字已保存");
}
export async function copySummary(mail) {
  const text = `${mail.subject}\n\n${mail.summary.map((l) => `• ${l}`).join("\n")}`;
  try {
    await navigator.clipboard.writeText(text);
    toast("摘要已复制");
  } catch {
    toast("浏览器没有允许访问剪贴板");
  }
}

// ---------- server ----------
export async function loadStatus() {
  try {
    const data = await api("./api/integrations/status");
    Object.assign(state.app, data.app || {});
    state.integration.deepseek = { ...state.integration.deepseek, ...data.deepseek };
    state.integration.canvas = { ...state.integration.canvas, ...data.canvas };
    if (data.outlook) state.integration.outlook = { ...state.integration.outlook, ...data.outlook };
    state.integration.reachable = true;
  } catch {
    state.integration.reachable = false;
  } finally {
    state.integration.loading = false;
  }
  if (state.integration.canvas.configured) syncCanvas({ silent: true });
  if (state.integration.outlook.configured) syncOutlook({ silent: true });
}

export async function syncCanvas({ force = false, silent = false } = {}) {
  if (state.canvasSync.busy) return;
  if (!state.integration.canvas.configured) {
    if (!silent) open("canvas");
    return;
  }
  state.canvasSync.busy = true;
  state.canvasSync.error = null;
  state.canvasSync.errorCode = null;
  try {
    const data = await api(`./api/canvas/sync${force ? "?refresh=1" : ""}`);
    if (Array.isArray(data.assignments)) state.assignments = data.assignments;
    if (Array.isArray(data.materials)) state.materials = data.materials;
    state.canvasSync.counts = data.counts || {
      courses: data.courses?.length || 0,
      assignments: data.assignments?.length || 0,
      materials: data.materials?.length || 0
    };
    state.canvasSync.lastSync = data.fetchedAt || new Date().toISOString();
    if (!silent) toast(`Canvas 已同步，共 ${state.canvasSync.counts.assignments} 项作业`);
  } catch (error) {
    state.canvasSync.error = error.message;
    state.canvasSync.errorCode = error.code || null;
    if (!silent) toast(error.message);
  } finally {
    state.canvasSync.busy = false;
  }
}

function applyCanvasConnected(data, mode) {
  state.integration.canvas = { ...state.integration.canvas, ...data.canvas, configured: true, mode };
  state.canvasSync.error = null;
  state.canvasSync.errorCode = null;
  close();
}

export async function connectCanvasToken(baseUrl, token) {
  if (state.canvasSync.connecting) return;
  if (!baseUrl || !token) return toast("请填写 Canvas 地址和 Token");
  state.canvasSync.connecting = true;
  try {
    const data = await api("./api/integrations/canvas/connect", { method: "POST", body: { baseUrl, token } });
    applyCanvasConnected(data, "live");
    toast(`已连接 ${data.canvas?.account?.name || "Canvas"}，正在同步`);
    syncCanvas({ force: true, silent: true });
  } catch (error) {
    toast(error.message);
  } finally {
    state.canvasSync.connecting = false;
  }
}

export async function loginCanvasBridge() {
  if (state.canvasSync.connecting) return;
  state.canvasSync.connecting = true;
  try {
    const data = await api("./api/integrations/canvas/bridge/login", {
      method: "POST",
      body: { baseUrl: state.integration.canvas.baseUrl || "https://canvas.polyu.edu.hk" }
    });
    applyCanvasConnected(data, "browser-session");
    toast(`已连接 Canvas：${data.canvas?.account?.name || "当前账号"}`);
    syncCanvas({ silent: true });
  } catch (error) {
    toast(error.message);
  } finally {
    state.canvasSync.connecting = false;
  }
}

export async function disconnectCanvas() {
  try {
    const data = await api("./api/integrations/canvas", { method: "DELETE" });
    state.integration.canvas = { ...state.integration.canvas, ...data.canvas };
    state.canvasSync.lastSync = null;
    state.canvasSync.counts = { ...DEMO_COUNTS };
    state.assignments = demoAssignments();
    state.materials = demoMaterials();
    close();
    toast("已断开 Canvas，服务器上的凭据已删除");
  } catch (error) {
    toast(error.message);
  }
}

export async function testDeepSeek() {
  if (state.aiBusy) return;
  state.aiBusy = { task: "test" };
  try {
    const result = await api("./api/ai/test", { method: "POST", body: {} });
    toast(`${result.message}（${result.model}${result.mock ? "，Mock" : ""}）`);
  } catch (error) {
    toast(error.message);
  } finally {
    state.aiBusy = null;
  }
}

export async function rewriteMail(task, mail) {
  if (state.aiBusy) return;
  state.aiBusy = { task, mailId: mail.id };
  const body = { title: mail.subjectEn || mail.subject, text: mail.original.join("\n\n").slice(0, 20000) || mail.preview || mail.subject };
  try {
    if (task === "summarize") {
      const r = await api("./api/ai/summarize", { method: "POST", body });
      mail.summary = r.summary;
      if (r.action) mail.action = r.action;
      rememberAi(mail.id, { summary: r.summary, action: r.action });
      toast("DeepSeek 已重写摘要");
    } else {
      const r = await api("./api/ai/translate", { method: "POST", body });
      mail.translatedSubject = r.translationTitle || null;
      mail.translation = r.paragraphs;
      rememberAi(mail.id, { translation: r.paragraphs, translatedSubject: r.translationTitle || null });
      state.inbox.showTranslation = true;
      toast("DeepSeek 已重新翻译");
    }
  } catch (error) {
    toast(error.code === "NOT_CONFIGURED" ? "DeepSeek 还没配置，请在 .env.local 填写 DEEPSEEK_API_KEY" : error.message);
  } finally {
    state.aiBusy = null;
  }
}

// ---------- search ----------
export function search(term) {
  const q = term.trim().toLowerCase();
  const hit = (s) => s.toLowerCase().includes(q);
  return [
    ...state.assignments
      .filter((a) => !isAttendance(a) && hit(`${a.title} ${a.titleEn} ${a.course} ${a.code}`))
      .map((a) => ({ type: "assignment", id: a.id, title: a.title, meta: a.course, color: a.course })),
    ...state.mails
      .filter((m) => hit(`${m.subject} ${m.subjectEn} ${m.sender} ${m.preview}`))
      .map((m) => ({ type: "mail", id: m.id, title: m.subject, meta: m.sender })),
    ...state.materials
      .filter((m) => hit(`${m.title} ${m.course} ${m.type}`))
      .map((m) => ({ type: "material", id: m.id, title: m.title, meta: m.course, color: m.course }))
  ].slice(0, 12);
}

// ---------- Outlook / mail ----------
const AI_CACHE_KEY = "polyflow-ai-cache";
const aiCache = readStorage(AI_CACHE_KEY, {});

function rememberAi(id, patch) {
  aiCache[id] = { ...(aiCache[id] || {}), ...patch, at: Date.now() };
  const ids = Object.keys(aiCache).sort((a, b) => aiCache[b].at - aiCache[a].at);
  for (const old of ids.slice(150)) delete aiCache[old];
  writeStorage(AI_CACHE_KEY, aiCache);
}

const CODE_RE = /\b([A-Z]{3,4})\s?(\d{4}[A-Z]?)\b/;
function courseFromText(text = "") {
  const match = text.toUpperCase().match(CODE_RE);
  if (!match) return null;
  const code = `${match[1]}${match[2]}`;
  const a = state.assignments.find((x) => (x.code || "").toUpperCase().replace(/\s/g, "") === code);
  return { code, course: a?.course || code, assignment: a?.id || null };
}

function mailTime(iso) {
  if (!iso) return "";
  const diff = Math.round((new Date(`${dayKey(new Date())}T00:00:00+08:00`) - new Date(`${dayKey(iso)}T00:00:00+08:00`)) / 86400000);
  if (diff <= 0) return fmt.time.format(new Date(iso));
  if (diff === 1) return "昨天";
  if (diff < 7) return fmt.weekday.format(new Date(iso));
  return fmt.short.format(new Date(iso));
}

function initials(name = "") {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, " ").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "@";
  if (/[一-鿿]/.test(words[0])) return words[0].slice(0, 1);
  return (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
}

function toUiMail(m) {
  const paragraphs = (m.body || m.preview || "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const match = courseFromText(`${m.subject} ${m.preview}`);
  const cached = aiCache[m.id] || {};
  return {
    id: m.id,
    live: true,
    source: initials(m.sender),
    sender: m.sender,
    senderEmail: m.senderEmail,
    subject: m.subject,
    subjectEn: m.subject,
    translatedSubject: cached.translatedSubject || null,
    preview: m.preview || paragraphs[0] || "",
    time: mailTime(m.receivedAt),
    receivedAt: m.receivedAt,
    unread: m.unread,
    important: m.important,
    tag: match?.code || (m.important ? "重要" : "收件箱"),
    original: paragraphs.length ? paragraphs : [m.preview || "（没有正文）"],
    translation: cached.translation || null,
    summary: cached.summary || null,
    action: null,
    link: m.link,
    assignment: match?.assignment || null
  };
}

function toUiEvent(e) {
  const start = new Date(e.start);
  const end = e.end ? new Date(e.end) : null;
  const match = courseFromText(e.title);
  return {
    id: e.id,
    date: dayKey(start),
    time: e.allDay ? "全天" : fmt.time.format(start),
    end: e.allDay || !end ? "" : fmt.time.format(end),
    title: e.title,
    place: e.location || e.organizer || "",
    course: match?.course || "",
    assignment: match?.assignment || null,
    live: true
  };
}

function applyOutlookData(data) {
  state.mails = (data.mails || []).map(toUiMail);
  state.events = (data.events || []).map(toUiEvent);
  state.mailSync.lastSync = data.fetchedAt || new Date().toISOString();
  state.mailSync.warnings = data.warnings || [];
  if (data.account) state.integration.outlook.account = data.account;
  if (!state.mails.some((m) => m.id === state.inbox.selected)) {
    state.inbox.selected = state.mails[0]?.id || null;
    state.inbox.readerOpen = false;
  }
}

export async function syncOutlook({ force = false, silent = false } = {}) {
  if (state.mailSync.busy) return;
  if (!state.integration.outlook.configured) {
    if (!silent) open("outlook");
    return;
  }
  state.mailSync.busy = true;
  state.mailSync.error = null;
  state.mailSync.errorCode = null;
  try {
    const data = await api(`./api/outlook/sync${force ? "?refresh=1" : ""}`);
    applyOutlookData(data);
    if (!silent) toast(`邮件已同步，${data.counts?.unread ?? 0} 封未读`);
  } catch (error) {
    state.mailSync.error = error.message;
    state.mailSync.errorCode = error.code || null;
    if (!silent) toast(error.message);
  } finally {
    state.mailSync.busy = false;
  }
}

async function connectOutlook(kind, request) {
  if (state.mailSync.connecting) return;
  state.mailSync.connecting = kind;
  try {
    const data = await request();
    state.integration.outlook = { ...state.integration.outlook, ...data.outlook };
    state.mailSync.error = null;
    state.mailSync.errorCode = null;
    close();
    toast(`Outlook 已连接，读到 ${data.counts?.mails ?? 0} 封邮件`);
    await syncOutlook({ silent: true });
  } catch (error) {
    toast(error.message);
    state.mailSync.error = error.message;
    state.mailSync.errorCode = error.code || null;
  } finally {
    state.mailSync.connecting = null;
  }
}

export const loginOutlookBridge = () =>
  connectOutlook("bridge", () => api("./api/integrations/outlook/bridge/login", { method: "POST", body: {} }));

export const connectOutlookLocal = (app) =>
  connectOutlook(app, () => api("./api/integrations/outlook/local/connect", { method: "POST", body: { app } }));

export async function disconnectOutlook() {
  try {
    const data = await api("./api/integrations/outlook", { method: "DELETE" });
    state.integration.outlook = { ...state.integration.outlook, ...data.outlook };
    state.mails = demoMails();
    state.events = demoEvents();
    state.mailSync = { busy: false, connecting: null, lastSync: null, error: null, errorCode: null, warnings: [] };
    state.inbox.selected = "mail-1";
    state.inbox.readerOpen = false;
    close();
    toast("已断开 Outlook，本机保存的登录信息已删除");
  } catch (error) {
    toast(error.message);
  }
}
