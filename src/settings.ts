import createPersistedState from "use-persisted-state"
export const useTokenState = createPersistedState("fortune-settings")
export const useRPCState = createPersistedState("fortune-rpc")
export const useFortuneSettings = createPersistedState<FortuneSettings>(
  "fortune-local-settings"
)

export class FortuneSettings {
  blockedKeywords: string[]
}
