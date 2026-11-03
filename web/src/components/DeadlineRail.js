import { computed } from "vue";
import { state, open, isAttendance, isResolved, isUrgent } from "../store.js";
import { addDays, dayKey, fromDayKey, fmt, courseColor, hkParts } from "../utils.js";

const SPAN = 14;

export default {
  setup() {
    const days = computed(() => {
      const today = dayKey(new Date());
      return Array.from({ length: SPAN }, (_, i) => {
        const key = addDays(today, i);
        const date = fromDayKey(key);
        const { d, wd } = hkParts(date);
        const items = state.assignments
          .filter((a) => a.due && !isAttendance(a) && dayKey(a.due) === key)
          .sort((a, b) => new Date(a.due) - new Date(b.due));
        const events = state.events.filter((e) => e.date === key);
        return {
          key,
          d,
          wd: i === 0 ? "今天" : i === 1 ? "明天" : fmt.weekday.format(date),
          weekend: wd === 0 || wd === 6,
          today: i === 0,
          monthStart: d === 1 && i > 0,
          month: fmt.short.format(date).split("/")[0],
          items,
          events
        };
      });
    });
    const later = computed(() => {
      const last = addDays(dayKey(new Date()), SPAN - 1);
      return state.assignments.filter((a) => a.due && !isAttendance(a) && !isResolved(a) && dayKey(a.due) > last).length;
    });
    return { days, later, open, isResolved, isUrgent, courseColor, time: (iso) => fmt.time.format(new Date(iso)) };
  },
  template: /* html */ `
    <section class="rail" aria-label="未来两周截止时间">
      <div class="rail-track">
        <div v-for="day in days" :key="day.key" class="rail-day"
          :class="{ today: day.today, weekend: day.weekend, 'month-start': day.monthStart }">
          <div class="rail-date">
            <span>{{ day.wd }}</span>
            <strong>{{ day.d }}</strong>
            <em v-if="day.monthStart">{{ day.month }}月</em>
          </div>
          <div class="rail-events" v-if="day.events.length" :title="day.events.map(e => e.time + ' ' + e.title).join('\\n')">
            <i v-for="e in day.events" :key="e.id" :style="{ background: courseColor(e.course) }"></i>
          </div>
          <div class="rail-pins">
            <button v-for="a in day.items" :key="a.id" type="button" class="pin"
              :class="{ resolved: isResolved(a), hot: isUrgent(a) }"
              :style="{ '--course': courseColor(a.course) }" @click="open('assignment', a.id)">
              <span class="pin-time">{{ time(a.due) }}</span>
              <span class="pin-title">{{ a.title }}</span>
            </button>
          </div>
        </div>
      </div>
      <p v-if="later" class="rail-later">两周之后还有 {{ later }} 项</p>
    </section>`
};
