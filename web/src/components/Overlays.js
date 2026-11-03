import { computed, ref, onMounted, nextTick, watch } from "vue";
import Icon from "./Icon.js";
import { CourseTag } from "./ui.js";
import {
  state, close, open, openMail, go, toggleComplete, search, statusOf, isSubmitted, isComplete, isAttendance,
  loginCanvasBridge, connectCanvasToken, disconnectCanvas, testDeepSeek, toast,
  loginOutlookBridge, connectOutlookLocal, disconnectOutlook
} from "../store.js";
import { dateTime, dueLabel, countdown, addDays, dayKey, fromDayKey, hkParts, fmt, courseColor } from "../utils.js";

const Modal = {
  components: { Icon },
  props: { title: String, sub: String, kind: { type: String, default: "dialog" }, wide: Boolean },
  setup() {
    const panel = ref(null);
    onMounted(() => nextTick(() => panel.value?.querySelector("[data-autofocus], input, button")?.focus()));
    return { panel, close };
  },
  template: /* html */ `
    <div class="scrim" :class="kind" @mousedown.self="close()">
      <div ref="panel" class="sheet" :class="[kind, { wide }]" role="dialog" aria-modal="true" :aria-label="title">
        <header v-if="title" class="sheet-head">
          <div><strong>{{ title }}</strong><small v-if="sub">{{ sub }}</small></div>
          <button class="icon-btn" type="button" aria-label="关闭" @click="close()"><Icon name="close" /></button>
        </header>
        <div class="sheet-body"><slot /></div>
      </div>
    </div>`
};

const AssignmentDrawer = {
  components: { Modal, Icon, CourseTag },
  props: { id: String },
  setup(props) {
    const a = computed(() => state.assignments.find((x) => x.id === props.id));
    return {
      a,
      status: () => statusOf(a.value),
      submitted: () => isSubmitted(a.value),
      complete: () => isComplete(a.value),
      cd: () => countdown(a.value?.due),
      toggleComplete,
      dateTime,
      dueLabel
    };
  },
  template: /* html */ `
    <Modal v-if="a" kind="drawer" title="作业详情">
      <div class="detail">
        <CourseTag :course="a.course" :code="a.code" />
        <h2>{{ a.title }}</h2>
        <p v-if="a.titleEn && a.titleEn !== a.title" class="detail-en">{{ a.titleEn }}</p>

        <div class="detail-due" :class="{ ok: status() }">
          <template v-if="status()">
            <Icon name="check" /><div><strong>{{ status() }}</strong>
            <span v-if="a.submittedAt">提交于 {{ dateTime(a.submittedAt) }}<template v-if="a.attempt">，第 {{ a.attempt }} 次提交</template></span>
            <span v-else>截止 {{ dateTime(a.due) }}</span></div>
          </template>
          <template v-else-if="a.due">
            <Icon name="clock" /><div><strong>{{ cd()?.overdue ? '已过截止时间' : '还剩 ' + cd()?.text }}</strong><span>{{ dateTime(a.due) }} 截止（香港时间）</span></div>
          </template>
          <template v-else><Icon name="clock" /><div><strong>无截止时间</strong><span>请在 Canvas 查看课程要求</span></div></template>
        </div>

        <dl class="facts">
          <div><dt>提交方式</dt><dd>{{ a.submission }}</dd></div>
          <div><dt>格式</dt><dd>{{ a.format }}</dd></div>
          <div><dt>分值</dt><dd>{{ a.points }}</dd></div>
        </dl>

        <section v-if="a.description"><h3>作业说明</h3><p class="prose">{{ a.description }}</p></section>
        <section v-if="a.requirements?.length">
          <h3>关键要求</h3>
          <ul class="reqs"><li v-for="r in a.requirements" :key="r">{{ r }}</li></ul>
        </section>
      </div>
      <footer class="sheet-foot">
        <a class="btn ghost" :href="a.source" target="_blank" rel="noreferrer"><Icon name="external" :size="16" />在 Canvas 打开</a>
        <button class="btn primary" type="button" @click="toggleComplete(a.id)">
          <Icon name="check" :size="16" />{{ complete() ? '重新打开' : submitted() ? '标记为已复习' : '标记为完成' }}
        </button>
      </footer>
    </Modal>`
};

