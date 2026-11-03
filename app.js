if (location.protocol === "file:") {
  location.replace(`http://127.0.0.1:4173/${location.hash}`);
}

const assignments = [
  {
    id: "a1",
    course: "AI & Digital Transformation",
    code: "COMP6309",
    title: "个人案例分析报告",
    titleEn: "Individual Case Analysis Report",
    due: "2026-10-30T23:59:00+08:00",
    points: "100 分",
    submission: "文件上传",
    format: "DOC, DOCX, PDF",
    priority: "高优先级",
    summary: "选择一个具体的 AI 应用场景，完成从问题定义、技术方案到部署可行性的案例分析。",
    description:
      "针对一个具体 AI 应用案例的分析报告。学生可从金融科技、物联网与智能制造、教育科技、创意广告、数字娱乐、绿色技术等行业的具体业务场景中，抽取一个清晰、可操作的问题或任务。",
    requirements: [
      "建议 3,000–4,000 字，中文撰写",
      "界定业务情境、机器学习任务类型与性能指标",
      "说明数据来源、模型选择、架构流程与合理性",
      "分析部署可行性、数据治理与风险控制",
      "文件支持 DOC、DOCX 或 PDF"
    ],
    source:
      "https://canvas.polyu.edu.hk/courses/6309/assignments/26235"
  },
  {
    id: "a2",
    course: "Cloud Computing",
    code: "COMP5421",
    title: "实验三：容器部署反思",
    titleEn: "Lab 3: Container Deployment Reflection",
    due: "2026-10-31T18:00:00+08:00",
    points: "40 分",
    submission: "文字提交",
    format: "在线文本框",
    priority: "即将截止",
    summary: "复盘 Docker 与 Kubernetes 实验，比较两种部署方式的可观测性与故障恢复能力。",
    description:
      "基于本周容器部署实验，提交一份约 800 字的英文反思，说明实验中遇到的部署问题、排查过程，以及 Docker Compose 与 Kubernetes 在故障恢复方面的差异。",
    requirements: [
      "英文撰写，约 800 字",
      "至少引用一次实验日志或监控数据",
      "包含一段个人反思与改进方案",
      "在线提交，无需上传附件"
    ],
    source: "https://canvas.polyu.edu.hk/courses/5421/assignments/28115"
  },
  {
    id: "a3",
    course: "Data Mining",
    code: "COMP5434",
    title: "测验二：决策树与集成学习",
    titleEn: "Quiz 2: Decision Trees & Ensemble Learning",
    due: "2026-11-03T10:00:00+08:00",
    points: "20 分",
    submission: "在线测验",
    format: "30 分钟 · 20 题",
    priority: "本周",
    summary: "覆盖信息增益、剪枝、随机森林与梯度提升，允许携带一页 A4 手写笔记。",
    description:
      "在线限时测验，共 20 道选择题与 2 道简答题。重点复习决策树的划分准则、过拟合控制，以及 Bagging 与 Boosting 的差异。",
    requirements: [
      "测验开放时间为周一 10:00–周二 22:00",
      "限时 30 分钟，开始后不可暂停",
      "允许一页 A4 手写笔记",
      "不允许使用生成式 AI 工具"
    ],
    source: "https://canvas.polyu.edu.hk/courses/5434/quizzes/12088"
  },
  {
    id: "a4",
    course: "Business Analytics",
    code: "COMP5111",
    title: "小组讨论：预测模型伦理",
    titleEn: "Group Discussion: Ethics of Predictive Models",
    due: "2026-10-27T23:59:00+08:00",
    points: "10 分",
    submission: "论坛回复",
    format: "文字回复",
    priority: "已完成",
    summary: "完成两轮论坛讨论，围绕预测性警务模型中的公平性与可解释性问题。",
    description:
      "阅读指定案例并参与两轮班级讨论。第一轮分析模型偏见来源，第二轮回应至少一位同学的观点。",
    requirements: ["完成 1 条主帖与 2 条回复", "每段至少引用一篇课程阅读", "完成日期为 10 月 27 日"],
    source: "https://canvas.polyu.edu.hk/courses/5111/discussion_topics/9981"
  },
  {
    id: "a5",
    course: "AI Ethics",
    code: "COMP5222",
    title: "AI Governance 阅读笔记",
    titleEn: "AI Governance Reading Reflection",
    due: "2026-11-08T23:59:00+08:00",
    points: "15 分",
    submission: "文件上传",
    format: "PDF",
    priority: "下周",
    summary: "比较欧盟 AI Act 与香港现行治理框架，提炼三条适用于校园 AI 工具的建议。",
    description:
      "阅读课程指定材料并完成一页治理框架对比。请重点关注透明度、审计责任与高风险系统的分类方法。",
    requirements: ["不超过 1,200 字", "包含框架对比表", "提出至少 3 条可执行建议", "提交 PDF"],
    source: "https://canvas.polyu.edu.hk/courses/5222/assignments/30142"
  }
];

const materials = [
  {
    id: "m1",
    course: "AI & Digital Transformation",
    title: "第 7 讲：大语言模型架构与推理",
    type: "PDF",
    icon: "file",
    color: "",
    meta: "42 页 · 18.6 MB",
    updated: "昨天更新"
  },
  {
    id: "m2",
    course: "Cloud Computing",
    title: "Workshop：用 Kubernetes 部署微服务",
    type: "VIDEO",
    icon: "video",
    color: "teal",
    meta: "58 分钟 · 含字幕",
    updated: "10 月 27 日"
  },
  {
    id: "m3",
    course: "Data Mining",
    title: "Week 8 Reading List",
    type: "READING",
    icon: "book",
    color: "gold",
    meta: "3 篇论文 · 约 72 分钟",
    updated: "10 月 26 日"
  },
  {
    id: "m4",
    course: "Cloud Computing",
    title: "Lab 3 Starter Files",
    type: "ZIP",
    icon: "download",
    color: "blue",
    meta: "8.4 MB · 源代码与说明",
    updated: "10 月 25 日"
  },
  {
    id: "m5",
    course: "AI & Digital Transformation",
    title: "案例阅读：金融科技中的信用评分",
    type: "PDF",
    icon: "file",
    color: "ink",
    meta: "16 页 · 英文",
    updated: "10 月 23 日"
  },
  {
    id: "m6",
    course: "AI Ethics",
    title: "期末项目说明与评分标准",
    type: "SLIDES",
    icon: "book",
    color: "gold",
    meta: "24 页 · 已加入待读",
    updated: "10 月 22 日"
  }
];

const mails = [
  {
    id: "mail-1",
    source: "PO",
    sourceClass: "",
    sender: "Prof. Wong Ka Ming",
    senderEmail: "km.wong@polyu.edu.hk",
    subject: "重要：期末项目提交清单",
    subjectEn: "Important: Final Project submission checklist",
    preview:
      "提交前，请逐项确认报告格式、参考引用与同行评审文件。系统会在截止后自动关闭提交入口。",
    previewEn:
      "Before submitting, please verify your report format, references, and peer review file. The submission portal closes automatically after the deadline.",
    time: "09:42",
    unread: true,
    tag: "课程",
    original: [
      "Dear students,",
      "A quick reminder that the final project submission portal will close on 30 October at 23:59 (HKT). Please use the checklist below before submitting your work.",
      "Check that your report is uploaded as a single DOCX or PDF file, references follow the course guide, and the peer review form is included as an appendix. Late submissions will be handled according to the programme policy.",
      "If you encounter any technical issue, contact me before the deadline and include a screenshot of the error.",
      "Best regards,\nProf. Wong"
    ],
    translation: [
      "各位同学：",
      "提醒大家，期末项目提交入口将于 10 月 30 日 23:59（香港时间）关闭。请在提交前按以下清单逐项确认。",
      "请确认报告以单个 DOCX 或 PDF 文件上传，参考文献遵循课程指南，并将同行评审表作为附录一并提交。逾期提交将按课程政策处理。",
      "如果遇到技术问题，请在截止前联系我，并附上错误截图。",
      "祝好，\nWong 教授"
    ],
    summary: [
      "截止时间：10 月 30 日 23:59，系统将在截止后关闭。",
      "提交格式：单个 DOCX 或 PDF，参考文献与同行评审表必须齐全。",
      "技术故障需在截止前带截图联系教授，逾期按课程政策处理。"
    ],
    action: "查看 Canvas 作业"
  },
  {
    id: "mail-2",
    source: "IT",
    sourceClass: "orange",
    sender: "ITS Service Desk",
    senderEmail: "its@polyu.edu.hk",
    subject: "计划维护：学习平台短暂不可用",
    subjectEn: "Scheduled maintenance: Learning platforms unavailable",
    preview:
      "11 月 1 日 01:00–04:00 将维护 Canvas 与 Panopto。请提前下载需要的课堂录像。",
    previewEn:
      "Canvas and Panopto will be under maintenance from 01:00 to 04:00 on 1 November. Please download any required recordings in advance.",
    time: "昨天",
    unread: false,
    tag: "系统",
    original: [
      "Dear Staff and Students,",
      "Scheduled maintenance will take place on 1 November between 01:00 and 04:00 (HKT). During this window, Canvas and Panopto may be temporarily unavailable.",
      "We recommend downloading any teaching recordings or assignment materials you need before the maintenance period. Email and Microsoft 365 services will not be affected.",
      "We apologise for any inconvenience caused."
    ],
    translation: [
      "各位教职员及同学：",
      "系统将于 11 月 1 日凌晨 01:00 至 04:00（香港时间）进行计划维护。期间 Canvas 与 Panopto 可能暂时无法使用。",
      "建议在维护前下载所需的课堂录像或作业材料。邮件与 Microsoft 365 服务不受影响。",
      "对可能造成的不便，我们深表歉意。"
    ],
    summary: [
      "维护时间：11 月 1 日 01:00–04:00。",
      "受影响服务：Canvas 与 Panopto。",
      "请提前下载课堂录像和材料；邮件与 M365 不受影响。"
    ],
    action: "打开 ITS 公告"
  },
  {
    id: "mail-3",
    source: "CA",
    sourceClass: "",
    sender: "COMP5421 Teaching Team",
    senderEmail: "comp5421@polyu.edu.hk",
    subject: "实验三答疑与提交说明",
    subjectEn: "Lab 3 Q&A and submission instructions",
    preview:
      "本周五不再安排实体答疑；问题请发到讨论区。实验报告需同时提交日志与 800 字反思。",
    previewEn:
      "There will be no in-person Q&A this Friday; please post questions on the discussion board. Submit both your log and an 800-word reflection.",
    time: "周二",
    unread: true,
    tag: "课程",
    original: [
      "Hi everyone,",
      "Due to a scheduling conflict, this week's Friday consultation session is cancelled. Please post any Lab 3 questions on the Canvas discussion board; the teaching team will respond within one working day.",
      "Your submission should include the deployment log and a reflection of approximately 800 words. Marks will be deducted if either component is missing.",
      "All the best,\nTeaching Team"
    ],
    translation: [
      "各位同学：",
      "由于时间安排冲突，本周五的答疑课程取消。请将实验三的问题发布到 Canvas 讨论区，教学团队将在一个工作日内回复。",
      "提交内容需包括部署日志和约 800 字的反思；缺少任一材料将被扣分。",
      "祝顺利，\n教学团队"
    ],
    summary: [
      "本周五实体答疑取消，问题请发布到 Canvas 讨论区。",
      "提交必须包含部署日志和约 800 字英文反思。",
      "缺少日志或反思任一部分都会扣分。"
    ],
    action: "前往课程讨论区"
  },
  {
    id: "mail-4",
    source: "MS",
    sourceClass: "orange",
    sender: "Microsoft Teams",
    senderEmail: "noreply@teams.microsoft.com",
    subject: "小组项目会议已添加至你的日历",
    subjectEn: "A group project meeting was added to your calendar",
    preview: "AI Governance 小组将在周四 19:30 开会，Teams 链接已附在日历邀请中。",
    previewEn: "The AI Governance group meets on Thursday at 19:30. The Teams link is attached to the calendar invitation.",
    time: "周一",
    unread: false,
    tag: "日历",
    original: [
      "Your meeting has been added to your calendar.",
      "AI Governance Group Project",
      "Thursday, 29 October, 19:30–20:30 (HKT)",
      "Organiser: Rachel Lam",
      "Join using the Microsoft Teams link in the calendar invitation."
    ],
    translation: [
      "会议已添加到你的日历。",
      "AI Governance 小组项目",
      "10 月 29 日（周四）19:30–20:30（香港时间）",
      "组织者：Rachel Lam",
      "请使用日历邀请中的 Microsoft Teams 链接加入。"
    ],
    summary: [
      "AI Governance 小组会议今晚 19:30 开始。",
      "会议时长为 1 小时，组织者是 Rachel Lam。",
      "Teams 加入链接位于日历邀请中。"
    ],
    action: "打开日历邀请"
  },
  {
    id: "mail-5",
    source: "LB",
    sourceClass: "",
    sender: "PolyU Library",
    senderEmail: "lib@polyu.edu.hk",
    subject: "你的预约书籍现已可取",
    subjectEn: "Your reserved book is ready for collection",
    preview: "你预约的《Designing Machine Learning Systems》现已到馆，请在 11 月 5 日前领取。",
    previewEn:
      "Your reserved copy of Designing Machine Learning Systems is now available. Please collect it by 5 November.",
    time: "10 月 23 日",
    unread: false,
    tag: "图书馆",
    original: [
      "Dear Student,",
      "The item you reserved, Designing Machine Learning Systems, is now available for collection at the University Library.",
      "Please collect it by 5 November. After this date, the reservation will expire and the item will be released to the next borrower.",
      "Thank you."
    ],
    translation: [
      "同学：",
      "你预约的《Designing Machine Learning Systems》现已可在大学图书馆领取。",
      "请在 11 月 5 日前领取。逾期后预约将失效，该书会释放给下一位借阅者。",
      "谢谢。"
    ],
    summary: ["预约书籍已到馆。", "最迟 11 月 5 日前领取。", "逾期后预约将自动释放。"],
    action: "查看借阅记录"
  }
];

