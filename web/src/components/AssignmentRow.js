import Icon from "./Icon.js";
import { CourseTag } from "./ui.js";
import { open, toggleComplete, isComplete, isSubmitted, isUrgent, statusOf } from "../store.js";
import { dueLabel, fmt, dateTime, daysUntil } from "../utils.js";

export default {
  components: { Icon, CourseTag },
  props: { a: { type: Object, required: true }, compact: Boolean },
  setup(props) {
    const date = () => (props.a.due ? new Date(props.a.due) : null);
    return {
      open,
      toggleComplete,
      done: () => isComplete(props.a) || isSubmitted(props.a),
      submitted: () => isSubmitted(props.a),
      urgent: () => isUrgent(props.a),
      overdue: () => props.a.due && daysUntil(props.a.due) < 0 && !statusOf(props.a),
      status: () => statusOf(props.a),
      day: () => (date() ? fmt.short.format(date()).split("/")[1] : "—"),
      month: () => (date() ? `${fmt.short.format(date()).split("/")[0]}月` : "待定"),
      weekday: () => (date() ? fmt.weekday.format(date()) : ""),
      time: () => (date() ? fmt.time.format(date()) : ""),
      dueLabel,
      dateTime
    };
  },
  template: /* html */ `
    <article class="arow" :class="{ done: done(), urgent: urgent(), compact }">
      <button v-if="!submitted()" class="check" type="button" :aria-pressed="done()"
        :aria-label="done() ? '标记为未完成' : '标记为完成'" @click.stop="toggleComplete(a.id)">
        <Icon name="check" :size="14" />
      </button>
      <span v-else class="check locked" title="Canvas 已记录提交"><Icon name="check" :size="14" /></span>

      <button class="arow-body" type="button" @click="open('assignment', a.id)">
        <span v-if="!compact" class="datechip" aria-hidden="true">
          <small>{{ month() }}</small><strong>{{ day() }}</strong><small>{{ weekday() }}</small>
        </span>
        <span class="arow-main">
          <CourseTag :course="a.course" :code="a.code" />
          <strong class="arow-title">{{ a.title }}</strong>
          <span v-if="!compact" class="arow-sub">{{ a.summary }}</span>
        </span>
        <span class="arow-side">
          <span v-if="status()" class="state ok"><Icon name="check" :size="12" />{{ status() }}</span>
          <span v-else-if="a.due" class="state" :class="{ mark: urgent(), late: overdue() }">{{ dueLabel(a.due) }}</span>
          <span v-else class="state">无截止时间</span>
          <small>{{ submitted() && a.submittedAt ? '提交于 ' + dateTime(a.submittedAt) : (time() ? time() + '，' : '') + a.points }}</small>
        </span>
      </button>
    </article>`
};
