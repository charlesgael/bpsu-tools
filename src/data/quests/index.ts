import { asCollection, warnExceptions } from '../utils'
import rawQuests from './quests.yaml'

export interface Quest {
  id: string
  freq: 'daily' | 'weekly'
  days?: number[]
}

function parseQuest(rawQuest: unknown): Quest {
  if (typeof rawQuest !== 'object' || rawQuest === null)
    throw new Error('quest is not object')

  const {
    id,
    freq = 'daily',
    days,
  } = rawQuest as any

  if (typeof id !== 'string')
    throw new Error('quest has no id')
  if (freq && !['daily', 'weekly'].includes(freq))
    throw new Error('freq is invalid')
  if (days && (!Array.isArray(days) || days.some(it => it < 0 || it > 6)))
    throw new Error('days is invalid')

  return {
    id,
    freq,
    days,
  }
}

const dow = new Date().getDay()

export const quests = asCollection(rawQuests)
  .map(warnExceptions(parseQuest, 'quest'))
  .filter((it: Quest | null) => it !== null)

export const dailies = quests
  .filter(it => it.freq === 'daily')
  .filter(it => !it.days || it.days.includes(dow))

export const weeklies = quests
  .filter(it => it.freq === 'weekly')