const preferences = {
  chineseFirst: true,
  deadlineAlerts: true,
  conciseSummary: true,
  emailDigest: false
};

const state = {
  route: "home",
  profile: {
    displayName: "同学",
    subtitle: "自托管学习空间",
    ...readStorage("polyflow-profile", {})
  },
  appConfig: {
    name: "PolyFlow",
    institution: "Your University",
    version: "0.2.0"
  },
  assignmentFilter: "actionable",
  assignmentQuery: "",
  materialCourse: "all",
  inboxFilter: "all",
  selectedMail: "mail-1",
  showTranslation: true,
  readerOpen: false,
  searchTerm: "",
  searchSelected: 0,
  completed: new Set([
    "a4",
    ...readStorage("polyflow-completed", [])
  ]),
  savedMaterials: new Set(readStorage("polyflow-saved", ["m6"])),
  preferences: {
    ...preferences,
    ...readStorage("polyflow-preferences", {})
  },
  integrationStatus: {
    loading: true,
    reachable: false,
    deepseek: {
      configured: false,
      model: "deepseek-chat",
      mock: false
    },
    canvas: {
      configured: false,
      mode: "demo",
      baseUrl: "https://canvas.polyu.edu.hk",
      bridgeEnabled: false
    }
  },
  canvasSync: {
    busy: false,
    connecting: false,
    lastSync: null,
    error: null,
    counts: { courses: 4, assignments: 5, materials: 6 }
  },
  aiBusy: null,
  toastTimer: null
};

const pageView = document.querySelector("#page-view");
const overlayRoot = document.querySelector("#overlay-root");
const toastRegion = document.querySelector(".toast-region");
const hktDate = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Hong_Kong",
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
});
const shortDate = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Hong_Kong",
  month: "short",
  day: "numeric"
});
const weekday = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Hong_Kong",
  weekday: "short"
});
const timeFormat = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Hong_Kong",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

