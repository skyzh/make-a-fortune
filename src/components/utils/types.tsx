import { Floor, Thread } from "~src/client"

export type Callback = () => void
export type AsyncCallback = () => Promise<void>
export type RequestFloor = (f: string) => Promise<Floor | null>
export interface FortuneHistoryItem {
  thread: Thread
  lastAccessed: string
}

export interface FortuneStarItem {
  thread: Thread
  lastAccessed: string
}
