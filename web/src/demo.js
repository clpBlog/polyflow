// Demo data. Dates are relative to today so the demo always looks current.
import { addDays, dayKey } from "./utils.js";

const today = dayKey(new Date());
const at = (days, time) => `${addDays(today, days)}T${time}:00+08:00`;

export function demoAssignments() {
  return [
    {
      id: "a1",
      course: "AI & Digital Transformation",
      code: "COMP6309",
      title: "个人案例分析报告",
      titleEn: "Individual Case Analysis Report",
      due: at(1, "23:59"),
      points: "100 分",
      submission: "文件上传",
      format: "DOC, DOCX, PDF",
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
      source: "https://canvas.polyu.edu.hk/courses/6309/assignments/26235"
    },
    {
      id: "a2",
      course: "Cloud Computing",
      code: "COMP5421",
      title: "实验三：容器部署反思",
      titleEn: "Lab 3: Container Deployment Reflection",
      due: at(2, "18:00"),
      points: "40 分",
      submission: "文字提交",
      format: "在线文本框",
      summary: "复盘 Docker 与 Kubernetes 实验，比较两种部署方式的可观测性与故障恢复能力。",
      description:
        "基于本周容器部署实验，提交一份约 800 字的英文反思，说明实验中遇到的部署问题、排查过程，以及 Docker Compose 与 Kubernetes 在故障恢复方面的差异。",
      requirements: ["英文撰写，约 800 字", "至少引用一次实验日志或监控数据", "包含一段个人反思与改进方案", "在线提交，无需上传附件"],
      source: "https://canvas.polyu.edu.hk/courses/5421/assignments/28115"
    },
    {
      id: "a3",
      course: "Data Mining",
      code: "COMP5434",
      title: "测验二：决策树与集成学习",
      titleEn: "Quiz 2: Decision Trees & Ensemble Learning",
      due: at(5, "10:00"),
      points: "20 分",
      submission: "在线测验",
      format: "30 分钟，20 题",
      summary: "覆盖信息增益、剪枝、随机森林与梯度提升，允许携带一页 A4 手写笔记。",
      description:
        "在线限时测验，共 20 道选择题与 2 道简答题。重点复习决策树的划分准则、过拟合控制，以及 Bagging 与 Boosting 的差异。",
      requirements: ["开放 36 小时，开始后限时 30 分钟", "开始后不可暂停", "允许一页 A4 手写笔记", "不允许使用生成式 AI 工具"],
      source: "https://canvas.polyu.edu.hk/courses/5434/quizzes/12088"
    },
    {
      id: "a4",
      course: "Business Analytics",
      code: "COMP5111",
      title: "小组讨论：预测模型伦理",
      titleEn: "Group Discussion: Ethics of Predictive Models",
      due: at(-3, "23:59"),
      points: "10 分",
      submission: "论坛回复",
      format: "文字回复",
      summary: "完成两轮论坛讨论，围绕预测性警务模型中的公平性与可解释性问题。",
      description: "阅读指定案例并参与两轮班级讨论。第一轮分析模型偏见来源，第二轮回应至少一位同学的观点。",
      requirements: ["完成 1 条主帖与 2 条回复", "每段至少引用一篇课程阅读"],
      source: "https://canvas.polyu.edu.hk/courses/5111/discussion_topics/9981",
      submissionState: "graded",
      isSubmitted: true,
      submittedAt: at(-4, "21:12"),
      attempt: 1
    },
    {
      id: "a5",
      course: "AI Ethics",
      code: "COMP5222",
      title: "AI Governance 阅读笔记",
      titleEn: "AI Governance Reading Reflection",
      due: at(8, "23:59"),
      points: "15 分",
      submission: "文件上传",
      format: "PDF",
      summary: "比较欧盟 AI Act 与香港现行治理框架，提炼三条适用于校园 AI 工具的建议。",
      description: "阅读课程指定材料并完成一页治理框架对比。请重点关注透明度、审计责任与高风险系统的分类方法。",
      requirements: ["不超过 1,200 字", "包含框架对比表", "提出至少 3 条可执行建议", "提交 PDF"],
      source: "https://canvas.polyu.edu.hk/courses/5222/assignments/30142"
    },
    {
      id: "a6",
      course: "Cloud Computing",
      code: "COMP5421",
      title: "期中项目提案",
      titleEn: "Mid-term Project Proposal",
      due: at(11, "12:00"),
      points: "30 分",
      submission: "文件上传",
      format: "PDF，最多 4 页",
      summary: "提交云原生项目的问题陈述、架构草图和三周里程碑。",
      description: "以 2–3 人小组为单位，提交云原生应用项目提案，包含问题陈述、系统架构草图、技术选型理由和里程碑计划。",
      requirements: ["最多 4 页", "附系统架构图", "列出组员分工", "每组提交一份"],
      source: "https://canvas.polyu.edu.hk/courses/5421/assignments/28140"
    },
    {
      id: "a7",
      course: "Data Mining",
      code: "COMP5434",
      title: "Week 9 Class Attendance",
      titleEn: "Week 9 Class Attendance",
      due: at(-1, "12:30"),
      points: "1 分",
      submission: "课堂签到",
      format: "课堂签到",
      summary: "课堂出席记录。",
      description: "课堂出席由 Canvas 自动记录。",
      requirements: [],
      source: "https://canvas.polyu.edu.hk/courses/5434",
      category: "attendance",
      submissionState: "graded",
      isSubmitted: true
    }
  ];
}