function icon(name) {
  return `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The prototype still works when storage is unavailable.
  }
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTextWithBreaks(value) {
  return escapeHTML(value).replaceAll("\n", "<br>");
}

function dayStart(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function daysUntil(dateString) {
  if (!dateString) return Number.POSITIVE_INFINITY;
  return Math.ceil(
    (dayStart(new Date(dateString)) - dayStart(new Date())) / (1000 * 60 * 60 * 24)
  );
}

function dueLabel(dateString) {
  if (!dateString) return "无截止时间";
  const days = daysUntil(dateString);
  if (days < 0) return "已逾期";
  if (days === 0) return "今天截止";
  if (days === 1) return "明天截止";
  if (days <= 7) return `${days} 天后截止`;
  return shortDate.format(new Date(dateString));
}

function dueDayLabel(dateString) {
  if (!dateString) return "无截止时间";
  const days = daysUntil(dateString);
  if (days === 0) return "今天";
  if (days === 1) return "明天";
  if (days < 0) return "已逾期";
  return `${weekday.format(new Date(dateString))}`;
}

function timeUntil(dateString) {
  if (!dateString) return { value: "—", unit: "", detail: "请查看课程要求" };
  const diff = new Date(dateString).getTime() - Date.now();
  const hours = Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const rest = hours % 24;
    return { value: String(days), unit: "天", detail: `另 ${rest} 小时` };
  }
  return { value: String(hours), unit: "小时", detail: "请优先处理" };
}

function dueDateTimeText(dateString) {
  if (!dateString) return "无截止时间";
  const date = new Date(dateString);
  return `${shortDate.format(date)} ${timeFormat.format(date)}`;
}

function isComplete(id) {
  return state.completed.has(id);
}

function isSubmitted(assignment) {
  return Boolean(
    assignment?.isSubmitted ||
      ["submitted", "graded", "pending_review"].includes(assignment?.submissionState)
  );
}

function isAttendance(assignment) {
  return (
    assignment?.category === "attendance" ||
    /class[\s_-]*attendance|课堂出席|出席记录/i.test(assignment?.title || "")
  );
}

function isResolved(assignment) {
  return isComplete(assignment.id) || isSubmitted(assignment);
}

function isUrgent(assignment) {
  return !isResolved(assignment) && daysUntil(assignment.due) <= 2;
}

function incompleteAssignments() {
  return assignments
    .filter((assignment) => !isResolved(assignment) && !isAttendance(assignment))
    .sort(
      (a, b) =>
        (a.due ? new Date(a.due).getTime() : Number.MAX_SAFE_INTEGER) -
        (b.due ? new Date(b.due).getTime() : Number.MAX_SAFE_INTEGER)
    );
}

function isActionable(assignment) {
  if (isResolved(assignment) || !assignment.due) return false;
  const days = daysUntil(assignment.due);
  return Number.isFinite(days) && days >= -30 && days <= 365;
}

function actionableAssignments() {
  return incompleteAssignments().filter(isActionable);
}

function undatedAssignments() {
  return incompleteAssignments().filter((assignment) => !assignment.due);
}

function unreadMailCount() {
  return mails.filter((mail) => mail.unread).length;
}

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Hong_Kong",
      hour: "2-digit",
      hour12: false
    }).format(new Date())
  );
  if (hour < 12) return "早上好";
  if (hour < 18) return "下午好";
  return "晚上好";
}

function demoBanner() {
  if (readStorage("polyflow-demo-dismissed", false)) return "";
  const liveMessage = state.integrationStatus.canvas.configured
    ? "<strong>Canvas 实时同步</strong> · 作业与提交状态来自你的 Canvas API；Outlook 仍为示例数据。"
    : "<strong>演示模式</strong> · 当前使用示例数据展示聚合体验，不会连接或修改你的学校账号。";
  return `
    <div class="demo-banner">
      <span aria-hidden="true"></span>
      <div>${liveMessage}</div>
      <button data-action="dismiss-demo">知道了</button>
    </div>
  `;
}

function pageHeading(eyebrow, title, meta = "", actions = "") {
  return `
    <div class="page-heading">
      <div>
        <p class="eyebrow">${escapeHTML(eyebrow)}</p>
        <h1>${title}</h1>
        ${meta ? `<div class="heading-meta">${meta}</div>` : ""}
      </div>
      ${actions ? `<div class="page-actions">${actions}</div>` : ""}
    </div>
  `;
}

function renderHome() {
  const pending = actionableAssignments();
  const undatedCount = undatedAssignments().length;
  const focus = pending[0];
  const countdown = focus ? timeUntil(focus.due) : { value: "0", unit: "项", detail: "" };
  const weekCount = pending.filter(
    (item) => daysUntil(item.due) >= 0 && daysUntil(item.due) <= 7
  ).length;
  const todaysTasks = pending.slice(0, 3);
  const todayEvents = [
    {
      time: "14:30",
      title: "COMP6309 · 案例工作坊",
      place: "Online · Zoom",
      assignment: "a1"
    },
    {
      time: "19:30",
      title: "AI Governance 小组会议",
      place: "Teams · 1 小时",
      assignment: null
    }
  ];

  return `
    <section class="page">
      ${demoBanner()}
      ${pageHeading(
        hktDate.format(new Date()),
        `${greeting()}，<em>${escapeHTML(state.profile.displayName)}</em>`,
        `<span>${weekCount} 项任务将在 7 天内截止</span><i class="dot"></i><span>已同步演示数据</span>`,
        `<button class="button secondary" data-action="open-calendar">${icon("calendar")}查看日历</button>`
      )}

      <div class="hero-grid">
        <article class="focus-card">
          <div class="focus-content">
            <p class="focus-kicker">${icon("sparkles")} 今日优先事项</p>
            <h2>${focus ? escapeHTML(focus.title) : "本周任务已全部完成"}</h2>
            <p class="focus-description">${
              focus
              ? `${escapeHTML(focus.course)} · ${escapeHTML(focus.summary)}`
                : "做得很好，可以先看看下周安排。"
            }</p>
            <div class="focus-footer">
              <div class="deadline-block">
                <div class="countdown">
                  <strong>${countdown.value}</strong><span>${countdown.unit}</span>
                </div>
                <div class="deadline-copy">
                  <strong>${focus ? dueLabel(focus.due) : "全部完成"}</strong>
                  <span>${
                    focus
                      ? `${dueDateTimeText(focus.due)} · ${countdown.detail}`
                      : "没有待处理任务"
                  }</span>
                </div>
              </div>
              ${
                focus
                  ? `<button class="focus-cta" data-action="open-assignment" data-id="${focus.id}">查看作业要求</button>`
                  : `<button class="focus-cta" data-route="assignments">查看全部作业</button>`
              }
            </div>
          </div>
        </article>

        <article class="week-card">
          <div class="card-heading">
            <div>
              <h3>接下来</h3>
              <p>${escapeHTML(hktDate.format(new Date()))}</p>
            </div>
            <button class="text-button" data-action="open-calendar">完整日历 ${icon("arrow")}</button>
          </div>
          ${renderWeekStrip()}
          <div class="week-agenda">
            ${todayEvents
              .map(
                (event) => `
                  <div class="agenda-row" ${
                    event.assignment
                      ? `data-action="open-assignment" data-id="${event.assignment}"`
                      : `data-action="open-calendar"`
                  }>
                    <span class="agenda-time">${event.time}</span>
                    <span class="agenda-copy">
                      <strong>${escapeHTML(event.title)}</strong>
                      <span>${escapeHTML(event.place)}</span>
                    </span>
                    <i aria-hidden="true"></i>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      </div>

      <div class="stats-row">
        <article class="stat-card">
          <span class="stat-icon">${icon("task")}</span>
          <span class="stat-copy">
            <strong>${pending.length}<small> 项</small></strong>
            <span>近期需处理 · ${undatedCount} 项无截止时间</span>
          </span>
        </article>
        <article class="stat-card">
          <span class="stat-icon">${icon("translate")}</span>
          <span class="stat-copy">
            <strong>${unreadMailCount()}<small> 封</small></strong>
            <span>未读邮件 · 已生成中文摘要</span>
          </span>
        </article>
        <article class="stat-card">
          <span class="stat-icon">${icon("book")}</span>
          <span class="stat-copy">
            <strong>4<small> 个</small></strong>
            <span>本周新资料 · 含 1 个视频</span>
          </span>
        </article>
      </div>

      <div class="dashboard-grid">
        <article class="panel">
          <div class="panel-header">
            <div>
              <h2>近期作业</h2>
              <p>已按截止时间与优先级排序</p>
            </div>
            <button class="text-button" data-route="assignments">查看全部 ${icon("arrow")}</button>
          </div>
          <div class="panel-body">
            <div class="task-list">
              ${todaysTasks.map(renderTaskRow).join("")}
            </div>
          </div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <div>
              <h2>需要你留意的邮件</h2>
              <p>英文原文已生成中文摘要</p>
            </div>
            <button class="text-button" data-route="inbox">打开收件箱 ${icon("arrow")}</button>
          </div>
          <div class="panel-body">
            <div class="inbox-preview">
              ${mails
                .filter((mail) => mail.unread)
                .slice(0, 2)
                .map(renderInboxPreview)
                .join("")}
            </div>
          </div>
        </article>
      </div>

      <article class="panel section-spacer">
        <div class="panel-header">
          <div>
            <h2>继续学习</h2>
            <p>根据最近打开的课程整理</p>
          </div>
          <button class="text-button" data-route="materials">全部资料 ${icon("arrow")}</button>
        </div>
        <div class="panel-body material-grid">
          ${materials.slice(0, 3).map(renderMaterialCard).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderWeekStrip() {
  const today = new Date();
  const labels = ["日", "一", "二", "三", "四", "五", "六"];
  const events = new Set([0, 1, 4]);
  return `
    <div class="week-days">
      ${Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + index);
        const isToday = index === today.getDay();
        return `
          <span class="day-cell ${isToday ? "today" : ""} ${events.has(index) ? "has-event" : ""}">
            <span>${labels[index]}</span>
            <strong>${date.getDate()}</strong>
          </span>
        `;
      }).join("")}
    </div>
  `;
}

function renderTaskRow(assignment) {
  const complete = isComplete(assignment.id);
  const urgent = isUrgent(assignment);
  return `
    <div class="task-row ${complete ? "completed" : ""}" data-action="open-assignment" data-id="${assignment.id}">
      <button class="task-check" data-action="toggle-assignment" data-id="${assignment.id}" aria-label="${
        complete ? "标记为未完成" : "标记为已完成"
      }">${icon("check")}</button>
      <span class="task-main">
        <span class="task-topline">
          <span class="course-pill">${escapeHTML(assignment.course)}</span>
          ${urgent ? `<span class="priority-label">${escapeHTML(assignment.priority)}</span>` : ""}
        </span>
        <span class="task-title">${escapeHTML(assignment.title)}</span>
        <span class="task-subtitle">${escapeHTML(assignment.summary)}</span>
      </span>
      <span class="task-due ${urgent ? "urgent" : ""}">
        <strong>${complete ? "已完成" : dueDayLabel(assignment.due)}</strong>
        <span>${assignment.due ? timeFormat.format(new Date(assignment.due)) : "—"}</span>
      </span>
    </div>
  `;
}

function renderInboxPreview(mail) {
  return `
    <div class="mail-row" data-action="open-mail" data-id="${mail.id}">
      <span class="mail-source ${mail.sourceClass}">${escapeHTML(mail.source)}</span>
      <span class="mail-body">
        <span class="mail-sender">
          <strong>${escapeHTML(mail.sender)}</strong>
          ${mail.unread ? `<i class="unread-dot" aria-label="未读"></i>` : ""}
        </span>
        <span class="mail-subject">${escapeHTML(mail.subject)}</span>
        <span class="mail-preview-text">${escapeHTML(mail.preview)}</span>
        <span class="translate-badge">${icon("translate")} 已生成中文摘要</span>
      </span>
      <span class="mail-time">${escapeHTML(mail.time)}</span>
    </div>
  `;
}

function renderAssignments() {
  const pending = assignments.filter(
    (assignment) =>
      !isResolved(assignment) &&
      !isAttendance(assignment) &&
      Boolean(assignment.due) &&
      matchesAssignmentSearch(assignment) &&
      matchesAssignmentFilter(assignment)
  );
  const undated =
    state.assignmentFilter === "all"
      ? undatedAssignments().filter(matchesAssignmentSearch)
      : [];
  const completed = assignments.filter(
    (assignment) =>
      isResolved(assignment) &&
      !isAttendance(assignment) &&
      matchesAssignmentSearch(assignment)
  );
  const attendance = [
    ...new Map(
      assignments
        .filter(
          (assignment) =>
            isAttendance(assignment) && matchesAssignmentSearch(assignment)
        )
        .map((assignment) => [
          `${assignment.course}|${assignment.title.replace(/\s+/g, " ").trim().toLowerCase()}`,
          assignment
        ])
    ).values()
  ];
  const showPending = ["actionable", "week", "all"].includes(state.assignmentFilter);
  const showCompleted = ["all", "completed"].includes(state.assignmentFilter);
  const showAttendance = ["all", "attendance"].includes(state.assignmentFilter);
  const actionableCount = actionableAssignments().length;
  const undatedCount = undatedAssignments().length;
  const syncLabel = state.integrationStatus.canvas.configured
    ? state.canvasSync.busy
      ? "正在同步 Canvas"
      : state.canvasSync.error
        ? `同步失败：${state.canvasSync.error}`
      : state.canvasSync.lastSync
        ? `最近同步 ${timeFormat.format(new Date(state.canvasSync.lastSync))}`
        : "等待首次同步"
    : "演示状态，未连接 Canvas";

  return `
    <section class="page">
      ${demoBanner()}
      ${pageHeading(
        "Canvas · 作业与测验",
        "所有任务，<em>一处看清</em>",
        `<span>${actionableCount} 项近期需处理</span><i class="dot"></i><span>${escapeHTML(
          syncLabel
        )}</span><i class="dot"></i><span>${undatedCount} 项无截止时间</span>`,
        `<button class="button primary" data-action="${
          state.integrationStatus.canvas.configured ? "sync-canvas" : "connect-canvas"
        }" ${state.canvasSync.busy ? "disabled" : ""}>${icon("cloud")}${
          state.integrationStatus.canvas.configured
            ? state.canvasSync.busy
              ? "同步中..."
              : "同步 Canvas"
            : "连接 Canvas"
        }</button>`
      )}
      <div class="toolbar">
        <div class="filter-tabs" role="tablist" aria-label="过滤作业">
          ${[
            ["actionable", "需处理"],
            ["week", "未来 7 天"],
            ["all", "全部"],
            ["completed", "已提交"],
            ["attendance", "出席"]
          ]
            .map(
              ([filter, label]) => `
                <button class="filter-tab ${state.assignmentFilter === filter ? "active" : ""}"
                  data-action="assignment-filter" data-filter="${filter}" role="tab"
                  aria-selected="${state.assignmentFilter === filter}">${label}</button>
              `
            )
            .join("")}
        </div>
        <label class="inline-search">
          ${icon("search")}
          <input id="assignment-search" type="search" placeholder="搜索作业或课程..." value="${escapeHTML(
            state.assignmentQuery
          )}" aria-label="搜索作业">
        </label>
      </div>

      <div class="assignment-groups">
        ${
          showPending && pending.length
            ? `
              <section>
                <div class="assignment-group-header">
                  <h2>近期需处理</h2><span>${pending.length} 项</span><i class="line"></i>
                </div>
                <div class="assignment-card-list">
                  ${pending.map(renderAssignmentCard).join("")}
                </div>
              </section>
            `
            : ""
        }
        ${
          showPending && !pending.length && !undated.length
            ? renderEmpty("没有符合条件的新任务", "试试清除搜索词或切换到其他筛选。", "task")
            : ""
        }
        ${
          showCompleted && undated.length
            ? `
              <section>
                <div class="assignment-group-header">
                  <h2>无截止时间</h2><span>${undated.length} 项</span><i class="line"></i>
                </div>
                <div class="assignment-card-list">
                  ${undated.map(renderAssignmentCard).join("")}
                </div>
              </section>
            `
            : ""
        }
        ${
          showCompleted && completed.length
            ? `
              <section>
                <div class="assignment-group-header">
                  <h2>已提交 / 已完成</h2><span>${completed.length} 项</span><i class="line"></i>
                </div>
                <div class="assignment-card-list">
                  ${completed.map(renderAssignmentCard).join("")}
                </div>
              </section>
            `
            : ""
        }
        ${
          showAttendance && attendance.length
            ? `
              <section>
                <div class="assignment-group-header">
                  <h2>课堂出席</h2><span>${attendance.length} 条记录</span><i class="line"></i>
                </div>
                <div class="assignment-card-list attendance-list">
                  ${attendance.map(renderAttendanceCard).join("")}
                </div>
              </section>
            `
            : ""
        }
      </div>
    </section>
  `;
}

function matchesAssignmentFilter(assignment) {
  if (!matchesAssignmentSearch(assignment)) return false;
  if (state.assignmentFilter === "attendance") return isAttendance(assignment);
  if (isAttendance(assignment)) return false;
  if (state.assignmentFilter === "completed") return isResolved(assignment);
  if (isResolved(assignment)) return false;
  if (state.assignmentFilter === "all") return true;
  if (!isActionable(assignment)) return false;
  if (state.assignmentFilter === "week") {
    const days = daysUntil(assignment.due);
    return days >= 0 && days <= 7;
  }
  return true;
}

function matchesAssignmentSearch(assignment) {
  const query = state.assignmentQuery.trim().toLowerCase();
  return (
    !query ||
    `${assignment.title} ${assignment.titleEn} ${assignment.course} ${assignment.code}`
      .toLowerCase()
      .includes(query)
  );
}

function renderAttendanceCard(assignment) {
  const weekLabel =
    assignment.title.match(/Week\s*\d+/i)?.[0] ||
    assignment.title.match(/第\s*\d+\s*周/)?.[0] ||
    "课堂记录";
  const location = assignment.title.match(/-(LTL|LEC)\d+/i)?.[0]?.slice(1) || "";
  return `
    <article class="attendance-card" data-action="open-assignment" data-id="${assignment.id}"
      tabindex="0" role="button" aria-label="查看 ${escapeHTML(assignment.title)}">
      <span class="attendance-icon">${icon("calendar")}</span>
      <span class="attendance-copy">
        <span class="course-pill">${escapeHTML(assignment.course)}</span>
        <strong>${escapeHTML(weekLabel)}${location ? ` · ${escapeHTML(location)}` : ""}</strong>
        <small>课堂出席由 Canvas 自动同步，不计入作业待办</small>
      </span>
      <span class="status-pill done">${icon("check")}${
        assignment.submissionState === "graded" ? "已记录" : "已同步"
      }</span>
      <small class="attendance-points">${escapeHTML(assignment.points)}</small>
    </article>
  `;
}

function renderAssignmentCard(assignment) {
  const complete = isComplete(assignment.id);
  const submitted = isSubmitted(assignment);
  const resolved = complete || submitted;
  const urgent = isUrgent(assignment);
  const date = assignment.due ? new Date(assignment.due) : null;
  const submittedText = assignment.submittedAt
    ? `提交于 ${dueDateTimeText(assignment.submittedAt)}`
    : "已同步提交状态";
  return `
    <article class="assignment-card ${urgent ? "urgent" : ""} ${resolved ? "completed" : ""}"
      data-action="open-assignment" data-id="${assignment.id}" tabindex="0" role="button"
      aria-label="查看 ${escapeHTML(assignment.title)}">
      <span class="assignment-date">
        <span>${submitted ? "提交" : complete ? "完成" : date ? shortDate.format(date).split(" ")[0] : "待定"}</span>
        <strong>${date ? date.getDate() : "—"}</strong>
      </span>
      <div class="assignment-card-main">
        <div class="assignment-meta">
          <span class="course-pill">${escapeHTML(assignment.course)}</span>
          <span>${escapeHTML(assignment.code)} · ${escapeHTML(assignment.format)}</span>
        </div>
        <h3>${escapeHTML(assignment.title)}</h3>
        <p>${escapeHTML(assignment.summary)}</p>
      </div>
      <div class="assignment-card-side">
        <span class="status-pill ${resolved ? "done" : urgent ? "urgent" : ""}">
          ${resolved ? icon("check") : urgent ? icon("clock") : ""}
          ${submitted ? (assignment.submissionState === "graded" ? "已评分" : "已提交") : complete ? "已完成" : dueLabel(assignment.due)}
        </span>
        <small>${
          submitted
            ? `${escapeHTML(submittedText)} · ${escapeHTML(assignment.points)}`
            : date
              ? `${timeFormat.format(date)} · ${escapeHTML(assignment.points)}`
              : escapeHTML(assignment.points)
        }</small>
      </div>
    </article>
  `;
}

function renderMaterials() {
  const courseNames = [...new Set(materials.map((material) => material.course))];
  const filtered = materials.filter(
    (material) => state.materialCourse === "all" || material.course === state.materialCourse
  );
  return `
    <section class="page">
      ${demoBanner()}
      ${pageHeading(
        "Canvas · 课程资料",
        "课件与阅读，<em>按课程整理</em>",
        `<span>${materials.length} 个近期资料</span><i class="dot"></i><span>${state.savedMaterials.size} 个已收藏</span>`,
        `<button class="button secondary" data-action="sync-canvas">${icon("cloud")}刷新资料</button>`
      )}
      <div class="course-pills-row" role="tablist" aria-label="按课程筛选">
        <button class="course-filter ${state.materialCourse === "all" ? "active" : ""}"
          data-action="material-filter" data-course="all"><i></i>全部课程</button>
        ${courseNames
          .map(
            (course) => `
              <button class="course-filter ${state.materialCourse === course ? "active" : ""}"
                data-action="material-filter" data-course="${escapeHTML(course)}"><i></i>${escapeHTML(course)}</button>
            `
          )
          .join("")}
      </div>
      ${
        filtered.length
          ? `<div class="material-grid">${filtered.map(renderMaterialCard).join("")}</div>`
          : renderEmpty("这个课程暂时没有资料", "同步 Canvas 后，新资料会自动出现在这里。", "book")
      }
    </section>
  `;
}

function renderMaterialCard(material) {
  const saved = state.savedMaterials.has(material.id);
  return `
    <article class="material-card">
      <div class="material-cover ${material.color}">
        ${icon(material.icon)}
        <span class="file-kind">${material.type}</span>
        <button class="bookmark-button ${saved ? "saved" : ""}"
          data-action="toggle-save-material" data-id="${material.id}"
          aria-label="${saved ? "取消收藏" : "收藏资料"}">${icon("bookmark")}</button>
      </div>
      <div class="material-body">
        <span class="course-pill">${escapeHTML(material.course)}</span>
        <h3>${escapeHTML(material.title)}</h3>
        <p>${escapeHTML(material.meta)}</p>
        <div class="material-footer">
          <span>${escapeHTML(material.updated)}</span>
          <span class="material-actions">
            <button class="mini-icon-button" data-action="open-material" data-id="${material.id}" aria-label="打开资料">${icon(
              "arrow"
            )}</button>
            <button class="mini-icon-button" data-action="download-material" data-id="${material.id}" aria-label="下载资料">${icon(
              "download"
            )}</button>
          </span>
        </div>
      </div>
    </article>
  `;
}

function renderInbox() {
  const filteredMails = mails.filter(
    (mail) => state.inboxFilter === "all" || (state.inboxFilter === "unread" ? mail.unread : !mail.unread)
  );
  const selected =
    mails.find((mail) => mail.id === state.selectedMail) || filteredMails[0] || mails[0];
  if (!mails.some((mail) => mail.id === state.selectedMail)) state.selectedMail = selected.id;
  return `
    <section class="page">
      ${demoBanner()}
      ${pageHeading(
        "Outlook · 统一收件箱",
        "邮件先读三句，<em>再决定细看</em>",
        `<span>${unreadMailCount()} 封未读</span><i class="dot"></i><span>所有英文邮件均已生成中文摘要</span>`
      )}
      <div class="inbox-layout ${state.readerOpen ? "reader-open" : ""}">
        <div class="mail-list-pane">
          <div class="pane-header">
            <div>
              <h2>收件箱</h2>
              <p>按重要性与最近时间排序</p>
            </div>
            <div class="inbox-filters">
              ${[
                ["all", "全部"],
                ["unread", "未读"],
                ["read", "已读"]
              ]
                .map(
                  ([filter, label]) => `
                    <button class="inbox-filter ${state.inboxFilter === filter ? "active" : ""}"
                      data-action="inbox-filter" data-filter="${filter}">${label}</button>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="mail-list">
            ${filteredMails.map((mail) => renderMailListItem(mail, selected.id)).join("")}
          </div>
        </div>
        <div class="mail-reader">
          ${renderMailReader(selected)}
        </div>
      </div>
    </section>
  `;
}

function renderMailListItem(mail, selectedId) {
  return `
    <article class="mail-list-item ${mail.unread ? "unread" : ""} ${
      mail.id === selectedId ? "active" : ""
    }" data-action="open-mail" data-id="${mail.id}" tabindex="0" role="button">
      <span class="mail-source ${mail.sourceClass}">${escapeHTML(mail.source)}</span>
      <div class="mail-list-copy">
        <div class="mail-list-topline">
          <span class="mail-list-sender">
            <strong>${escapeHTML(mail.sender)}</strong>
            ${mail.unread ? `<i class="unread-dot" aria-label="未读"></i>` : ""}
          </span>
          <span class="mail-list-time">${escapeHTML(mail.time)}</span>
        </div>
        <div class="mail-list-subject">${escapeHTML(mail.subject)}</div>
        <div class="mail-list-preview">${escapeHTML(mail.preview)}</div>
        <div class="mail-tag-row">
          <span class="mail-tag">${escapeHTML(mail.tag)}</span>
          <span class="mail-tag ai">中文摘要</span>
        </div>
      </div>
    </article>
  `;
}

function renderMailReader(mail) {
  const body = state.showTranslation ? mail.translation : mail.original;
  return `
    <div class="reader-toolbar">
      <span class="reader-label"><i></i> Outlook / ${escapeHTML(mail.tag)}</span>
      <span class="reader-buttons">
        <button class="ai-retranslate" data-action="ai-translate" data-id="${mail.id}"
          ${state.aiBusy ? "disabled" : ""}>
          ${icon("sparkles")} ${state.aiBusy?.task === "translate" && state.aiBusy.mailId === mail.id ? "正在翻译" : "AI 重译"}
        </button>
        <button class="translate-toggle ${state.showTranslation ? "" : "original"}"
          data-action="toggle-mail-translation">
          ${icon("translate")} ${state.showTranslation ? "正在显示中文" : "查看中文翻译"}
        </button>
        <button class="icon-button" data-action="close-reader" aria-label="返回邮件列表">${icon("close")}</button>
      </span>
    </div>
    <div class="reader-content">
      <h1 class="reader-subject">${escapeHTML(state.showTranslation ? mail.subject : mail.subjectEn)}</h1>
      <div class="reader-sender-row">
        <span class="avatar">${escapeHTML(mail.sender.charAt(0))}</span>
        <span class="reader-sender-copy">
          <strong>${escapeHTML(mail.sender)}</strong>
          <span>${escapeHTML(mail.senderEmail)} · 发给你</span>
        </span>
      </div>
      <div class="ai-summary">
        <div class="ai-summary-top">
          <div class="ai-summary-header">${icon("sparkles")} AI 三句摘要</div>
          <button class="ai-regenerate" data-action="ai-summarize" data-id="${mail.id}"
            ${state.aiBusy ? "disabled" : ""}>
            ${icon("sparkles")}${state.aiBusy?.task === "summarize" && state.aiBusy.mailId === mail.id ? " 生成中" : " DeepSeek 重写"}
          </button>
        </div>
        <ul class="summary-list">
          ${mail.summary.map((line) => `<li>${escapeHTML(line)}</li>`).join("")}
        </ul>
      </div>
      <div class="reader-text">
        ${body.map((paragraph) => `<p>${formatTextWithBreaks(paragraph)}</p>`).join("")}
      </div>
      <div class="reader-footer-action">
        <button class="button primary" data-action="mail-action" data-id="${mail.id}">${escapeHTML(
          mail.action
        )}</button>
        <button class="button secondary" data-action="copy-summary" data-id="${mail.id}">${icon(
          "file"
        )}复制摘要</button>
      </div>
    </div>
  `;
}

function renderDeepSeekStatus() {
  if (state.integrationStatus.loading) {
    return `<span class="connection-state offline"><i></i>检查中</span>`;
  }
  if (!state.integrationStatus.reachable) {
    return `<span class="connection-state offline"><i></i>服务未启动</span>`;
  }
  if (state.integrationStatus.deepseek.configured) {
    return `<span class="connection-state configured"><i></i>${
      state.integrationStatus.deepseek.mock ? "Mock 已启用" : "密钥已配置"
    }</span>`;
  }
  return `<span class="connection-state"><i></i>待配置</span>`;
}

function renderCanvasStatus() {
  if (state.integrationStatus.loading) {
    return `<span class="connection-state offline"><i></i>检查中</span>`;
  }
  if (!state.integrationStatus.reachable) {
    return `<span class="connection-state offline"><i></i>服务未启动</span>`;
  }
  if (state.canvasSync.busy) {
    return `<span class="connection-state"><i></i>正在同步</span>`;
  }
  if (state.canvasSync.connecting) {
    return `<span class="connection-state"><i></i>正在验证</span>`;
  }
  if (state.canvasSync.error) {
    return `<span class="connection-state"><i></i>同步失败</span>`;
  }
  if (state.integrationStatus.canvas.configured) {
    return `<span class="connection-state configured"><i></i>实时同步已开启</span>`;
  }
  if (state.integrationStatus.canvas.bridgeEnabled) {
    return `<span class="connection-state"><i></i>等待浏览器登录</span>`;
  }
  return `<span class="connection-state"><i></i>待配置 Token</span>`;
}

function canvasHostname() {
  try {
    return new URL(state.integrationStatus.canvas.baseUrl).hostname;
  } catch {
    return "Canvas LMS";
  }
}

function renderSettings() {
  const canvasCounts = state.canvasSync.counts;
  return `
    <section class="page">
      ${demoBanner()}
      ${pageHeading(
        "连接与设置",
        "把数据接进来，<em>把隐私留在你手里</em>",
        `<span>${
          state.integrationStatus.canvas.configured ? "Canvas 运行时自动同步" : "Canvas 当前为演示连接"
        }</span><i class="dot"></i><span>不保存学校密码</span>`
      )}
      <div class="settings-grid">
        <article class="integration-card">
          <div class="integration-top">
            <div class="integration-brand">
              <span class="integration-icon">C</span>
              <div><h2>Canvas</h2><p>Canvas LMS · ${escapeHTML(canvasHostname())}</p></div>
            </div>
            ${renderCanvasStatus()}
          </div>
          <p>${
            state.integrationStatus.canvas.bridgeEnabled
              ? "首轮在独立 Chrome 中完成官方登录，之后复用本机会话读取课程、作业、真实提交时间与模块资料。启动时立即同步，页面打开期间每 5 分钟刷新。"
              : "通过 Canvas API 自动读取课程、作业、真实提交时间、Attempt 状态和模块资料。启动时立即同步，页面打开期间每 5 分钟刷新；令牌仅保存在服务器。"
          }</p>
          <div class="data-preview">
            <div><strong>${canvasCounts.courses}</strong><span>门课程</span></div>
            <div><strong>${canvasCounts.assignments}</strong><span>项作业</span></div>
            <div><strong>${canvasCounts.materials}</strong><span>份资料</span></div>
          </div>
          <div class="integration-actions">
            <button class="button primary" data-action="connect-canvas">${
              state.integrationStatus.canvas.configured ? "管理 Canvas 连接" : "连接我的 Canvas"
            }</button>
            <button class="button secondary" data-action="sync-canvas" ${
              state.canvasSync.busy || !state.integrationStatus.canvas.configured ? "disabled" : ""
            }>${icon("cloud")}${state.canvasSync.busy ? "同步中..." : "立即同步"}</button>
          </div>
        </article>

        <article class="integration-card">
          <div class="integration-top">
            <div class="integration-brand">
              <span class="integration-icon outlook">O</span>
              <div><h2>Outlook</h2><p>Microsoft 365 · 邮件与日历</p></div>
            </div>
            <span class="connection-state"><i></i>演示连接</span>
          </div>
          <p>通过 Microsoft Graph 的只读权限获取邮件与日程，再在服务端生成翻译和摘要。可以随时撤销授权。</p>
          <div class="data-preview">
            <div><strong>5</strong><span>封邮件</span></div>
            <div><strong>2</strong><span>封未读</span></div>
            <div><strong>1</strong><span>场会议</span></div>
          </div>
          <div class="integration-actions">
            <button class="button primary" data-action="connect-outlook">配置 Outlook 接入</button>
            <a class="button secondary" href="https://outlook.office.com/mail/" target="_blank" rel="noreferrer">${icon(
              "external"
            )}打开 Outlook</a>
          </div>
        </article>

        <article class="integration-card deepseek-card">
          <div class="integration-copy">
            <div class="integration-top">
              <div class="integration-brand">
                <span class="integration-icon deepseek">D</span>
                <div><h2>DeepSeek</h2><p>中文翻译 · 邮件摘要 · 学习行动建议</p></div>
              </div>
              ${renderDeepSeekStatus()}
            </div>
            <p>API Key 只保存在运行服务器的环境变量中。浏览器请求会先进入本站的 <code>/api/ai/*</code> 代理，DeepSeek 密钥不会下发到网页，也不会写入本地存储。</p>
            <div class="integration-actions">
              <button class="button primary" data-action="open-deepseek-setup">${icon(
                "settings"
              )}配置说明</button>
              <button class="button secondary" data-action="test-deepseek" ${
                state.integrationStatus.loading || state.aiBusy ? "disabled" : ""
              }>${icon("sparkles")}${
                state.aiBusy?.task === "test" ? "测试中..." : "测试连接"
              }</button>
            </div>
          </div>
          <div class="deepseek-panel">
            <div class="deepseek-panel-label">
              <span>AI Runtime</span>
              <strong>${escapeHTML(state.integrationStatus.deepseek.model || "deepseek-chat")}</strong>
            </div>
            <div class="deepseek-model">
              <span class="deepseek-model-mark">DS</span>
              <span>
                <strong>服务端安全代理</strong>
                <small>${
                  state.integrationStatus.deepseek.mock
                    ? "Mock 模式 · 不调用真实 API"
                    : state.integrationStatus.deepseek.configured
                      ? "API Key 已加载 · 等待测试"
                      : "设置 DEEPSEEK_API_KEY 后启用"
                }</small>
              </span>
            </div>
            <div class="deepseek-capabilities">
              <span>${icon("check")} Outlook 原文中文重译</span>
              <span>${icon("check")} 行动、时间、风险三句摘要</span>
              <span>${icon("check")} 密钥不进入浏览器</span>
            </div>
            <div class="deepseek-panel-label">
              <span>Rate guard</span>
              <strong>20 次 / 分钟</strong>
            </div>
          </div>
        </article>
      </div>

      <div class="preference-panel">
        <div class="preference-row">
          <span class="preference-copy"><strong>中文优先</strong><span>默认显示中文标题与邮件翻译，可随时切回原文</span></span>
          ${renderToggle("chineseFirst")}
        </div>
        <div class="preference-row">
          <span class="preference-copy"><strong>截止前提醒</strong><span>在作业截止前 48 小时突出显示并提醒</span></span>
          ${renderToggle("deadlineAlerts")}
        </div>
        <div class="preference-row">
          <span class="preference-copy"><strong>三句摘要</strong><span>邮件只提炼行动、时间与风险，不扩写原文</span></span>
          ${renderToggle("conciseSummary")}
        </div>
        <div class="preference-row">
          <span class="preference-copy"><strong>每日邮件汇总</strong><span>每天 08:00 汇总新邮件，仅发给你的学校邮箱</span></span>
          ${renderToggle("emailDigest")}
        </div>
        <div class="preference-row">
          <span class="preference-copy"><strong>显示名称</strong><span>只保存在当前浏览器，不会提交给其他用户</span></span>
          <span class="profile-name-form">
            <input id="profile-name-input" type="text" maxlength="40" value="${escapeHTML(
              state.profile.displayName
            )}" aria-label="显示名称">
            <button data-action="save-profile-name">保存</button>
          </span>
        </div>
      </div>

      <div class="settings-note">
        ${icon("clock")}
        <span><strong>本机桥接与多人部署的边界</strong><br>浏览器登录会话只保存在本机并要求图形桌面，适合当前自托管版本；公共服务器应关闭桥接并使用各校批准的 OAuth。Microsoft Graph 和 AI 密钥只应放在服务端。</span>
      </div>
    </section>
  `;
}

function renderToggle(key) {
  const enabled = Boolean(state.preferences[key]);
  return `<button class="toggle ${enabled ? "on" : ""}" data-action="toggle-preference" data-key="${key}"
    role="switch" aria-checked="${enabled}" aria-label="切换设置"></button>`;
}

function renderEmpty(title, description, iconName) {
  return `
    <div class="empty-state">
      ${icon(iconName)}
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(description)}</p>
    </div>
  `;
}

function renderPage() {
  const route = ["home", "assignments", "materials", "inbox", "settings"].includes(state.route)
    ? state.route
    : "home";
  const renderers = {
    home: renderHome,
    assignments: renderAssignments,
    materials: renderMaterials,
    inbox: renderInbox,
    settings: renderSettings
  };
  pageView.innerHTML = renderers[route]();
  updateNavigation();
  document.title = `${routeTitle(route)} · ${state.appConfig.name}`;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function routeTitle(route) {
  return {
    home: "今日总览",
    assignments: "作业与测验",
    materials: "课程资料",
    inbox: "邮件收件箱",
    settings: "连接与设置"
  }[route];
}

function updateNavigation() {
  document.querySelectorAll("[data-route]").forEach((element) => {
    element.classList.toggle("active", element.dataset.route === state.route);
  });
  const assignmentCount = document.querySelector("#assignment-count");
  const mailCount = document.querySelector("#mail-count");
  if (assignmentCount) assignmentCount.textContent = String(actionableAssignments().length);
  if (mailCount) {
    mailCount.textContent = String(unreadMailCount());
    mailCount.hidden = unreadMailCount() === 0;
  }
  const syncTitle = document.querySelector(".sync-state strong");
  const syncMeta = document.querySelector(".sync-state small");
  if (syncTitle && syncMeta) {
    if (state.canvasSync.busy) {
      syncTitle.textContent = "Canvas 同步中";
      syncMeta.textContent = "正在读取真实状态";
    } else if (state.integrationStatus.canvas.configured) {
      syncTitle.textContent = "Canvas 已连接";
      syncMeta.textContent = state.canvasSync.lastSync
        ? `${timeFormat.format(new Date(state.canvasSync.lastSync))} 自动同步`
        : "等待首次同步";
    } else {
      syncTitle.textContent = "演示数据";
      syncMeta.textContent = "Canvas 尚未连接";
    }
  }
  const avatarLetter = [...state.profile.displayName][0] || "同";
  const sidebarAvatar = document.querySelector("#sidebar-avatar");
  const topAvatar = document.querySelector("#top-profile");
  const sidebarName = document.querySelector("#sidebar-name");
  const sidebarSubtitle = document.querySelector("#sidebar-subtitle");
  const brandName = document.querySelector(".brand-copy strong");
  const brandSubtitle = document.querySelector(".brand-copy small");
  if (sidebarAvatar) sidebarAvatar.textContent = avatarLetter;
  if (topAvatar) topAvatar.textContent = avatarLetter;
  if (sidebarName) sidebarName.textContent = state.profile.displayName;
  if (sidebarSubtitle) sidebarSubtitle.textContent = state.profile.subtitle;
  if (brandName) brandName.textContent = state.appConfig.name;
  if (brandSubtitle) brandSubtitle.textContent = state.appConfig.institution;
}

function navigate(route) {
  const nextRoute = ["home", "assignments", "materials", "inbox", "settings"].includes(route)
    ? route
    : "home";
  if (location.hash !== `#${nextRoute}`) {
    history.pushState(null, "", `#${nextRoute}`);
  }
  state.route = nextRoute;
  document.body.classList.remove("menu-open");
  closeProfileMenu();
  renderPage();
}

function openAssignment(id) {
  const assignment = assignments.find((item) => item.id === id);
  if (!assignment) return;
  const complete = isComplete(id);
  const submitted = isSubmitted(assignment);
  overlayRoot.innerHTML = `
    <div class="overlay" data-action="overlay-backdrop">
      <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="assignment-title">
        <div class="drawer-top">
          <h2>作业详情</h2>
          <button class="icon-button" data-action="close-overlay" aria-label="关闭">${icon("close")}</button>
        </div>
        <div class="drawer-content">
          <div class="drawer-kicker">
            <span class="course-pill">${escapeHTML(assignment.course)}</span>
            <span>${escapeHTML(assignment.code)} · ${escapeHTML(assignment.points)}</span>
          </div>
          <h1 id="assignment-title">${escapeHTML(assignment.title)}</h1>
          <p class="drawer-subtitle">${escapeHTML(assignment.titleEn)}</p>
          <div class="detail-grid">
            <div class="detail-box"><span>截止时间</span><strong>${dueDateTimeText(
              assignment.due
            )}</strong></div>
            <div class="detail-box"><span>提交方式</span><strong>${escapeHTML(
              assignment.submission
            )}</strong></div>
            <div class="detail-box"><span>文件类型</span><strong>${escapeHTML(
              assignment.format
            )}</strong></div>
            <div class="detail-box"><span>当前状态</span><strong>${
              submitted
                ? assignment.submissionState === "graded"
                  ? "已评分"
                  : "已提交"
                : complete
                  ? "已完成"
                  : dueLabel(assignment.due)
            }</strong></div>
            ${
              submitted && assignment.submittedAt
                ? `<div class="detail-box" style="grid-column:1/-1"><span>最近提交</span><strong>${dueDateTimeText(
                    assignment.submittedAt
                  )} · Attempt ${assignment.attempt || 1}</strong></div>`
                : ""
            }
          </div>
          <section class="detail-section">
            <h3>作业说明</h3>
            <p>${escapeHTML(assignment.description)}</p>
          </section>
          <section class="detail-section">
            <h3>关键要求</h3>
            <ul class="requirement-list">
              ${assignment.requirements.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
            </ul>
          </section>
          <div class="drawer-actions">
            <button class="button primary" data-action="toggle-assignment" data-id="${id}">${icon(
              "check"
            )}${complete ? "重新打开任务" : submitted ? "标记为学习完成" : "标记为已完成"}</button>
            <a class="button secondary" href="${escapeHTML(
              assignment.source
            )}" target="_blank" rel="noreferrer">${icon("external")}在 Canvas 打开</a>
          </div>
        </div>
      </aside>
    </div>
  `;
  lockBody();
  overlayRoot.querySelector("[data-action='close-overlay']").focus();
}

function openMail(id) {
  const mail = mails.find((item) => item.id === id);
  if (!mail) return;
  mail.unread = false;
  state.selectedMail = mail.id;
  state.readerOpen = true;
  state.showTranslation = state.preferences.chineseFirst;
  if (state.route !== "inbox") {
    history.pushState(null, "", "#inbox");
    state.route = "inbox";
  }
  renderPage();
}

function openCalendar() {
  overlayRoot.innerHTML = `
    <div class="overlay center" data-action="overlay-backdrop">
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="calendar-title">
        <div class="command-header">
          <span class="stat-icon">${icon("calendar")}</span>
          <div style="flex:1">
            <strong id="calendar-title" style="font-family:Georgia,serif;font-weight:500;font-size:15px">学习日历 · 2026 年 10 月</strong>
          </div>
          <button class="icon-button" data-action="close-overlay" aria-label="关闭">${icon("close")}</button>
        </div>
        <div style="padding:20px">
          <div class="week-days" style="margin-top:0">
            ${["一", "二", "三", "四", "五", "六", "日"]
              .map((label) => `<span class="day-cell"><span>${label}</span></span>`)
              .join("")}
          </div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">
            ${Array.from({ length: 35 }, (_, index) => {
              const date = index - 2;
              const valid = date >= 1 && date <= 31;
              const today = date === 29;
              const dots =
                [8, 23, 27, 29, 30, 31].includes(date) || date === 3 || date === 8;
              return `<div style="min-height:48px;padding:7px;border-radius:9px;background:${
                today ? "#f6e9ec" : "transparent"
              };color:${today ? "#7d1d31" : valid ? "#39423f" : "#ccc"};font-size:11px;font-weight:${
                today ? "700" : "500"
              }">${valid ? date : ""}${dots ? `<span style="display:block;width:5px;height:5px;margin-top:7px;border-radius:50%;background:#a76a0a"></span>` : ""}</div>`;
            }).join("")}
          </div>
          <div class="panel" style="margin-top:18px;box-shadow:none">
            <div class="panel-body" style="padding:9px">
              <div class="agenda-row" data-action="open-assignment" data-id="a1">
                <span class="agenda-time">10/30</span>
                <span class="agenda-copy"><strong>个人案例分析报告截止</strong><span>COMP6309 · 23:59</span></span><i></i>
              </div>
              <div class="agenda-row" data-action="open-assignment" data-id="a2" style="margin-top:8px">
                <span class="agenda-time">10/31</span>
                <span class="agenda-copy"><strong>容器部署反思截止</strong><span>COMP5421 · 18:00</span></span><i></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  lockBody();
  overlayRoot.querySelector("[data-action='close-overlay']").focus();
}