const SearchPalette = {
  components: { Modal, Icon },
  setup() {
    const term = ref("");
    const index = ref(0);
    const results = computed(() => search(term.value));
    watch(term, () => (index.value = 0));
    const label = { assignment: "作业", mail: "邮件", material: "资料" };
    const icon = { assignment: "task", mail: "mail", material: "book" };
    function pick(item) {
      if (!item) return;
      if (item.type === "assignment") open("assignment", item.id);
      else if (item.type === "mail") openMail(item.id);
      else {
        close();
        go("materials");
      }
    }
    function key(e) {
      const n = results.value.length;
      if (!n) return;
      if (e.key === "ArrowDown") { e.preventDefault(); index.value = (index.value + 1) % n; }
      if (e.key === "ArrowUp") { e.preventDefault(); index.value = (index.value - 1 + n) % n; }
      if (e.key === "Enter") { e.preventDefault(); pick(results.value[index.value]); }
    }
    return { term, index, results, label, icon, pick, key, courseColor };
  },
  template: /* html */ `
    <Modal kind="palette">
      <label class="palette-input">
        <Icon name="search" />
        <input v-model="term" type="search" autocomplete="off" placeholder="搜索作业、课件、邮件" aria-label="全局搜索" data-autofocus @keydown="key" />
        <kbd>Esc</kbd>
      </label>
      <div class="palette-results" role="listbox">
        <p v-if="!results.length" class="palette-empty">没有找到“{{ term }}”。可以试试课程代码，例如 COMP5421。</p>
        <button v-for="(r, i) in results" :key="r.type + r.id" type="button" role="option" :aria-selected="i === index"
          class="palette-item" :class="{ on: i === index }" @mouseenter="index = i" @click="pick(r)">
          <span class="palette-icon" :style="r.color ? { color: courseColor(r.color) } : null"><Icon :name="icon[r.type]" :size="16" /></span>
          <span class="palette-copy"><strong>{{ r.title }}</strong><small>{{ r.meta }}</small></span>
          <span class="palette-type">{{ label[r.type] }}</span>
        </button>
      </div>
    </Modal>`
};

const CalendarDialog = {
  components: { Modal, Icon, CourseTag },
  setup() {
    const todayKey = dayKey(new Date());
    const t = hkParts();
    const cursor = ref({ y: t.y, m: t.m });
    const selected = ref(todayKey);
    const cells = computed(() => {
      const { y, m } = cursor.value;
      const first = `${y}-${String(m).padStart(2, "0")}-01`;
      const offset = (hkParts(fromDayKey(first)).wd + 6) % 7; // Monday first
      const start = addDays(first, -offset);
      return Array.from({ length: 42 }, (_, i) => {
        const key = addDays(start, i);
        const p = hkParts(fromDayKey(key));
        const due = state.assignments.filter((a) => a.due && !isAttendance(a) && dayKey(a.due) === key);
        const events = state.events.filter((e) => e.date === key);
        return { key, d: p.d, inMonth: p.m === m, today: key === todayKey, due, events };
      });
    });
    const title = computed(() => fmt.monthTitle.format(fromDayKey(`${cursor.value.y}-${String(cursor.value.m).padStart(2, "0")}-15`)));
    const day = computed(() => cells.value.find((c) => c.key === selected.value) || {
      key: selected.value,
      due: state.assignments.filter((a) => a.due && dayKey(a.due) === selected.value),
      events: state.events.filter((e) => e.date === selected.value)
    });
    function shift(n) {
      let { y, m } = cursor.value;
      m += n;
      if (m < 1) { m = 12; y--; }
      if (m > 12) { m = 1; y++; }
      cursor.value = { y, m };
    }
    return {
      cells, title, day, selected, shift, open, statusOf, courseColor,
      dayTitle: () => fmt.full.format(fromDayKey(selected.value)),
      time: (iso) => fmt.time.format(new Date(iso))
    };
  },
  template: /* html */ `
    <Modal title="学习日历" sub="作业截止和课程安排" wide>
      <div class="cal">
        <div class="cal-month">
          <div class="cal-nav">
            <button class="icon-btn" type="button" aria-label="上个月" @click="shift(-1)"><Icon name="left" /></button>
            <strong>{{ title }}</strong>
            <button class="icon-btn" type="button" aria-label="下个月" @click="shift(1)"><Icon name="chevron" /></button>
          </div>
          <div class="cal-grid">
            <span v-for="w in ['一','二','三','四','五','六','日']" :key="w" class="cal-w">{{ w }}</span>
            <button v-for="c in cells" :key="c.key" type="button" class="cal-cell"
              :class="{ out: !c.inMonth, today: c.today, sel: c.key === selected }" @click="selected = c.key">
              <span>{{ c.d }}</span>
              <span class="cal-dots">
                <i v-for="a in c.due.slice(0, 3)" :key="a.id" class="due" :style="{ background: courseColor(a.course) }"></i>
                <i v-for="e in c.events.slice(0, 2)" :key="e.id" class="ev" :style="{ borderColor: courseColor(e.course) }"></i>
              </span>
            </button>
          </div>
          <p class="cal-legend"><span><i class="due"></i>作业截止</span><span><i class="ev"></i>课程或会议</span></p>
        </div>
        <div class="cal-day">
          <h3>{{ dayTitle() }}</h3>
          <p v-if="!day.due.length && !day.events.length" class="muted">这一天没有安排。</p>
          <button v-for="a in day.due" :key="a.id" type="button" class="cal-item" @click="open('assignment', a.id)">
            <span class="cal-time">{{ time(a.due) }}</span>
            <span><CourseTag :course="a.course" :code="a.code" /><strong>{{ a.title }}</strong><small>{{ statusOf(a) || '截止' }}</small></span>
          </button>
          <div v-for="e in day.events" :key="e.id" class="cal-item event">
            <span class="cal-time">{{ e.time }}</span>
            <span><CourseTag :course="e.course" /><strong>{{ e.title }}</strong><small>{{ e.time }}–{{ e.end }}，{{ e.place }}</small></span>
          </div>
        </div>
      </div>
    </Modal>`
};