export function demoMaterials() {
  return [
    { id: "m1", course: "AI & Digital Transformation", title: "第 7 讲：大语言模型架构与推理", type: "PDF", meta: "42 页，18.6 MB", updated: "昨天更新" },
    { id: "m2", course: "Cloud Computing", title: "Workshop：用 Kubernetes 部署微服务", type: "VIDEO", meta: "58 分钟，含字幕", updated: "3 天前" },
    { id: "m3", course: "Data Mining", title: "Week 8 Reading List", type: "READING", meta: "3 篇论文，约 72 分钟", updated: "4 天前" },
    { id: "m4", course: "Cloud Computing", title: "Lab 3 Starter Files", type: "ZIP", meta: "8.4 MB，源代码与说明", updated: "5 天前" },
    { id: "m5", course: "AI & Digital Transformation", title: "案例阅读：金融科技中的信用评分", type: "PDF", meta: "16 页，英文", updated: "上周" },
    { id: "m6", course: "AI Ethics", title: "期末项目说明与评分标准", type: "SLIDES", meta: "24 页", updated: "上周" },
    { id: "m7", course: "Data Mining", title: "第 8 讲：集成学习", type: "SLIDES", meta: "36 页", updated: "上周" }
  ];
}

export function demoEvents() {
  return [
    { id: "e1", day: 0, time: "14:30", end: "16:00", title: "COMP6309 案例工作坊", place: "Zoom 线上", course: "AI & Digital Transformation", assignment: "a1" },
    { id: "e2", day: 0, time: "19:30", end: "20:30", title: "AI Governance 小组会议", place: "Teams", course: "AI Ethics" },
    { id: "e3", day: 1, time: "09:30", end: "12:20", title: "Cloud Computing 讲课", place: "Y302", course: "Cloud Computing" },
    { id: "e4", day: 3, time: "12:30", end: "15:20", title: "Data Mining 讲课", place: "N001", course: "Data Mining" }
  ].map((event) => ({ ...event, date: addDays(today, event.day) }));
}