function openSearch() {
  state.searchTerm = "";
  state.searchSelected = 0;
  overlayRoot.innerHTML = `
    <div class="overlay center" data-action="overlay-backdrop">
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="search-label">
        <div class="command-header">
          ${icon("search")}
          <label id="search-label" class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden">全局搜索</label>
          <input id="global-search-input" type="search" autocomplete="off" placeholder="搜索作业、课件、邮件..." aria-labelledby="search-label">
          <kbd data-action="close-overlay">ESC</kbd>
        </div>
        <div id="command-results" class="command-results"></div>
      </div>
    </div>
  `;
  lockBody();
  updateSearchResults();
  requestAnimationFrame(() => document.querySelector("#global-search-input")?.focus());
}

function searchItems(term) {
  const query = term.trim().toLowerCase();
  const assignmentItems = assignments
    .filter((item) =>
      `${item.title} ${item.titleEn} ${item.course} ${item.code}`.toLowerCase().includes(query)
    )
    .map((item) => ({
      type: "assignment",
      id: item.id,
      title: item.title,
      meta: `${item.course} · ${dueLabel(item.due)}`,
      icon: "task"
    }));
  const materialItems = materials
    .filter((item) => `${item.title} ${item.course} ${item.type}`.toLowerCase().includes(query))
    .map((item) => ({
      type: "material",
      id: item.id,
      title: item.title,
      meta: `${item.course} · ${item.type}`,
      icon: "book"
    }));
  const mailItems = mails
    .filter((item) =>
      `${item.subject} ${item.subjectEn} ${item.sender} ${item.preview}`.toLowerCase().includes(query)
    )
    .map((item) => ({
      type: "mail",
      id: item.id,
      title: item.subject,
      meta: `${item.sender} · ${item.time}`,
      icon: "mail"
    }));
  return [...assignmentItems, ...mailItems, ...materialItems].slice(0, 10);
}