const CanvasDialog = {
  components: { Modal, Icon },
  setup() {
    const baseUrl = ref(state.integration.canvas.baseUrl || "https://canvas.polyu.edu.hk");
    const token = ref("");
    return {
      state, baseUrl, token, loginCanvasBridge, disconnectCanvas,
      submit: () => connectCanvasToken(baseUrl.value.trim(), token.value.trim()),
      connected: () => ["session", "bridge"].includes(state.integration.canvas.source)
    };
  },
  template: /* html */ `
    <Modal title="连接 Canvas" sub="不保存学校密码，不会替你提交作业">
      <div class="connect">
        <p class="prose">PolyU 不允许学生自己生成 Token，所以推荐用本机浏览器登录一次：PolyFlow 会打开一个独立的 Chrome 窗口，你在学校官方页面输入账号和 MFA，之后自动复用这次登录同步课程、作业和资料。</p>

        <div v-if="state.integration.canvas.bridgeEnabled" class="connect-main">
          <ol class="steps">
            <li>点下面的按钮，等待 Chrome 打开</li>
            <li>在官方页面完成登录和 MFA</li>
            <li>登录成功后窗口自动关闭并开始同步</li>
          </ol>
          <p v-if="state.integration.canvas.account?.name" class="muted">当前账号：{{ state.integration.canvas.account.name }}</p>
          <button class="btn primary block" type="button" :disabled="state.canvasSync.connecting" @click="loginCanvasBridge()">
            <Icon name="external" :size="16" />{{ state.canvasSync.connecting ? '等待你在浏览器里登录…' : state.integration.canvas.account?.name ? '重新登录' : '用本机浏览器登录' }}
          </button>
        </div>
        <p v-else-if="!state.integration.reachable" class="notice">本地服务没有运行，所以现在无法连接。请用“启动 PolyFlow”打开本页面。</p>

        <details class="token">
          <summary>学校允许时，改用 Personal Access Token</summary>
          <label class="field"><span>Canvas 地址</span><input v-model="baseUrl" type="url" autocomplete="url" /></label>
          <label class="field"><span>Personal Access Token</span>
            <input v-model="token" type="password" autocomplete="off" spellcheck="false"
              :placeholder="state.integration.canvas.configured ? '已连接；粘贴新 Token 可替换' : '粘贴你的 Token'" /></label>
          <button class="btn ghost" type="button" :disabled="state.canvasSync.connecting" @click="submit()">
            <Icon name="link" :size="16" />{{ state.canvasSync.connecting ? '正在验证…' : '验证并连接' }}
          </button>
        </details>
      </div>
      <footer class="sheet-foot">
        <button v-if="connected()" class="btn danger" type="button" @click="disconnectCanvas()">断开连接</button>
        <a class="btn ghost" :href="state.integration.canvas.baseUrl" target="_blank" rel="noreferrer"><Icon name="external" :size="16" />打开 Canvas</a>
      </footer>
    </Modal>`
};

