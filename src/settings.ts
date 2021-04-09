import createPersistedState from "use-persisted-state"
export const useTokenState = createPersistedState("fortune-settings")
const _useRPCState = createPersistedState("fortune-rpc")

export function useRPCState() {
  const [rpc, setRpc] = _useRPCState()
  if (!rpc.endsWith("/")) {
    return [rpc + "/", setRpc]
  } else {
    return [rpc, setRpc]
  }
}