function updateSearchResults() {
  const resultsRoot = document.querySelector("#command-results");
  if (!resultsRoot) return;
  const results = searchItems(state.searchTerm);
  if (!results.length) {
    resultsRoot.innerHTML = `<div class="command-empty">没有找到“${escapeHTML(
      state.searchTerm
    )}”<br>试试课程代码、作业名称或邮件主题。</div>`;
    return;
  }
  const typeLabel = { assignment: "作业", mail: "邮件", material: "资料" };
  resultsRoot.innerHTML = `
    <div class="command-section-label">${state.searchTerm ? "搜索结果" : "最近可查看"}</div>
    ${results
      .map(
        (item, index) => `
          <button class="command-item ${index === state.searchSelected ? "selected" : ""}" data-action="search-result"
            data-type="${item.type}" data-id="${item.id}">
            <span class="command-item-icon ${item.type}">${icon(item.icon)}</span>
            <span class="command-item-copy"><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(
              item.meta
            )}</span></span>
            <span style="font-size:9px;color:var(--ink-muted)">${typeLabel[item.type]}</span>
            ${icon("chevron")}
          </button>
        `
      )
      .join("")}
  `;
}

function openIntegration(type) {
  const isCanvas = type === "canvas";
  const bridgeEnabled = Boolean(state.integrationStatus.canvas.bridgeEnabled);
  const title = isCanvas ? "Canvas 一次性授权" : "Outlook 正式接入";
  const heading = isCanvas ? "配置一次，以后自动同步" : "安全读取邮件与日程";
  const description = isCanvas
    ? "PolyU 已关闭个人 Token。你可以使用本机浏览器登录一次：系统会打开 Chrome，你自行完成 ADFS 与 MFA，之后复用本地会话自动同步，不保存账号密码。"
    : "Outlook 使用 Microsoft Graph 的 OAuth 2.0 授权。建议只申请 Mail.Read 与 Calendars.Read 权限，并通过服务端完成同步和摘要。";
  const requirements = isCanvas
    ? [
        "点击“使用本机浏览器登录”",
        "在打开的 Chrome 中完成 Canvas 登录",
        "登录成功后窗口自动关闭",
        "之后启动和每 5 分钟自动同步"
      ]
    : [
        "准备一个仅可由服务器访问的密钥管理空间",
        "配置 Microsoft Entra OAuth 回调地址",
        "仅申请邮件与日历的只读权限",
        "提供撤销连接与删除缓存入口"
      ];
  overlayRoot.innerHTML = `
    <div class="overlay center" data-action="overlay-backdrop">
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="integration-title">
        <div class="command-header">
          <span class="integration-icon ${isCanvas ? "" : "outlook"}">${isCanvas ? "C" : "O"}</span>
          <div style="flex:1">
            <strong id="integration-title" style="font-size:13px">${title}</strong>
            <div style="font-size:9px;color:var(--ink-muted)">${
              isCanvas ? "不保存账号密码 · 不代替你操作 Canvas" : "只读授权 · 可随时撤销"
            }</div>
          </div>
          <button class="icon-button" data-action="close-overlay" aria-label="关闭">${icon("close")}</button>
        </div>
        <div style="padding:24px;overflow-y:auto;max-height:calc(76vh - 59px)">
          <h2 style="margin:0 0 7px;font-family:Georgia,'Songti SC',serif;font-size:24px;font-weight:500">${heading}</h2>
          <p style="margin:0 0 20px;color:var(--ink-soft);font-size:11px;line-height:1.8">${description}</p>
          <div class="requirement-list">
            ${requirements.map((item) => `<li>${item}</li>`).join("")}
          </div>
          ${
            isCanvas
              ? `${
                  bridgeEnabled
                    ? `<div class="canvas-bridge-card">
                        <div>
                          <strong>推荐：使用本机 Chrome 登录</strong>
                          <p>不需要申请 Token。密码和 MFA 只输入到官方登录页，不在 PolyFlow 或服务器中保存。</p>
                          ${
                            state.integrationStatus.canvas.account?.name
                              ? `<span>当前账号：${escapeHTML(
                                  state.integrationStatus.canvas.account.name
                                )}</span>`
                              : ""
                          }
                        </div>
                        <button class="button primary" data-action="canvas-bridge-login" ${
                          state.canvasSync.connecting ? "disabled" : ""
                        }>${icon("external")}${
                          state.canvasSync.connecting
                            ? "等待浏览器登录..."
                            : state.integrationStatus.canvas.account?.name
                              ? "重新登录"
                              : "使用本机浏览器登录"
                        }</button>
                      </div>`
                    : ""
                }
                <details class="canvas-token-fallback">
                  <summary>学校允许时，改用 Personal Access Token</summary>
                  <div class="canvas-connect-form">
                    <label>
                      <span>Canvas 地址</span>
                      <input id="canvas-base-url" type="url" value="${escapeHTML(
                        state.integrationStatus.canvas.baseUrl || "https://canvas.polyu.edu.hk"
                      )}" autocomplete="url">
                    </label>
                    <label>
                      <span>Personal Access Token</span>
                      <input id="canvas-token-input" type="password" placeholder="${
                        state.integrationStatus.canvas.configured
                          ? "已连接；粘贴新 Token 可替换"
                          : "粘贴你的 Canvas Token"
                      }" autocomplete="off" spellcheck="false">
                    </label>
                    <button class="button secondary" data-action="connect-canvas-submit" ${
                      state.canvasSync.connecting ? "disabled" : ""
                    }>${icon("link")}${
                      state.canvasSync.connecting ? "正在验证..." : "验证并连接"
                    }</button>
                  </div>
                </details>`
              : ""
          }
          <p style="margin:18px 0 0;padding:12px;background:#faf5eb;border:1px solid #e6dcc7;border-radius:10px;color:#6e6049;font-size:10px;line-height:1.65">
            <strong>${isCanvas ? "为什么不用账号密码？" : "上线前请确认："}</strong>${
              isCanvas
                ? "自动登录 ADFS 会要求保存你的密码并触发 MFA，页面结构或登录策略变化就会失效。Personal Access Token 可以单独撤销，泄漏影响范围也比 NetPassword 小。"
                : "向 PolyU IT / 课程教师确认接口访问、数据保留期限、个人邮箱连接范围与第三方服务使用政策。"
            }
          </p>
          <div class="drawer-actions">
            <button class="button secondary" data-action="close-overlay">返回设置</button>
            ${
              isCanvas &&
              ["session", "bridge"].includes(state.integrationStatus.canvas.source)
                ? `<button class="button secondary" data-action="disconnect-canvas">断开连接</button>`
                : ""
            }
            <a class="button primary" href="${
              isCanvas
                ? `${state.integrationStatus.canvas.baseUrl}/profile/settings`
                : "https://outlook.office.com/mail/"
            }" target="_blank" rel="noreferrer">${icon("external")}${
              isCanvas ? "打开 Canvas 设置" : "打开 Outlook"
            }</a>
          </div>
        </div>
      </div>
    </div>
  `;
  lockBody();
  overlayRoot.querySelector("[data-action='close-overlay']").focus();
}

