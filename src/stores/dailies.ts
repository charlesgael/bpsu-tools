import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { dailies as rawDailies, weeklies as rawWeeklies } from '~/data/quests'

export interface Tasks {
  [K: string]: boolean
}

export const useDailiesStore = defineStore('Dailies', () => {
  const dbDaily = ref<{ [K: string]: Tasks }>({})
  const dbWeekly = ref<{ [K: string]: Tasks }>({})

  const thisDay = String(dayjs().startOf('day').valueOf())
  const thisWeek = String(dayjs().startOf('week').valueOf())

  const dailies = computed(() => {
    if (!dbDaily.value[thisDay]) {
      const tasks = Object.fromEntries(rawDailies.map(it => [it.id, false]))
      dbDaily.value[thisDay] = tasks
    }

    return dbDaily.value[thisDay]
  })
  const weeklies = computed(() => {
    if (!dbWeekly.value[thisWeek]) {
      const tasks = Object.fromEntries(rawWeeklies.map(it => [it.id, false]))
      dbWeekly.value[thisWeek] = tasks
    }

    return dbWeekly.value[thisWeek]
  })

  function toggleDaily(id: string) {
    if (typeof dbDaily.value[thisDay]?.[id] === 'boolean') {
      dbDaily.value[thisDay][id] = !dbDaily.value[thisDay][id]
    }
  }

  function toggleWeekly(id: string) {
    if (typeof dbWeekly.value[thisWeek]?.[id] === 'boolean') {
      dbWeekly.value[thisWeek][id] = !dbWeekly.value[thisWeek][id]
    }
  }

  return {
    dbDaily,
    dbWeekly,
    dailies,
    weeklies,
    toggleDaily,
    toggleWeekly,
  }
}, {
  persist: {
    pick: ['dbDaily', 'dbWeekly'],
  },
})

// I dont want to loose history
// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useDailiesStore as any, import.meta.hot))