export function demoMails() {
  return [
    {
      id: "mail-1",
      source: "PO",
      sender: "Prof. Wong Ka Ming",
      senderEmail: "km.wong@polyu.edu.hk",
      subject: "重要：期末项目提交清单",
      subjectEn: "Important: Final Project submission checklist",
      preview: "提交前，请逐项确认报告格式、参考引用与同行评审文件。系统会在截止后自动关闭提交入口。",
      time: "09:42",
      unread: true,
      tag: "课程",
      original: [
        "Dear students,",
        "A quick reminder that the final project submission portal will close tomorrow at 23:59 (HKT). Please use the checklist below before submitting your work.",
        "Check that your report is uploaded as a single DOCX or PDF file, references follow the course guide, and the peer review form is included as an appendix. Late submissions will be handled according to the programme policy.",
        "If you encounter any technical issue, contact me before the deadline and include a screenshot of the error.",
        "Best regards,\nProf. Wong"
      ],
      translation: [
        "各位同学：",
        "提醒大家，期末项目提交入口将于明天 23:59（香港时间）关闭。请在提交前按以下清单逐项确认。",
        "请确认报告以单个 DOCX 或 PDF 文件上传，参考文献遵循课程指南，并将同行评审表作为附录一并提交。逾期提交将按课程政策处理。",
        "如果遇到技术问题，请在截止前联系我，并附上错误截图。",
        "祝好，\nWong 教授"
      ],
      summary: [
        "截止时间：明天 23:59，截止后系统关闭提交入口。",
        "提交格式：单个 DOCX 或 PDF，参考文献与同行评审表必须齐全。",
        "技术故障需在截止前带截图联系教授，逾期按课程政策处理。"
      ],
      action: "查看 Canvas 作业",
      assignment: "a1"
    },
    {
      id: "mail-2",
      source: "CA",
      sender: "COMP5421 Teaching Team",
      senderEmail: "comp5421@polyu.edu.hk",
      subject: "实验三答疑与提交说明",
      subjectEn: "Lab 3 Q&A and submission instructions",
      preview: "本周五不再安排实体答疑；问题请发到讨论区。实验报告需同时提交日志与 800 字反思。",
      time: "昨天",
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
      summary: ["本周五实体答疑取消，问题请发布到 Canvas 讨论区。", "提交必须包含部署日志和约 800 字英文反思。", "缺少日志或反思任一部分都会扣分。"],
      action: "前往课程讨论区",
      assignment: "a2"
    },
    {
      id: "mail-3",
      source: "IT",
      sender: "ITS Service Desk",
      senderEmail: "its@polyu.edu.hk",
      subject: "计划维护：学习平台短暂不可用",
      subjectEn: "Scheduled maintenance: Learning platforms unavailable",
      preview: "本周六 01:00–04:00 将维护 Canvas 与 Panopto。请提前下载需要的课堂录像。",
      time: "周日",
      unread: false,
      tag: "系统",
      original: [
        "Dear Staff and Students,",
        "Scheduled maintenance will take place this Saturday between 01:00 and 04:00 (HKT). During this window, Canvas and Panopto may be temporarily unavailable.",
        "We recommend downloading any teaching recordings or assignment materials you need before the maintenance period. Email and Microsoft 365 services will not be affected.",
        "We apologise for any inconvenience caused."
      ],
      translation: [
        "各位教职员及同学：",
        "系统将于本周六凌晨 01:00 至 04:00（香港时间）进行计划维护。期间 Canvas 与 Panopto 可能暂时无法使用。",
        "建议在维护前下载所需的课堂录像或作业材料。邮件与 Microsoft 365 服务不受影响。",
        "对可能造成的不便，我们深表歉意。"
      ],
      summary: ["维护时间：本周六 01:00–04:00。", "受影响服务：Canvas 与 Panopto。", "请提前下载课堂录像和材料；邮件与 M365 不受影响。"],
      action: "打开 ITS 公告"
    },
    {
      id: "mail-4",
      source: "MS",
      sender: "Microsoft Teams",
      senderEmail: "noreply@teams.microsoft.com",
      subject: "小组项目会议已添加至你的日历",
      subjectEn: "A group project meeting was added to your calendar",
      preview: "AI Governance 小组将在今晚 19:30 开会，Teams 链接已附在日历邀请中。",
      time: "周六",
      unread: false,
      tag: "日历",
      original: [
        "Your meeting has been added to your calendar.",
        "AI Governance Group Project",
        "Today, 19:30–20:30 (HKT)",
        "Organiser: Rachel Lam",
        "Join using the Microsoft Teams link in the calendar invitation."
      ],
      translation: ["会议已添加到你的日历。", "AI Governance 小组项目", "今天 19:30–20:30（香港时间）", "组织者：Rachel Lam", "请使用日历邀请中的 Microsoft Teams 链接加入。"],
      summary: ["AI Governance 小组会议今晚 19:30 开始。", "会议时长 1 小时，组织者是 Rachel Lam。", "Teams 加入链接在日历邀请中。"],
      action: "打开日历邀请"
    },
    {
      id: "mail-5",
      source: "LB",
      sender: "PolyU Library",
      senderEmail: "lib@polyu.edu.hk",
      subject: "你的预约书籍现已可取",
      subjectEn: "Your reserved book is ready for collection",
      preview: "你预约的《Designing Machine Learning Systems》现已到馆，请在一周内领取。",
      time: "上周",
      unread: false,
      tag: "图书馆",
      original: [
        "Dear Student,",
        "The item you reserved, Designing Machine Learning Systems, is now available for collection at the University Library.",
        "Please collect it within 7 days. After this, the reservation will expire and the item will be released to the next borrower.",
        "Thank you."
      ],
      translation: ["同学：", "你预约的《Designing Machine Learning Systems》现已可在大学图书馆领取。", "请在 7 天内领取。逾期后预约将失效，该书会释放给下一位借阅者。", "谢谢。"],
      summary: ["预约书籍已到馆。", "请在 7 天内领取。", "逾期后预约将自动释放。"],
      action: "查看借阅记录"
    }
  ];
}