function openDeepSeekSetup() {
  overlayRoot.innerHTML = `
    <div class="overlay center" data-action="overlay-backdrop">
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="deepseek-title">
        <div class="command-header">
          <span class="integration-icon deepseek">D</span>
          <div style="flex:1">
            <strong id="deepseek-title" style="font-size:13px">DeepSeek 服务端接入</strong>
            <div style="font-size:9px;color:var(--ink-muted)">API Key 永远不进入浏览器</div>
          </div>
          <button class="icon-button" data-action="close-overlay" aria-label="关闭">${icon("close")}</button>
        </div>
        <div style="padding:24px;overflow-y:auto;max-height:calc(76vh - 59px)">
          <h2 style="margin:0 0 7px;font-family:Georgia,'Songti SC',serif;font-size:24px;font-weight:500">三步启用真实 AI 能力</h2>
          <p style="margin:0 0 18px;color:var(--ink-soft);font-size:11px;line-height:1.8">PolyFlow 已提供 <code>server.mjs</code> 安全代理。网页通过同源 <code>/api/ai/*</code> 请求摘要和翻译，密钥仅存在于服务器进程。</p>
          <div class="requirement-list">
            <li>复制 <code>.env.example</code> 为 <code>.env.local</code></li>
            <li>在 <code>.env.local</code> 设置 <code>DEEPSEEK_API_KEY</code></li>
            <li>运行 <code>node --env-file=.env.local server.mjs</code></li>
          </div>
          <pre style="margin:18px 0;padding:15px;overflow:auto;color:#dce6e2;background:#182220;border-radius:11px;font-size:10px;line-height:1.75"><code>DEEPSEEK_API_KEY=你的密钥
DEEPSEEK_MODEL=deepseek-chat
node --env-file=.env.local server.mjs</code></pre>
          <p style="margin:0;padding:12px;background:#faf5eb;border:1px solid #e6dcc7;border-radius:10px;color:#6e6049;font-size:10px;line-height:1.65">
            <strong>不要把 API Key 输入这个网页。</strong>当前配置状态来自服务端；若显示“服务未启动”，请先通过 Node 启动 <code>server.mjs</code>。共享过密钥后建议在 DeepSeek 控制台轮换。
          </p>
          <div class="drawer-actions">
            <button class="button secondary" data-action="close-overlay">返回设置</button>
            <button class="button primary" data-action="test-deepseek">${icon(
              "sparkles"
            )}测试当前连接</button>
          </div>
        </div>
      </div>
    </div>
  `;
  lockBody();
  overlayRoot.querySelector("[data-action='close-overlay']").focus();
}

