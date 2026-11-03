import { computed } from "vue";
import Icon from "../components/Icon.js";
import DeadlineRail from "../components/DeadlineRail.js";
import AssignmentRow from "../components/AssignmentRow.js";
import MaterialCard from "../components/MaterialCard.js";
import { CourseTag, Empty } from "../components/ui.js";
import { state, upcoming, pending, unreadCount, open, openMail, go } from "../store.js";
import { greeting, fmt, countdown, dateTime, daysUntil, dayKey, courseColor } from "../utils.js";

export default {
  components: { Icon, DeadlineRail, AssignmentRow, MaterialCard, CourseTag, Empty },
  setup() {
    const focus = computed(() => upcoming.value[0] || pending.value[0]);
    const next = computed(() => upcoming.value.filter((a) => a.id !== focus.value?.id).slice(0, 4));
    const weekCount = computed(() => upcoming.value.filter((a) => daysUntil(a.due) <= 7).length);
    const today = computed(() => {
      const key = dayKey(new Date());
      return state.events.filter((e) => e.date === key);
    });
    const unread = computed(() => state.mails.filter((m) => m.unread).slice(0, 3));
    const materials = computed(() =>
      [...state.materials].sort((a, b) => Number(state.saved.has(b.id)) - Number(state.saved.has(a.id))).slice(0, 4)
    );
    return {
      state, focus, next, weekCount, today, unread, unreadCount, materials, open, openMail, go, courseColor, dateTime,
      hello: () => `${greeting()}，${state.profile.displayName}`,
      dateText: () => fmt.full.format(new Date()),
      cd: () => countdown(focus.value?.due)
    };
  },
  template: /* html */ `
    <div class="page home">
      <section class="hero">
        <p class="hero-date">{{ dateText() }}</p>
        <h1>{{ hello() }}</h1>
        <p class="hero-summary">
          <template v-if="focus">
            未来 7 天有 <b>{{ weekCount }}</b> 项要交。最近的是
            <button type="button" class="inline-link" @click="open('assignment', focus.id)">{{ focus.title }}</button>，
            <span class="mark">{{ cd()?.overdue ? '已经过了截止时间' : '还剩 ' + cd()?.text }}</span>。
          </template>
          <template v-else>近期没有要交的作业。</template>
          <template v-if="unreadCount"> 另有 {{ unreadCount }} 封未读邮件，中文摘要已经整理好。</template>
        </p>
      </section>

      <DeadlineRail />

      <div class="home-grid">
        <section class="focus" v-if="focus" :style="{ '--course': courseColor(focus.course) }">
          <header class="section-head">
            <h2>先做这一件</h2>
            <button class="link" type="button" @click="go('assignments')">全部作业</button>
          </header>
          <div class="focus-card">
            <CourseTag :course="focus.course" :code="focus.code" />
            <h3>{{ focus.title }}</h3>
            <p class="focus-summary">{{ focus.summary }}</p>
            <ul v-if="focus.requirements?.length" class="focus-reqs">
              <li v-for="r in focus.requirements.slice(0, 3)" :key="r">{{ r }}</li>
            </ul>
            <div class="focus-foot">
              <div class="focus-due">
                <strong>{{ cd()?.overdue ? '已逾期' : cd()?.text }}</strong>
                <span>{{ dateTime(focus.due) }} 截止，{{ focus.points }}</span>
              </div>
              <button class="btn primary" type="button" @click="open('assignment', focus.id)">查看要求</button>
            </div>
          </div>

          <div v-if="next.length" class="next-list">
            <h3 class="minor">之后</h3>
            <AssignmentRow v-for="a in next" :key="a.id" :a="a" />
          </div>
        </section>
        <section v-else class="focus">
          <Empty icon="check" title="作业都处理完了" text="可以去看看课程资料，或者提前准备下周的阅读。" />
        </section>

        <aside class="today-col">
          <section>
            <header class="section-head">
              <h2>今天</h2>
              <button class="link" type="button" @click="open('calendar')">日历</button>
            </header>
            <p v-if="!today.length" class="muted">今天没有课程或会议。</p>
            <ol class="agenda">
              <li v-for="e in today" :key="e.id" :style="{ '--course': courseColor(e.course) }">
                <button type="button" @click="e.assignment ? open('assignment', e.assignment) : open('calendar')">
                  <span class="agenda-time">{{ e.time }}<small>{{ e.end }}</small></span>
                  <span class="agenda-copy"><strong>{{ e.title }}</strong><small>{{ e.place }}</small></span>
                </button>
              </li>
            </ol>
          </section>

          <section>
            <header class="section-head">
              <h2>未读邮件</h2>
              <button class="link" type="button" @click="go('inbox')">收件箱</button>
            </header>
            <p v-if="!unread.length" class="muted">没有未读邮件。</p>
            <button v-for="m in unread" :key="m.id" type="button" class="mail-brief" @click="openMail(m.id)">
              <span class="mail-brief-top"><strong>{{ m.sender }}</strong><small>{{ m.time }}</small></span>
              <span class="mail-brief-subject">{{ m.subject }}</span>
              <span v-if="m.summary" class="mail-brief-ai"><Icon name="sparkles" :size="13" />{{ m.summary[0] }}</span>
              <span v-else class="mail-brief-preview">{{ m.preview }}</span>
            </button>
          </section>
        </aside>
      </div>

      <section class="continue">
        <header class="section-head">
          <h2>继续学习</h2>
          <button class="link" type="button" @click="go('materials')">全部资料</button>
        </header>
        <div class="mgrid">
          <MaterialCard v-for="m in materials" :key="m.id" :m="m" />
        </div>
      </section>
    </div>`
};
