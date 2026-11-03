import { computed, ref } from "vue";
import Icon from "../components/Icon.js";
import MaterialCard from "../components/MaterialCard.js";
import { PageHead, Empty } from "../components/ui.js";
import { state, isLive, syncCanvas } from "../store.js";
import { courseColor } from "../utils.js";

export default {
  components: { Icon, MaterialCard, PageHead, Empty },
  setup() {
    const course = ref("all");
    const savedOnly = ref(false);
    const courses = computed(() => {
      const counts = new Map();
      for (const m of state.materials) counts.set(m.course, (counts.get(m.course) || 0) + 1);
      return [...counts].map(([name, count]) => ({ name, count }));
    });
    const list = computed(() =>
      state.materials.filter((m) => (course.value === "all" || m.course === course.value) && (!savedOnly.value || state.saved.has(m.id)))
    );
    return { state, course, savedOnly, courses, list, isLive, syncCanvas, courseColor };
  },
  template: /* html */ `
    <div class="page">
      <PageHead title="课程资料" :lede="state.materials.length + ' 份资料，' + state.saved.size + ' 份已收藏'">
        <button class="btn ghost" type="button" :disabled="state.canvasSync.busy" @click="syncCanvas({ force: true })">
          <Icon name="refresh" :size="16" :class="{ spin: state.canvasSync.busy }" />{{ isLive ? '刷新资料' : '连接 Canvas' }}
        </button>
      </PageHead>

      <div class="chips" role="tablist" aria-label="按课程筛选">
        <button type="button" class="chip" :class="{ on: course === 'all' }" @click="course = 'all'">全部课程</button>
        <button v-for="c in courses" :key="c.name" type="button" class="chip" :class="{ on: course === c.name }"
          :style="{ '--course': courseColor(c.name) }" @click="course = c.name">
          <i aria-hidden="true"></i>{{ c.name }}<span>{{ c.count }}</span>
        </button>
        <button type="button" class="chip saved" :class="{ on: savedOnly }" :aria-pressed="savedOnly" @click="savedOnly = !savedOnly">
          <Icon name="bookmark" :size="14" />只看收藏
        </button>
      </div>

      <div v-if="list.length" class="mgrid wide"><MaterialCard v-for="m in list" :key="m.id" :m="m" /></div>
      <Empty v-else icon="book" :title="savedOnly ? '这里还没有收藏的资料' : '这门课暂时没有资料'"
        :text="savedOnly ? '点资料卡右上角的书签即可收藏。' : '同步 Canvas 后，课程模块里的资料会出现在这里。'" />
    </div>`
};