async function loadIntegrationStatus() {
  try {
    const response = await fetch("./api/integrations/status", {
      headers: { accept: "application/json" },
      cache: "no-store"
    });
    if (!response.ok) throw new Error("status unavailable");
    const data = await response.json();
    state.appConfig = {
      ...state.appConfig,
      ...data.app
    };
    state.integrationStatus = {
      loading: false,
      reachable: true,
      deepseek: {
        ...state.integrationStatus.deepseek,
        ...data.deepseek
      },
      canvas: {
        ...state.integrationStatus.canvas,
        ...data.canvas
      }
    };
  } catch {
    state.integrationStatus = {
      ...state.integrationStatus,
      loading: false,
      reachable: false
    };
  }
  if (state.route === "settings" && !overlayRoot.innerHTML) renderPage();
  if (state.integrationStatus.canvas.configured) {
    syncCanvas({ silent: true });
  }
}

async function syncCanvas({ force = false, silent = false } = {}) {
  if (state.canvasSync.busy) return;
  if (!state.integrationStatus.canvas.configured) {
    if (!silent) showToast("请先一次性配置 Canvas API Token");
    return;
  }
  const previousScroll = window.scrollY;
  state.canvasSync.busy = true;
  state.canvasSync.error = null;
  if (["assignments", "materials", "settings"].includes(state.route)) renderPage();
  try {
    const response = await fetch(`./api/canvas/sync${force ? "?refresh=1" : ""}`, {
      headers: { accept: "application/json" },
      cache: "no-store"
    });
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (!response.ok) {
      const error = new Error(data.message || "Canvas 同步失败，请稍后重试。");
      error.code = data.code;
      throw error;
    }
    if (Array.isArray(data.assignments)) {
      assignments.splice(0, assignments.length, ...data.assignments);
    }
    if (Array.isArray(data.materials)) {
      materials.splice(0, materials.length, ...data.materials);
    }
    state.canvasSync.counts = data.counts || {
      courses: data.courses?.length || 0,
      assignments: data.assignments?.length || 0,
      materials: data.materials?.length || 0
    };
    state.canvasSync.lastSync = data.fetchedAt || new Date().toISOString();
    state.materialCourse = "all";
    if (!silent) showToast(`Canvas 已同步 · ${state.canvasSync.counts.assignments} 项作业`);
  } catch (error) {
    state.canvasSync.error = error.message;
    if (!silent) showToast(error.message);
  } finally {
    state.canvasSync.busy = false;
    renderPage();
    if (["assignments", "materials", "settings"].includes(state.route)) {
      requestAnimationFrame(() => window.scrollTo({ top: previousScroll, behavior: "instant" }));
    }
  }
}

async function connectCanvas() {
  if (state.canvasSync.connecting) return;
  const baseUrl = document.querySelector("#canvas-base-url")?.value.trim();
  const token = document.querySelector("#canvas-token-input")?.value.trim();
  if (!baseUrl || !token) {
    showToast("请填写 Canvas 地址和 Personal Access Token");
    return;
  }
  state.canvasSync.connecting = true;
  const submit = document.querySelector('[data-action="connect-canvas-submit"]');
  if (submit) {
    submit.disabled = true;
    submit.textContent = "正在验证...";
  }
  try {
    const response = await fetch("./api/integrations/canvas/connect", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({ baseUrl, token })
    });
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (!response.ok) throw new Error(data.message || "Canvas 连接失败，请检查 Token。");
    state.integrationStatus.canvas = {
      ...state.integrationStatus.canvas,
      ...data.canvas,
      configured: true,
      mode: "live"
    };
    state.canvasSync.error = null;
    closeOverlay();
    renderPage();
    showToast(`${data.canvas?.account?.name || "Canvas"} 已连接，正在同步`);
    syncCanvas({ force: true, silent: true });
  } catch (error) {
    showToast(error.message);
    if (submit) {
      submit.disabled = false;
      submit.textContent = "验证并连接";
    }
  } finally {
    state.canvasSync.connecting = false;
  }
}

async function loginCanvasBridge() {
  if (state.canvasSync.connecting) return;
  const baseUrl =
    document.querySelector("#canvas-base-url")?.value.trim() ||
    state.integrationStatus.canvas.baseUrl ||
    "https://canvas.polyu.edu.hk";
  state.canvasSync.connecting = true;
  const loginButton = document.querySelector('[data-action="canvas-bridge-login"]');
  if (loginButton) {
    loginButton.disabled = true;
    loginButton.textContent = "等待浏览器登录...";
  }
  try {
    const response = await fetch("./api/integrations/canvas/bridge/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({ baseUrl })
    });
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (!response.ok) {
      throw new Error(data.message || "浏览器登录尚未完成。");
    }
    state.integrationStatus.canvas = {
      ...state.integrationStatus.canvas,
      ...data.canvas,
      configured: true,
      mode: "browser-session"
    };
    state.canvasSync.error = null;
    closeOverlay();
    renderPage();
    showToast(`Canvas 浏览器会话已连接：${data.canvas?.account?.name || "当前账号"}`);
    syncCanvas({ silent: true });
  } catch (error) {
    showToast(error.message);
    if (loginButton) {
      loginButton.disabled = false;
      loginButton.textContent = "使用本机浏览器登录";
    }
  } finally {
    state.canvasSync.connecting = false;
  }
}

async function disconnectCanvas() {
  try {
    const response = await fetch("./api/integrations/canvas", {
      method: "DELETE",
      headers: { accept: "application/json" }
    });
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (!response.ok) throw new Error(data.message || "无法断开 Canvas。");
    state.integrationStatus.canvas = {
      ...state.integrationStatus.canvas,
      ...data.canvas
    };
    state.canvasSync.lastSync = null;
    state.canvasSync.counts = { courses: 4, assignments: 5, materials: 6 };
    closeOverlay();
    renderPage();
    showToast("Canvas 连接和服务器端凭据已移除");
  } catch (error) {
    showToast(error.message);
  }
}

async function requestAi(path, payload) {
  let response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch {
    const error = new Error("无法连接本地 AI 代理，请确认使用 Node 启动服务。");
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
    const error = new Error(data.message || `AI 请求失败（HTTP ${response.status}）。`);
    error.code = data.code;
    error.status = response.status;
    throw error;
  }
  return data;
}

async function testDeepSeek() {
  if (state.aiBusy) return;
  if (!state.integrationStatus.reachable) {
    showToast("请先使用 server.mjs 启动 PolyFlow，再测试 DeepSeek");
    return;
  }
  state.aiBusy = { task: "test" };
  if (state.route === "settings") renderPage();
  try {
    const result = await requestAi("./api/ai/test", {});
    showToast(`${result.message} · ${result.model}${result.mock ? "（Mock）" : ""}`);
  } catch (error) {
    showToast(error.message);
  } finally {
    state.aiBusy = null;
    if (state.route === "settings") renderPage();
    else renderPage();
  }
}

async function regenerateWithDeepSeek(task, mailId) {
  if (state.aiBusy) return;
  const mail = mails.find((item) => item.id === mailId);
  if (!mail) return;
  if (!state.integrationStatus.reachable) {
    showToast("请先使用 server.mjs 启动 PolyFlow，再调用 DeepSeek");
    return;
  }
  state.aiBusy = { task, mailId };
  renderPage();
  const payload = {
    title: mail.subjectEn,
    text: mail.original.join("\n\n")
  };
  try {
    if (task === "summarize") {
      const result = await requestAi("./api/ai/summarize", payload);
      mail.summary = result.summary;
      mail.action = result.action;
      showToast("DeepSeek 已重新生成三句摘要");
    } else {
      const result = await requestAi("./api/ai/translate", payload);
      mail.subject = result.translationTitle;
      mail.translation = result.paragraphs;
      mail.preview = result.paragraphs.find((paragraph) => paragraph !== result.paragraphs[0])?.slice(0, 120) || mail.preview;
      state.showTranslation = true;
      showToast("DeepSeek 中文翻译已更新");
    }
  } catch (error) {
    if (error.code === "NOT_CONFIGURED") {
      showToast("DeepSeek 尚未配置，请检查服务器环境变量");
    } else {
      showToast(error.message);
    }
  } finally {
    state.aiBusy = null;
    renderPage();
  }
}

