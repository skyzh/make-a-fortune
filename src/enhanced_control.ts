import { remove, uniqBy } from "lodash"
import { Thread } from "./client"
import { FortuneHistoryItem, FortuneStarItem } from "./components/utils/types"
import { FORTUNE_HISTORY_KEY, FORTUNE_STAR_KEY } from "./settings"

export function addToHistory(thread: Thread) {
  let currentHistory: FortuneHistoryItem[] = JSON.parse(
    localStorage.getItem(FORTUNE_HISTORY_KEY) || "[]"
  )
  currentHistory.unshift({ thread, lastAccessed: new Date().toString() })
  currentHistory = uniqBy(currentHistory, (history) => history.thread.ThreadID)
  currentHistory = currentHistory.slice(0, 100) // only retain 100 entries
  localStorage.setItem(FORTUNE_HISTORY_KEY, JSON.stringify(currentHistory))
}

export function addToStar(thread: Thread) {
  let currentStar: FortuneStarItem[] = JSON.parse(
    localStorage.getItem(FORTUNE_STAR_KEY) || "[]"
  )
  currentStar.unshift({ thread, lastAccessed: new Date().toString() })
  currentStar = uniqBy(currentStar, (history) => history.thread.ThreadID)
  localStorage.setItem(FORTUNE_STAR_KEY, JSON.stringify(currentStar))
}

export function removeFromStar(threadId: string) {
  const currentStar: FortuneStarItem[] = JSON.parse(
    localStorage.getItem(FORTUNE_STAR_KEY) || "[]"
  )
  remove(currentStar, (item) => item.thread.ThreadID === threadId)
  localStorage.setItem(FORTUNE_STAR_KEY, JSON.stringify(currentStar))
}
