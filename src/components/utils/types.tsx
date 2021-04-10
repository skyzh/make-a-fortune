import { Floor } from "~src/client"

export type Callback = () => void
export type AsyncCallback = () => Promise<void>
export type RequestFloor = (f: string) => Promise<Floor | null>
