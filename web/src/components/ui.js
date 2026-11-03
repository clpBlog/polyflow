import Icon from "./Icon.js";
import { courseColor } from "../utils.js";

export const CourseTag = {
  props: { course: String, code: String },
  setup(props) {
    return { color: () => courseColor(props.course) };
  },
  template: /* html */ `
    <span class="course-tag" :style="{ '--course': color() }">
      <i aria-hidden="true"></i>{{ code || course }}
    </span>`
};

export const Toggle = {
  props: { modelValue: Boolean, label: String },
  emits: ["update:modelValue"],
  template: /* html */ `
    <button type="button" class="toggle" role="switch" :aria-checked="modelValue" :aria-label="label"
      @click="$emit('update:modelValue', !modelValue)"><span></span></button>`
};

export const Segmented = {
  props: { modelValue: [String, Boolean], options: Array, label: String },
  emits: ["update:modelValue"],
  template: /* html */ `
    <div class="segmented" role="tablist" :aria-label="label">
      <button v-for="o in options" :key="String(o.value)" type="button" role="tab"
        :aria-selected="modelValue === o.value" :class="{ on: modelValue === o.value }"
        @click="$emit('update:modelValue', o.value)">
        {{ o.label }}<span v-if="o.count !== undefined" class="seg-count">{{ o.count }}</span>
      </button>
    </div>`
};

export const Empty = {
  components: { Icon },
  props: { icon: { type: String, default: "check" }, title: String, text: String },
  template: /* html */ `
    <div class="empty">
      <span class="empty-icon"><Icon :name="icon" :size="22" /></span>
      <strong>{{ title }}</strong>
      <p v-if="text">{{ text }}</p>
      <slot />
    </div>`
};

export const PageHead = {
  props: { title: String, lede: String },
  template: /* html */ `
    <header class="page-head">
      <div>
        <h1>{{ title }}</h1>
        <p v-if="lede" class="lede">{{ lede }}</p>
        <slot name="meta" />
      </div>
      <div class="page-head-actions"><slot /></div>
    </header>`
};
