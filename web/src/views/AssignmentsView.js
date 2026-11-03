import { computed, ref } from "vue";
import Icon from "../components/Icon.js";
import AssignmentRow from "../components/AssignmentRow.js";
import { PageHead, Segmented, Empty, CourseTag } from "../components/ui.js";
import { state, pending, undated, isResolved, isAttendance, isLive, needsLogin, syncCanvas, open } from "../store.js";
import { daysUntil, fmt } from "../utils.js";

export default {
  components: { Icon, AssignmentRow, PageHead, Segmented, Empty, CourseTag },
  setup() {
    const filter = ref("actionable");
    const query = ref("");
    const match = (a) => {
      const q = query.value.trim().toLowerCase();
      return !q || `${a.title} ${a.titleEn} ${a.course} ${a.code}`.toLowerCase().includes(q);
    };
    const list = computed(() => pending.value.filter(match));
    const done = computed(() => state.assignments.filter((a) => isResolved(a) && !isAttendance(a) && match(a)).sort((a, b) => new Date(b.due) - new Date(a.due)));
    const attendance = computed(() => state.assignments.filter((a) => isAttendance(a) && match(a)));

    const groups = computed(() => {
      if (filter.value === "completed") return [{ key: "done", title: "已提交或已完成", items: done.value }];
      if (filter.value === "attendance") return [];
      const items = filter.value === "week" ? list.value.filter((a) => daysUntil(a.due) >= 0 && daysUntil(a.due) <= 7) : list.value;
      const buckets = [
        { key: "late", title: "已逾期", test: (d) => d < 0 },
        { key: "today", title: "今天", test: (d) => d === 0 },
        { key: "tomorrow", title: "明天", test: (d) => d === 1 },
        { key: "week", title: "本周内", test: (d) => d > 1 && d <= 7 },
        { key: "later", title: "之后", test: (d) => d > 7 }
      ].map((b) => ({ ...b, items: items.filter((a) => b.test(daysUntil(a.due))) }));
      const out = buckets.filter((b) => b.items.length);
      if (filter.value === "all") {
        const u = undated.value.filter(match);
        if (u.length) out.push({ key: "undated", title: "无截止时间", items: u });
        if (done.value.length) out.push({ key: "done", title: "已提交或已完成", items: done.value });
      }
      return out;
    });

    const syncText = computed(() => {
      if (!isLive.value) return "演示数据，还没有连接 Canvas";
      if (state.canvasSync.busy) return "正在同步 Canvas…";
      if (needsLogin.value) return `Canvas 登录已过期，${state.canvasSync.lastSync ? "下面是上次同步的数据" : "暂时显示演示数据"}。请到“连接与设置”重新登录。`;
      if (state.canvasSync.error) return `同步失败：${state.canvasSync.error}`;
      if (state.canvasSync.lastSync) return `${fmt.time.format(new Date(state.canvasSync.lastSync))} 从 Canvas 同步`;
      return "等待首次同步";
    });

    const options = computed(() => [
      { value: "actionable", label: "需处理", count: list.value.length },
      { value: "week", label: "未来 7 天" },
      { value: "all", label: "全部" },
      { value: "completed", label: "已完成", count: done.value.length },
      { value: "attendance", label: "出席", count: attendance.value.length }
    ]);

    return { state, filter, query, groups, attendance, options, syncText, isLive, syncCanvas, open, weekLabel: (t) => t.match(/Week\s*\d+/i)?.[0] || "课堂记录" };
  },
  template: /* html */ `
    <div class="page">
      <PageHead title="作业与测验" :lede="syncText">
        <button class="btn" :class="isLive ? 'ghost' : 'primary'" type="button" :disabled="state.canvasSync.busy" @click="syncCanvas({ force: true })">
          <Icon name="refresh" :size="16" :class="{ spin: state.canvasSync.busy }" />{{ isLive ? (state.canvasSync.busy ? '同步中' : '同步 Canvas') : '连接 Canvas' }}
        </button>
      </PageHead>

      <div class="toolbar">
        <Segmented v-model="filter" :options="options" label="筛选作业" />
        <label class="search-field">
          <Icon name="search" :size="16" />
          <input v-model="query" type="search" placeholder="搜索作业或课程" aria-label="搜索作业" />
        </label>
      </div>

      <template v-if="filter !== 'attendance'">
        <section v-for="g in groups" :key="g.key" class="group" :class="'group-' + g.key">
          <h2 class="group-title">{{ g.title }}<span>{{ g.items.length }}</span></h2>
          <div class="rows"><AssignmentRow v-for="a in g.items" :key="a.id" :a="a" /></div>
        </section>
        <Empty v-if="!groups.length" icon="task" :title="query ? '没有找到匹配的作业' : '这里没有要处理的作业'"
          :text="query ? '换个关键词，或切换到“全部”。' : '切换到“全部”可以看到已完成和无截止时间的作业。'" />
      </template>

      <template v-else>
        <p class="muted group-note">课堂出席由 Canvas 自动记录，不算作待办。</p>
        <div class="rows">
          <button v-for="a in attendance" :key="a.id" type="button" class="attend" @click="open('assignment', a.id)">
            <CourseTag :course="a.course" :code="a.code" />
            <strong>{{ weekLabel(a.title) }}</strong>
            <span class="state ok"><Icon name="check" :size="12" />{{ a.submissionState === 'graded' ? '已记录' : '已同步' }}</span>
          </button>
        </div>
        <Empty v-if="!attendance.length" icon="calendar" title="还没有出席记录" />
      </template>
    </div>`
};