function closeOverlay() {
  overlayRoot.innerHTML = "";
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

function lockBody() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
}

function showToast(message) {
  clearTimeout(state.toastTimer);
  toastRegion.innerHTML = `<div class="toast">${escapeHTML(message)}</div>`;
  state.toastTimer = setTimeout(() => {
    toastRegion.innerHTML = "";
  }, 2800);
}

function toggleAssignment(id) {
  if (state.completed.has(id)) state.completed.delete(id);
  else state.completed.add(id);
  writeStorage("polyflow-completed", [...state.completed]);
  const assignment = assignments.find((item) => item.id === id);
  renderPage();
  if (overlayRoot.innerHTML.includes("assignment-title")) {
    openAssignment(id);
  }
  showToast(
    state.completed.has(id)
      ? `“${assignment?.title || "任务"}”已标记为完成`
      : `“${assignment?.title || "任务"}”已重新打开`
  );
}

function toggleMaterialSave(id) {
  if (state.savedMaterials.has(id)) state.savedMaterials.delete(id);
  else state.savedMaterials.add(id);
  writeStorage("polyflow-saved", [...state.savedMaterials]);
  renderPage();
  showToast(state.savedMaterials.has(id) ? "资料已收藏" : "已取消收藏");
}

function copySummary(id) {
  const mail = mails.find((item) => item.id === id);
  if (!mail) return;
  const text = `${mail.subject}\n\n${mail.summary.map((line) => `• ${line}`).join("\n")}`;
  navigator.clipboard
    ?.writeText(text)
    .then(() => showToast("三句摘要已复制"))
    .catch(() => showToast("浏览器未允许剪贴板访问"));
}

function closeProfileMenu() {
  document.querySelector(".profile-menu")?.remove();
}

function openProfileMenu() {
  closeProfileMenu();
  const menu = document.createElement("div");
  menu.className = "profile-menu";
  const avatarLetter = [...state.profile.displayName][0] || "同";
  menu.innerHTML = `
    <div class="profile-menu-top">
      <span class="avatar">${escapeHTML(avatarLetter)}</span>
      <span class="profile-copy"><strong>${escapeHTML(
        state.profile.displayName
      )}</strong><small>${escapeHTML(state.profile.subtitle)}</small></span>
    </div>
    <button data-action="install-app">${icon("download")}安装到手机主屏幕</button>
    <button data-action="open-settings">${icon("settings")}连接与隐私设置</button>
    <button data-action="show-demo-note">${icon("sparkles")}关于演示数据</button>
  `;
  document.body.appendChild(menu);
}

let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

async function installApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const result = await deferredInstallPrompt.userChoice;
    if (result.outcome === "accepted") showToast("PolyFlow 正在安装");
    deferredInstallPrompt = null;
    closeProfileMenu();
    return;
  }
  showToast(
    /iPhone|iPad/i.test(navigator.userAgent)
      ? "Safari：点分享按钮，再选“添加到主屏幕”"
      : "浏览器菜单中可找到“安装应用”"
  );
  closeProfileMenu();
}

function handleSearchResult(type, id) {
  closeOverlay();
  if (type === "assignment") openAssignment(id);
  if (type === "mail") openMail(id);
  if (type === "material") {
    navigate("materials");
    const material = materials.find((item) => item.id === id);
    showToast(`即将打开“${material?.title || "课程资料"}”`);
  }
}

document.addEventListener("click", (event) => {
  const routeElement = event.target.closest("[data-route]");
  if (routeElement && !event.target.closest("[data-action]")) {
    event.preventDefault();
    navigate(routeElement.dataset.route);
    return;
  }

  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) {
    if (!event.target.closest(".profile-menu") && !event.target.closest("[data-action='profile']")) {
      closeProfileMenu();
    }
    return;
  }

  const { action } = actionElement.dataset;
  if (event.target === actionElement && action === "overlay-backdrop") {
    closeOverlay();
    return;
  }

  if (["toggle-assignment", "open-mail", "search-result", "overlay-backdrop"].includes(action)) {
    event.stopPropagation();
  }

  switch (action) {
    case "dismiss-demo":
      writeStorage("polyflow-demo-dismissed", true);
      document.querySelector(".demo-banner")?.remove();
      showToast("演示提示已关闭");
      break;
    case "open-assignment":
      openAssignment(actionElement.dataset.id);
      break;
    case "toggle-assignment":
      toggleAssignment(actionElement.dataset.id);
      break;
    case "assignment-filter":
      state.assignmentFilter = actionElement.dataset.filter;
      renderPage();
      break;
    case "material-filter":
      state.materialCourse = actionElement.dataset.course;
      renderPage();
      break;
    case "toggle-save-material":
      toggleMaterialSave(actionElement.dataset.id);
      break;
    case "open-material":
    case "download-material": {
      const material = materials.find((item) => item.id === actionElement.dataset.id);
      if (material?.source) {
        window.open(material.source, "_blank", "noopener");
      } else {
        showToast(
          action === "download-material"
            ? `“${material?.title || "资料"}”已加入演示下载队列`
            : `正在打开“${material?.title || "课程资料"}”`
        );
      }
      break;
    }
    case "sync-canvas":
      syncCanvas({ force: true });
      break;
    case "open-mail":
      openMail(actionElement.dataset.id);
      break;
    case "inbox-filter":
      state.inboxFilter = actionElement.dataset.filter;
      renderPage();
      break;
    case "toggle-mail-translation":
      state.showTranslation = !state.showTranslation;
      renderPage();
      break;
    case "close-reader":
      state.readerOpen = false;
      renderPage();
      break;
    case "mail-action":
      showToast("演示模式：正式版会在此打开对应操作");
      break;
    case "copy-summary":
      copySummary(actionElement.dataset.id);
      break;
    case "ai-summarize":
      regenerateWithDeepSeek("summarize", actionElement.dataset.id);
      break;
    case "ai-translate":
      regenerateWithDeepSeek("translate", actionElement.dataset.id);
      break;
    case "toggle-preference": {
      const key = actionElement.dataset.key;
      state.preferences[key] = !state.preferences[key];
      writeStorage("polyflow-preferences", state.preferences);
      renderPage();
      showToast(`${key === "chineseFirst" ? "中文优先" : "偏好设置"}已更新`);
      break;
    }
    case "save-profile-name": {
      const input = document.querySelector("#profile-name-input");
      const displayName = input?.value.trim().slice(0, 40);
      if (!displayName) {
        showToast("显示名称不能为空");
        break;
      }
      state.profile.displayName = displayName;
      writeStorage("polyflow-profile", state.profile);
      renderPage();
      showToast("显示名称已更新");
      break;
    }
    case "connect-canvas":
      openIntegration("canvas");
      break;
    case "connect-canvas-submit":
      connectCanvas();
      break;
    case "canvas-bridge-login":
      loginCanvasBridge();
      break;
    case "disconnect-canvas":
      disconnectCanvas();
      break;
    case "connect-outlook":
      openIntegration("outlook");
      break;
    case "open-deepseek-setup":
      openDeepSeekSetup();
      break;
    case "test-deepseek":
      testDeepSeek();
      break;
    case "open-calendar":
      closeOverlay();
      openCalendar();
      break;
    case "close-overlay":
      closeOverlay();
      break;
    case "open-settings":
      closeProfileMenu();
      navigate("settings");
      break;
    case "profile":
    case "show-profile":
      openProfileMenu();
      break;
    case "install-app":
      installApp();
      break;
    case "show-demo-note":
      closeProfileMenu();
      showToast("示例数据仅用于界面展示");
      break;
    case "search-result":
      handleSearchResult(actionElement.dataset.type, actionElement.dataset.id);
      break;
    default:
      break;
  }
});

document.addEventListener("click", (event) => {
  const target = event.target.closest(
    "#search-trigger, #mobile-search, .notification-button, #load-more"
  );
  if (!target) return;
  if (target.id === "search-trigger" || target.id === "mobile-search") openSearch();
  if (target.classList.contains("notification-button")) {
    showToast(unreadMailCount() ? `${unreadMailCount()} 封未读邮件正在等待处理` : "暂时没有新通知");
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest("#profile-button") || event.target.closest("#top-profile")) {
    event.stopPropagation();
    openProfileMenu();
  }
  if (event.target.closest("#mobile-menu-button")) {
    document.body.classList.toggle("menu-open");
  }
  if (event.target.closest(".sidebar-backdrop")) {
    document.body.classList.remove("menu-open");
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "assignment-search") {
    state.assignmentQuery = event.target.value;
    const cursor = event.target.selectionStart;
    renderPage();
    const search = document.querySelector("#assignment-search");
    search?.focus();
    search?.setSelectionRange(cursor, cursor);
  }
  if (event.target.id === "global-search-input") {
    state.searchTerm = event.target.value;
    state.searchSelected = 0;
    updateSearchResults();
  }
});

document.addEventListener("keydown", (event) => {
  const openDialog = overlayRoot.innerHTML !== "";
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (openDialog) closeOverlay();
    openSearch();
    return;
  }
  if (event.key === "Escape") {
    if (openDialog) closeOverlay();
    closeProfileMenu();
    document.body.classList.remove("menu-open");
    return;
  }
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    openSearch();
    return;
  }
  if (openDialog && event.target.id === "global-search-input" && ["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
    const results = searchItems(state.searchTerm);
    if (!results.length) return;
    event.preventDefault();
    if (event.key === "ArrowDown") {
      state.searchSelected = (state.searchSelected + 1) % results.length;
      updateSearchResults();
    } else if (event.key === "ArrowUp") {
      state.searchSelected = (state.searchSelected - 1 + results.length) % results.length;
      updateSearchResults();
    } else {
      const result = results[state.searchSelected];
      if (result) handleSearchResult(result.type, result.id);
    }
  }
  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target.matches(".assignment-card, .mail-list-item")
  ) {
    event.preventDefault();
    const card = event.target;
    if (card.matches(".assignment-card")) openAssignment(card.dataset.id);
    else openMail(card.dataset.id);
  }
});

window.addEventListener("hashchange", () => {
  const route = location.hash.replace("#", "") || "home";
  state.route = ["home", "assignments", "materials", "inbox", "settings"].includes(route)
    ? route
    : "home";
  renderPage();
});

window.addEventListener("popstate", () => {
  const route = location.hash.replace("#", "") || "home";
  state.route = route;
  renderPage();
});

document.body.insertAdjacentHTML(
  "afterbegin",
  '<button class="sidebar-backdrop" aria-label="关闭菜单"></button>'
);
document.querySelector("#search-trigger").insertAdjacentHTML("beforebegin", "");

const initialRoute = location.hash.replace("#", "") || "home";
state.route = ["home", "assignments", "materials", "inbox", "settings"].includes(initialRoute)
  ? initialRoute
  : "home";
renderPage();
loadIntegrationStatus();
setInterval(() => {
  if (state.integrationStatus.canvas.configured) syncCanvas({ silent: true });
}, 5 * 60 * 1000);

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Offline support is optional for the local prototype.
    });
  });
}
