import { computed } from "vue";
import Icon from "../components/Icon.js";
import { PageHead, Segmented, Empty } from "../components/ui.js";
import {
  state, unreadCount, mailLive, outlookNeedsLogin, rewriteMail, copySummary, open, toast, syncOutlook, autoAi
} from "../store.js";
import { fmt } from "../utils.js";

export default {
  components: { Icon, PageHead, Segmented, Empty },
  setup() {
    const ib = state.inbox;
    const list = computed(() => state.mails.filter((m) => ib.filter === "all" || (ib.filter === "unread" ? m.unread : !m.unread)));
    const mail = computed(() => state.mails.find((m) => m.id === ib.selected) || list.value[0] || null);
    const ai = computed(() => state.integration.deepseek.configured);

    function select(m) {
      m.unread = false; // local only; the mailbox itself is never changed
      ib.selected = m.id;
      ib.readerOpen = true;
      ib.showTranslation = state.preferences.chineseFirst;
      autoAi(m);
    }
    const lede = computed(() => {
      const o = state.integration.outlook;
      if (!mailLive.value) return "英文邮件先看三句中文摘要，需要时再读全文。现在是演示邮件。";
      if (state.mailSync.busy && !state.mailSync.lastSync) return "正在读取邮件…";
      const from = o.source === "bridge" ? "Outlook 网页版" : o.app === "outlook" ? "本机 Outlook" : "本机“邮件”App";
      const when = state.mailSync.lastSync ? `，${fmt.time.format(new Date(state.mailSync.lastSync))} 同步` : "";
      return `来自${from}${when}。只读，不会改动你的邮箱。`;
    });
    const subject = (m) => (ib.showTranslation ? m.translatedSubject || m.subject : m.subjectEn || m.subject);
    const body = (m) => (ib.showTranslation && m.translation ? m.translation : m.original);
    const linkLabel = (m) => (m.link?.startsWith("message:") ? "在“邮件”中打开" : "在 Outlook 中打开");
    function primary(m) {
      if (m.assignment) open("assignment", m.assignment);
      else toast("演示邮件：连接 Outlook 后这里会打开对应页面");
    }

    return {
      state, ib, list, mail, ai, lede, select, subject, body, linkLabel, primary, rewriteMail, copySummary, open, syncOutlook,
      mailLive, outlookNeedsLogin,
      filters: computed(() => [
        { value: "all", label: "全部" },
        { value: "unread", label: "未读", count: unreadCount.value },
        { value: "read", label: "已读" }
      ]),
      langs: [{ value: true, label: "中文" }, { value: false, label: "原文" }],
      busy: (task) => state.aiBusy?.task === task && state.aiBusy?.mailId === mail.value?.id
    };
  },
  template: /* html */ `
    <div class="page inbox-page">
      <PageHead title="邮件" :lede="lede">
        <button v-if="mailLive" class="btn ghost" type="button" :disabled="state.mailSync.busy" @click="syncOutlook({ force: true })">
          <Icon name="refresh" :size="16" :class="{ spin: state.mailSync.busy }" />{{ state.mailSync.busy ? '同步中' : '同步邮件' }}
        </button>
        <button class="btn" :class="mailLive ? 'ghost' : 'primary'" type="button" @click="open('outlook')">
          <Icon name="mail" :size="16" />{{ mailLive ? '管理连接' : '连接 Outlook' }}
        </button>
      </PageHead>

      <p v-if="state.mailSync.error && !state.mailSync.busy" class="notice inbox-notice">
        {{ outlookNeedsLogin ? 'Outlook 登录已过期，下面是上次读到的邮件。请点“管理连接”重新登录。' : state.mailSync.error }}
      </p>
      <p v-for="w in state.mailSync.warnings" :key="w" class="notice inbox-notice soft">{{ w }}</p>

      <Empty v-if="!state.mails.length" icon="mail" title="收件箱里没有邮件"
        :text="state.mailSync.busy ? '正在读取…' : '最近 40 封邮件会显示在这里。'" />

      <div v-else class="inbox" :class="{ reading: ib.readerOpen }">
        <div class="mail-list">
          <div class="mail-list-head"><Segmented v-model="ib.filter" :options="filters" label="筛选邮件" /></div>
          <button v-for="m in list" :key="m.id" type="button" class="mail-item"
            :class="{ unread: m.unread, on: m.id === mail?.id }" @click="select(m)">
            <span class="mail-avatar">{{ m.source }}</span>
            <span class="mail-item-copy">
              <span class="mail-item-top"><strong>{{ m.sender }}</strong><small>{{ m.time }}</small></span>
              <span class="mail-item-subject">{{ m.translatedSubject || m.subject }}</span>
              <span class="mail-item-preview">{{ m.summary ? m.summary[0] : m.preview }}</span>
            </span>
          </button>
          <p v-if="!list.length" class="muted pad">没有符合条件的邮件。</p>
        </div>

        <article v-if="mail" class="reader">
          <div class="reader-bar">
            <button class="icon-btn back" type="button" aria-label="返回邮件列表" @click="ib.readerOpen = false"><Icon name="left" /></button>
            <span class="reader-tag">{{ mail.tag }}</span>
            <Segmented v-model="ib.showTranslation" :options="langs" label="语言" />
          </div>
          <h2 class="reader-subject">{{ subject(mail) }}</h2>
          <p class="reader-from"><strong>{{ mail.sender }}</strong> {{ mail.senderEmail }}<span>{{ mail.time }}</span></p>

          <section class="brief" :class="{ pending: !mail.summary }">
            <header>
              <span><Icon name="sparkles" :size="15" />三句摘要</span>
              <button v-if="mail.summary" class="link" type="button" :disabled="!!state.aiBusy || !ai" @click="rewriteMail('summarize', mail)">
                {{ busy('summarize') ? '正在生成…' : '用 DeepSeek 重写' }}
              </button>
            </header>
            <ol v-if="mail.summary"><li v-for="line in mail.summary" :key="line">{{ line }}</li></ol>
            <div v-else class="brief-empty">
              <p v-if="ai">还没有摘要。生成时会把这封邮件发给 DeepSeek。</p>
              <p v-else>配置 DeepSeek 后可以生成中文摘要和翻译。</p>
              <button v-if="ai" class="btn ghost" type="button" :disabled="!!state.aiBusy" @click="rewriteMail('summarize', mail)">
                <Icon name="sparkles" :size="16" />{{ busy('summarize') ? '正在生成…' : '生成中文摘要' }}
              </button>
              <button v-else class="btn ghost" type="button" @click="open('deepseek')">配置 DeepSeek</button>
            </div>
          </section>

          <p v-if="ib.showTranslation && !mail.translation" class="translate-hint">
            <span>这封邮件还没有中文翻译，下面是原文。</span>
            <button v-if="ai" class="link" type="button" :disabled="!!state.aiBusy" @click="rewriteMail('translate', mail)">
              {{ busy('translate') ? '正在翻译…' : '翻译成中文' }}
            </button>
          </p>

          <div class="reader-text">
            <p v-for="(p, i) in body(mail)" :key="i">{{ p }}</p>
          </div>

          <footer class="reader-foot">
            <button v-if="mail.assignment || !mail.live" class="btn primary" type="button" @click="primary(mail)">{{ mail.assignment && mail.live ? '查看相关作业' : mail.action }}</button>
            <a v-if="mail.link" class="btn" :class="mail.assignment ? 'ghost' : 'primary'" :href="mail.link" target="_blank" rel="noreferrer">
              <Icon name="external" :size="16" />{{ linkLabel(mail) }}</a>
            <button v-if="mail.summary" class="btn ghost" type="button" @click="copySummary(mail)"><Icon name="file" :size="16" />复制摘要</button>
            <button v-if="ai && mail.translation" class="btn ghost" type="button" :disabled="!!state.aiBusy" @click="rewriteMail('translate', mail)">
              <Icon name="translate" :size="16" />{{ busy('translate') ? '正在翻译…' : '重新翻译' }}
            </button>
          </footer>
        </article>
      </div>
    </div>`
};