const OutlookDialog = {
  components: { Modal, Icon },
  setup() {
    const o = computed(() => state.integration.outlook);
    const sourceText = computed(() => {
      if (!o.value.configured) return "";
      if (o.value.source === "bridge") return `Outlook 网页版（浏览器登录）${o.value.account?.name ? "，" + o.value.account.name : ""}`;
      return o.value.app === "outlook" ? "这台 Mac 上的 Outlook" : "这台 Mac 上的“邮件”App";
    });
    return { state, o, sourceText, loginOutlookBridge, connectOutlookLocal, disconnectOutlook, busy: (k) => state.mailSync.connecting === k };
  },
  template: /* html */ `
    <Modal title="连接 Outlook" sub="只读取，不发信、不删信、不改已读状态" wide>
      <div class="connect">
        <p v-if="o.configured" class="connected-line"><Icon name="check" :size="16" />当前连接：{{ sourceText }}</p>
        <p v-if="!state.integration.reachable" class="notice">本地服务没有运行，所以现在无法连接。请用“启动 PolyFlow”打开本页面。</p>

        <div class="ways">
          <section class="way">
            <h3>用浏览器登录 Outlook 网页版</h3>
            <p class="prose">和 Canvas 一样：打开一个独立的 Chrome 窗口，你在微软或学校的官方页面登录并完成 MFA，之后 PolyFlow 复用这次登录读取收件箱和日历。登录时勾选“保持登录状态”，可以更久不用重新登录。</p>
            <p class="way-note">读取方式是 Outlook 网页版自己使用的内部接口，没有公开文档。微软改版后可能需要更新 PolyFlow。</p>
            <button v-if="o.bridgeEnabled" class="btn primary" type="button" :disabled="!!state.mailSync.connecting" @click="loginOutlookBridge()">
              <Icon name="external" :size="16" />{{ busy('bridge') ? '等待你在浏览器里登录…' : (o.source === 'bridge' ? '重新登录' : '用浏览器登录') }}
            </button>
            <p v-else class="muted">只在本机运行 PolyFlow 时可用。</p>
          </section>

          <section class="way">
            <h3>读取这台 Mac 上的邮件 App</h3>
            <p class="prose">如果你已经在“邮件”App 或 Outlook 桌面版里收学校邮件，PolyFlow 可以直接读本机已经同步好的邮件，日程来自“日历”App。不需要再登录，也不依赖网页接口。</p>
            <p class="way-note">第一次读取时 macOS 会询问是否允许“终端”控制“邮件”或 Outlook、访问日历，请选“允许”。新版 Outlook 不支持被读取，需要切回旧版。</p>
            <div v-if="o.localEnabled" class="way-actions">
              <button class="btn primary" type="button" :disabled="!!state.mailSync.connecting" @click="connectOutlookLocal('mail')">
                <Icon name="mail" :size="16" />{{ busy('mail') ? '正在读取…' : '读取“邮件”App' }}
              </button>
              <button class="btn ghost" type="button" :disabled="!!state.mailSync.connecting" @click="connectOutlookLocal('outlook')">
                {{ busy('outlook') ? '正在读取…' : '读取 Outlook 桌面版' }}
              </button>
            </div>
            <p v-else class="muted">只在 Mac 上本机运行 PolyFlow 时可用。</p>
          </section>
        </div>

        <p class="way-foot">两种方式都只在你的电脑上运行，邮件不会上传到任何服务器。只有你点“生成摘要”或“翻译”时，那一封邮件的内容才会发给 DeepSeek。</p>
      </div>
      <footer v-if="o.configured" class="sheet-foot">
        <button class="btn danger" type="button" @click="disconnectOutlook()">断开连接</button>
      </footer>
    </Modal>`
};

const DeepSeekDialog = {
  components: { Modal, Icon },
  setup() {
    return { state, testDeepSeek };
  },
  template: /* html */ `
    <Modal title="配置 DeepSeek" sub="API Key 只放在服务器，不会进入浏览器">
      <div class="connect">
        <ol class="steps">
          <li>把项目里的 <code>.env.example</code> 复制为 <code>.env.local</code></li>
          <li>在 <code>.env.local</code> 里填写 <code>DEEPSEEK_API_KEY</code></li>
          <li>关掉并重新打开“启动 PolyFlow”</li>
        </ol>
        <pre class="code">DEEPSEEK_API_KEY=sk-你的密钥
DEEPSEEK_MODEL=deepseek-chat</pre>
        <p class="notice">不要把 Key 粘贴到这个网页里。只想试界面、不消耗额度，可以用 <code>DEEPSEEK_MOCK=1 npm start</code> 启动。</p>
      </div>
      <footer class="sheet-foot">
        <button class="btn primary" type="button" :disabled="!!state.aiBusy" @click="testDeepSeek()">
          <Icon name="sparkles" :size="16" />{{ state.aiBusy?.task === 'test' ? '测试中…' : '测试连接' }}
        </button>
      </footer>
    </Modal>`
};

export default {
  components: { AssignmentDrawer, SearchPalette, CalendarDialog, CanvasDialog, OutlookDialog, DeepSeekDialog },
  setup() {
    return { state };
  },
  template: /* html */ `
    <AssignmentDrawer v-if="state.overlay?.type === 'assignment'" :id="state.overlay.id" :key="state.overlay.id" />
    <SearchPalette v-else-if="state.overlay?.type === 'search'" />
    <CalendarDialog v-else-if="state.overlay?.type === 'calendar'" />
    <CanvasDialog v-else-if="state.overlay?.type === 'canvas'" />
    <OutlookDialog v-else-if="state.overlay?.type === 'outlook'" />
    <DeepSeekDialog v-else-if="state.overlay?.type === 'deepseek'" />`
};
