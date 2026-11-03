import Icon from "./Icon.js";
import { state, toggleSaved, openMaterial } from "../store.js";
import { courseColor } from "../utils.js";

const TYPE = {
  PDF: { label: "PDF", icon: "file" },
  FILE: { label: "文件", icon: "file" },
  VIDEO: { label: "视频", icon: "video" },
  READING: { label: "阅读", icon: "book" },
  PAGE: { label: "页面", icon: "book" },
  ZIP: { label: "压缩包", icon: "download" },
  SLIDES: { label: "幻灯片", icon: "file" },
  LINK: { label: "链接", icon: "link" },
  TOOL: { label: "工具", icon: "link" },
  TASK: { label: "作业", icon: "task" },
  QUIZ: { label: "测验", icon: "task" },
  DISCUSSION: { label: "讨论", icon: "mail" }
};

export default {
  components: { Icon },
  props: { m: { type: Object, required: true } },
  setup(props) {
    return {
      saved: () => state.saved.has(props.m.id),
      kind: () => TYPE[props.m.type] || { label: props.m.type || "资料", icon: "book" },
      color: () => courseColor(props.m.course),
      toggleSaved,
      openMaterial
    };
  },
  template: /* html */ `
    <article class="mcard" :style="{ '--course': color() }">
      <button class="mcard-open" type="button" @click="openMaterial(m)">
        <span class="mcard-kind"><Icon :name="kind().icon" :size="15" />{{ kind().label }}</span>
        <strong>{{ m.title }}</strong>
        <span class="mcard-course">{{ m.course }}</span>
        <span class="mcard-meta">{{ m.meta }}<template v-if="m.updated">，{{ m.updated }}</template></span>
      </button>
      <button class="mcard-save" type="button" :class="{ on: saved() }" :aria-pressed="saved()"
        :aria-label="saved() ? '取消收藏' : '收藏'" @click="toggleSaved(m.id)">
        <Icon name="bookmark" :size="16" />
      </button>
    </article>`
};
