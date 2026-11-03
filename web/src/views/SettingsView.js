import { computed, ref } from "vue";
import Icon from "../components/Icon.js";
import { PageHead, Toggle, Segmented } from "../components/ui.js";
import { state, open, syncCanvas, testDeepSeek, saveName, unreadCount, needsLogin, loginCanvasBridge, syncOutlook, outlookNeedsLogin, loginOutlookBridge } from "../store.js";
import { fmt } from "../utils.js";

export default {
  components: { Icon, PageHead, Toggle, Segmented },
  setup() {
    const name = ref(state.profile.displayName);
    const ig = state.integration;
    const canvasState = computed(() => {
      if (ig.loading) return { text: "检查中", tone: "" };
      if (!ig.reachable) return { text: "本地服务未运行", tone: "warn" };
      if (state.canvasSync.busy) return { text: "正在同步", tone: "" };
      if (needsLogin.value) return { text: "登录已过期", tone: "warn" };
      if (state.canvasSync.error) return { text: "同步失败", tone: "warn" };
      if (ig.canvas.configured) return { text: "已连接", tone: "ok" };
      return { text: "未连接", tone: "" };
    });
    const mailState = computed(() => {
      const o = ig.outlook;
      if (ig.loading) return { text: "检查中", tone: "" };
      if (!o.configured) return { text: "演示", tone: "" };
      if (state.mailSync.busy) return { text: "正在同步", tone: "" };
      if (outlookNeedsLogin.value) return { text: "登录已过期", tone: "warn" };
      if (state.mailSync.error) return { text: "同步失败", tone: "warn" };
      return { text: "已连接", tone: "ok" };
    });
    const mailSource = computed(() => {
      const o = ig.outlook;
      if (!o.configured) return "Microsoft 365 邮件与日历，只读";
      if (o.source === "bridge") return `Outlook 网页版，浏览器登录${o.account?.name ? "，" + o.account.name : ""}`;
      return o.app === "outlook" ? "本机 Outlook 桌面版和“日历”App" : "本机“邮件”App 和“日历”App";
    });
    const aiState = computed(() => {
      if (ig.loading) return { text: "检查中", tone: "" };
      if (!ig.reachable) return { text: "本地服务未运行", tone: "warn" };
      if (ig.deepseek.mock) return { text: "Mock 模式", tone: "ok" };
      if (ig.deepseek.configured) return { text: "已配置", tone: "ok" };
      return { text: "未配置", tone: "" };
    });
    const prefs = [
      { key: "chineseFirst", title: "中文优先", text: "打开邮件时默认显示中文翻译" },
      { key: "deadlineAlerts", title: "截止提醒", text: "截止前 48 小时用荧光标记突出显示" },
      { key: "conciseSummary", title: "三句摘要", text: "只提炼行动、时间和风险，不扩写原文" },
      { key: "autoAi", title: "打开邮件时自动生成摘要", text: "开启后，打开的那封邮件会自动发给 DeepSeek 生成摘要和翻译" }
    ];
    return {
      state, ig, name, canvasState, mailState, mailSource, aiState, prefs, syncOutlook, outlookNeedsLogin, loginOutlookBridge, open, syncCanvas, testDeepSeek, saveName, unreadCount, needsLogin, loginCanvasBridge,
      themes: [{ value: "system", label: "跟随系统" }, { value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
      host: () => { try { return new URL(ig.canvas.baseUrl).hostname; } catch { return "Canvas"; } },
      fmtTime: (iso) => fmt.time.format(new Date(iso)),
      lastSync: () => (state.canvasSync.lastSync ? `${fmt.time.format(new Date(state.canvasSync.lastSync))} 同步` : "")
    };
  },
  template: /* html */ `
    <div class="page settings">
      <PageHead title="连接与设置" lede="学校密码和 API Key 都不会经过这个网页。" />

      <section class="svc-list">
        <article class="svc">
          <span class="svc-mark canvas">C</span>
          <div class="svc-copy">
            <h2>Canvas <span class="pill" :class="canvasState.tone">{{ canvasState.text }}</span></h2>
            <p>{{ host() }}<template v-if="ig.canvas.account?.name">，{{ ig.canvas.account.name }}</template><template v-if="lastSync()">，{{ lastSync() }}</template></p>
            <p v-if="state.canvasSync.error && !state.canvasSync.busy" class="svc-error">
              {{ needsLogin ? '学校的登录会话已失效，后台同步无法继续。点“重新登录”，在弹出的 Chrome 里重新完成登录和 MFA 即可。' : state.canvasSync.error }}
            </p>
            <p class="svc-stats">{{ state.canvasSync.counts.courses }} 门课程，{{ state.canvasSync.counts.assignments }} 项作业，{{ state.canvasSync.counts.materials }} 份资料<template v-if="!ig.canvas.configured || !state.canvasSync.lastSync">（演示数据）</template></p>
          </div>
          <div class="svc-actions">
            <template v-if="needsLogin && ig.canvas.bridgeEnabled">
              <button class="btn ghost" type="button" @click="open('canvas')">管理连接</button>
              <button class="btn primary" type="button" :disabled="state.canvasSync.connecting" @click="loginCanvasBridge()">
                <Icon name="external" :size="16" />{{ state.canvasSync.connecting ? '等待你在浏览器里登录…' : '重新登录' }}</button>
            </template>
            <template v-else>
              <button v-if="ig.canvas.configured" class="btn ghost" type="button" :disabled="state.canvasSync.busy" @click="syncCanvas({ force: true })">
                <Icon name="refresh" :size="16" :class="{ spin: state.canvasSync.busy }" />立即同步</button>
              <button class="btn primary" type="button" @click="open('canvas')">{{ ig.canvas.configured ? '管理连接' : '连接 Canvas' }}</button>
            </template>
          </div>
        </article>

        <article class="svc">
          <span class="svc-mark outlook">O</span>
          <div class="svc-copy">
            <h2>Outlook <span class="pill" :class="mailState.tone">{{ mailState.text }}</span></h2>
            <p>{{ mailSource }}<template v-if="state.mailSync.lastSync">，{{ fmtTime(state.mailSync.lastSync) }} 同步</template></p>
            <p v-if="state.mailSync.error && !state.mailSync.busy" class="svc-error">
              {{ outlookNeedsLogin ? 'Outlook 的登录已失效。点“重新登录”，在弹出的 Chrome 里重新登录即可。' : state.mailSync.error }}
            </p>
            <p class="svc-stats">{{ state.mails.length }} 封邮件，{{ unreadCount }} 封未读，{{ state.events.length }} 个日程<template v-if="!ig.outlook.configured">（演示数据）</template></p>
          </div>
          <div class="svc-actions">
            <template v-if="outlookNeedsLogin && ig.outlook.source === 'bridge'">
              <button class="btn ghost" type="button" @click="open('outlook')">管理连接</button>
              <button class="btn primary" type="button" :disabled="!!state.mailSync.connecting" @click="loginOutlookBridge()">
                <Icon name="external" :size="16" />{{ state.mailSync.connecting ? '等待你在浏览器里登录…' : '重新登录' }}</button>
            </template>
            <template v-else>
              <button v-if="ig.outlook.configured" class="btn ghost" type="button" :disabled="state.mailSync.busy" @click="syncOutlook({ force: true })">
                <Icon name="refresh" :size="16" :class="{ spin: state.mailSync.busy }" />立即同步</button>
              <button class="btn primary" type="button" @click="open('outlook')">{{ ig.outlook.configured ? '管理连接' : '连接 Outlook' }}</button>
            </template>
          </div>
        </article>

        <article class="svc">
          <span class="svc-mark ai">D</span>
          <div class="svc-copy">
            <h2>DeepSeek <span class="pill" :class="aiState.tone">{{ aiState.text }}</span></h2>
            <p>邮件翻译和摘要，经服务器代理，模型 {{ ig.deepseek.model }}</p>
            <p class="svc-stats">每分钟最多 20 次请求</p>
          </div>
          <div class="svc-actions">
            <button class="btn ghost" type="button" :disabled="!!state.aiBusy || !ig.reachable" @click="testDeepSeek()">{{ state.aiBusy?.task === 'test' ? '测试中…' : '测试连接' }}</button>
            <button class="btn ghost" type="button" @click="open('deepseek')">配置说明</button>
          </div>
        </article>
      </section>

      <h2 class="group-title">偏好</h2>
      <section class="prefs">
        <div class="pref">
          <div><strong>外观</strong><span>浅色、深色或跟随系统</span></div>
          <Segmented v-model="state.theme" :options="themes" label="外观" />
        </div>
        <div v-for="p in prefs" :key="p.key" class="pref">
          <div><strong>{{ p.title }}</strong><span>{{ p.text }}</span></div>
          <Toggle v-model="state.preferences[p.key]" :label="p.title" />
        </div>
        <form class="pref" @submit.prevent="saveName(name)">
          <div><strong>显示名称</strong><span>只保存在这个浏览器里</span></div>
          <span class="name-form"><input v-model="name" maxlength="40" aria-label="显示名称" /><button class="btn ghost" type="submit">保存</button></span>
        </form>
      </section>

      <p class="foot-note"><Icon name="lock" :size="16" />本机浏览器登录只适合在自己的电脑上使用。部署到公共服务器之前，需要先加上用户登录和每人独立的凭据存储，详见 docs/ARCHITECTURE.md。</p>
    </div>`
};
