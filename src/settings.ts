import createPersistedState from 'use-persisted-state';
export const useTokenState = createPersistedState('fortune-settings');
export const useRPCState = createPersistedState('fortune-rpc');
