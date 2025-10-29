<script setup lang="ts">
import type { Tasks } from '~/stores/dailies'
import dayjs from 'dayjs'

interface Props {
  dailies: { [K: string]: Tasks }
  weeklies: { [K: string]: Tasks }
}

const {
  dailies,
  weeklies,
} = defineProps<Props>()

const weeks = computed(() => {
  const dates = [...Object.keys(dailies), ...Object.keys(weeklies)].map(it => +it).toSorted()
  const start = Math.max(dayjs(dates[0]).startOf('week').valueOf(), dayjs().subtract(100, 'week').startOf('week').valueOf())
  const end = dayjs().startOf('week').valueOf()
  const weeks = []
  for (let i = start.valueOf(); i <= end; i = dayjs(i).add(1, 'week').valueOf()) {
    const tasks = weeklies[i]
    weeks.push({
      time: i,
      tasks,
      percent: tasks ? Math.round(Object.entries<boolean>(tasks).filter(([,done]) => done).length / Object.keys(tasks).length * 10) : 0,
      starred: tasks ? Object.entries<boolean>(tasks).every(([,done]) => done) : false,
      days: [0, 1, 2, 3, 4, 5, 6]
        .map(it => dayjs(i).add(it, 'days').valueOf())
        .map(it => ({ time: it, dailies: dailies[it] }))
        .map(({ time, dailies: it }) => ({
          time,
          done: it?.done,
          undone: it?.undone,
          percent: it ? Math.round(Object.entries<boolean>(it).filter(([,done]) => done).length / Object.keys(it).length * 10) : undefined,
          starred: it ? Object.entries<boolean>(it).every(([,done]) => done) : false,
        })),
    })
  }
  return weeks
})
</script>

<template>
  <div class="relative h-45 overflow-hidden border rounded">
    <div v-for="week in weeks" :key="week.time" class="absolute bottom-0 right-0 top-0 flex gap-1 p-2">
      <div class="week">
        <div class="bilan">
          <div class="slot bg-gray"></div>
          <div v-if="week" class="slot" :class="`cal-progress-${week.percent}`"></div>
          <material-symbols:star-rounded v-if="week?.starred" class="slot color-white rotate-0!" />
        </div>
        <div v-for="day in week.days" :key="day.time" class="day">
          <span style="display:none">{{ day.time }}{{ JSON.stringify(day) }}</span>
          <div class="slot bg-gray"></div>
          <div v-if="day" class="slot" :class="`cal-progress-${day.percent}`"></div>
          <material-symbols:star-rounded v-if="day?.starred" class="slot color-white" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.week {
  @apply grid gap-1;
  grid-template-rows: 20px repeat(7, 16px);
  width: 16px;

  .bilan,
  .day {
    @apply relative;
    width: 16px;
    height: 16px;
  }

  .bilan {
    height: 20px;
  }

  .slot {
    @apply bg-op-40 absolute top-50% left-50% -translate-50%;
    width: 16px;
    height: 16px;
  }

  .bilan .slot {
    @apply rotate-45;
    width: 12px;
    height: 12px;
  }
}

.cal-progress-0 {
  background: rgb(244 67 54);
}
.cal-progress-1 {
  background: rgb(227 78 57);
}
.cal-progress-2 {
  background: rgb(210 89 59);
}
.cal-progress-3 {
  background: rgb(194 99 62);
}
.cal-progress-4 {
  background: rgb(177 110 64);
}
.cal-progress-5 {
  background: rgb(160 121 67);
}
.cal-progress-6 {
  background: rgb(143 132 70);
}
.cal-progress-7 {
  background: rgb(126 143 72);
}
.cal-progress-8 {
  background: rgb(110 153 75);
}
.cal-progress-9 {
  background: rgb(93 164 77);
}
.cal-progress-10 {
  background: rgb(76 175 80);
}
</style>
