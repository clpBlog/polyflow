import { computed, onMounted, onBeforeUnmount, watch } from "vue";
import Icon from "./components/Icon.js";
import Overlays from "./components/Overlays.js";
import HomeView from "./views/HomeView.js";
import AssignmentsView from "./views/AssignmentsView.js";
import MaterialsView from "./views/MaterialsView.js";
import InboxView from "./views/InboxView.js";
import SettingsView from "./views/SettingsView.js";
import { state, go, open, close, toast, upcoming, unreadCount, isLive, needsLogin, dismissDemo, syncCanvas } from "./store.js";
import { fmt } from "./utils.js";

const VIEWS = { home: HomeView, assignments: AssignmentsView, materials: MaterialsView, inbox: InboxView, settings: SettingsView };

export default {
  components: { Icon, Overlays },
  setup() {
    const nav = computed(() => [
      { route: "home", label: "今日", icon: "home" },
      { route: "assignments", label: "作业", icon: "task", count: upcoming.value.length },
      { route: "materials", label: "资料", icon: "book" },
      { route: "inbox", label: "邮件", icon: "mail", count: unreadCount.value, accent: true }
    ]);
    const view = computed(() => VIEWS[state.route] || HomeView);
    const initial = computed(() => [...(state.profile.displayName || "同")][0]);
    const syncLine = computed(() => {
      if (!state.integration.reachable && !state.integration.loading) return { tone: "warn", text: "本地服务未运行", sub: "数据为演示" };
      if (!isLive.value) return { tone: "", text: "演示数据", sub: "未连接 Canvas" };
      if (state.canvasSync.busy) return { tone: "busy", text: "正在同步", sub: "Canvas" };
      if (needsLogin.value) return { tone: "warn", text: "Canvas 登录已过期", sub: "点击重新登录" };
      if (state.canvasSync.error) return { tone: "warn", text: "同步失败", sub: "点击重试" };
      return { tone: "ok", text: "Canvas 已连接", sub: state.canvasSync.lastSync ? `${fmt.time.format(new Date(state.canvasSync.lastSync))} 同步` : "等待同步" };
    });
    const isDark = computed(() =>
      state.theme === "dark" || (state.theme === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches)
    );

    function onKey(e) {
      const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open("search");
      } else if (e.key === "Escape") {
        if (state.overlay) close();
        state.profileMenu = false;
        state.menuOpen = false;
      } else if (e.key === "/" && !typing && !state.overlay) {
        e.preventDefault();
        open("search");
      }
    }
    onMounted(() => document.addEventListener("keydown", onKey));
    onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
    watch(() => state.overlay, (o) => document.body.classList.toggle("locked", Boolean(o)));

    let installPrompt = null;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      installPrompt = e;
    });
    async function install() {
      state.profileMenu = false;
      if (installPrompt) {
        installPrompt.prompt();
        installPrompt = null;
        return;
      }
      toast(/iPhone|iPad/i.test(navigator.userAgent) ? "在 Safari 点分享，再选“添加到主屏幕”" : "在浏览器菜单里选择“安装应用”");
    }

    return {
      state, nav, view, initial, syncLine, isDark, isLive, go, open, toast, dismissDemo, install, unreadCount,
      toggleTheme: () => (state.theme = isDark.value ? "light" : "dark"),
      bell: () => toast(unreadCount.value ? `${unreadCount.value} 封未读邮件` : "没有新通知"),
      syncClick: () => (needsLogin.value ? open("canvas") : state.canvasSync.error ? syncCanvas({ force: true }) : go("settings"))
    };
  },
  template: /* html */ `
    <a class="skip" href="#main">跳到主要内容</a>
    <div class="shell" :class="{ 'menu-open': state.menuOpen }">
      <aside class="side" aria-label="主导航">
        <a class="brand" href="#home" @click.prevent="go('home')">
          <img src="./assets/polyu-logo.png" alt="" width="34" height="34" />
          <span><strong>{{ state.app.name }}</strong><small>学习工作台</small></span>
        </a>
        <nav class="side-nav">
          <a v-for="n in nav" :key="n.route" :href="'#' + n.route" class="nav-item" :class="{ on: state.route === n.route }"
            :aria-current="state.route === n.route ? 'page' : null" @click.prevent="go(n.route)">
            <Icon :name="n.icon" /><span>{{ n.label }}</span>
            <em v-if="n.count" class="nav-count" :class="{ accent: n.accent }">{{ n.count }}</em>
          </a>
          <button class="nav-item" type="button" @click="open('calendar')"><Icon name="calendar" /><span>日历</span></button>
          <a href="#settings" class="nav-item" :class="{ on: state.route === 'settings' }" @click.prevent="go('settings')">
            <Icon name="settings" /><span>连接与设置</span>
          </a>
        </nav>
        <div class="side-foot">
          <button class="sync-line" type="button" :class="syncLine.tone" @click="syncClick()">
            <i></i><span><strong>{{ syncLine.text }}</strong><small>{{ syncLine.sub }}</small></span>
          </button>
        </div>
      </aside>
      <button class="side-scrim" type="button" aria-label="关闭菜单" @click="state.menuOpen = false"></button>

      <div class="main">
        <header class="top">
          <button class="icon-btn only-mobile" type="button" aria-label="打开菜单" @click="state.menuOpen = true"><Icon name="menu" /></button>
          <a class="brand only-mobile" href="#home" @click.prevent="go('home')"><img src="./assets/polyu-logo.png" alt="" width="28" height="28" /><strong>{{ state.app.name }}</strong></a>
          <button class="search-btn" type="button" @click="open('search')">
            <Icon name="search" :size="16" /><span>搜索作业、课件、邮件</span><kbd>⌘K</kbd>
          </button>
          <div class="top-actions">
            <button class="icon-btn" type="button" :aria-label="isDark ? '切换到浅色' : '切换到深色'" @click="toggleTheme()"><Icon :name="isDark ? 'sun' : 'moon'" /></button>
            <button class="icon-btn bell" type="button" aria-label="通知" @click="bell()"><Icon name="bell" /><i v-if="unreadCount"></i></button>
            <div class="profile">
              <button class="avatar" type="button" aria-label="个人菜单" :aria-expanded="state.profileMenu" @click.stop="state.profileMenu = !state.profileMenu">{{ initial }}</button>
              <div v-if="state.profileMenu" class="menu" @click.stop>
                <div class="menu-head"><span class="avatar">{{ initial }}</span><span><strong>{{ state.profile.displayName }}</strong><small>{{ state.profile.subtitle }}</small></span></div>
                <button type="button" @click="install()"><Icon name="download" :size="16" />安装到主屏幕</button>
                <button type="button" @click="state.profileMenu = false; go('settings')"><Icon name="settings" :size="16" />连接与设置</button>
              </div>
            </div>
          </div>
        </header>

        <div v-if="!isLive && !state.demoDismissed" class="demo-note" role="status">
          <span>现在显示的是演示数据。连接 Canvas 后会换成你的真实作业和资料。</span>
          <button class="link" type="button" @click="open('canvas')">连接 Canvas</button>
          <button class="link quiet" type="button" @click="dismissDemo()">知道了</button>
        </div>

        <main id="main" tabindex="-1">
          <component :is="view" :key="state.route" />
        </main>
      </div>

      <nav class="tabbar" aria-label="主导航">
        <a v-for="n in nav" :key="n.route" :href="'#' + n.route" :class="{ on: state.route === n.route }" @click.prevent="go(n.route)">
          <span class="tab-icon"><Icon :name="n.icon" :size="20" /><em v-if="n.count && n.accent"></em></span>{{ n.label }}
        </a>
        <a href="#settings" :class="{ on: state.route === 'settings' }" @click.prevent="go('settings')"><span class="tab-icon"><Icon name="settings" :size="20" /></span>设置</a>
      </nav>
    </div>

    <Overlays />
    <div class="toast-region" aria-live="polite">
      <div v-if="state.toast" :key="state.toast.key" class="toast">{{ state.toast.message }}</div>
    </div>`
};
