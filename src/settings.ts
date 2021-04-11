import { cloneDeep } from "lodash"
import createPersistedState from "use-persisted-state"
import { Tag } from "./client"

export const FORTUNE_TOKEN_KEY = "fortune-settings"
export const useTokenState = createPersistedState(FORTUNE_TOKEN_KEY)
export const FORTUNE_RPC_KEY = "fortune-rpc"
export const useRPCState = createPersistedState(FORTUNE_RPC_KEY)
export const FORTUNE_LOCAL_SETTINGS_KEY = "fortune-local-settings"
const _useFortuneSettings = createPersistedState(FORTUNE_LOCAL_SETTINGS_KEY)
export const FORTUNE_HISTORY_KEY = "fortune-posts-history"
export const FORTUNE_STAR_KEY = "fortune-posts-star"

export interface EnhancedSettings {
  enableHistory: boolean
  enableStar: boolean
}
export interface FortuneSettings {
  blockedKeywords: string[]
  layout: LayoutStyle
  blockedTags: Tag[]
  obscureTag: boolean
  enhancedMode: EnhancedSettings
  notification: NotificationSettings
}

export interface NotificationSettings {
  enabled: boolean
  intervalMinutes: number
}

export enum LayoutStyle {
  comfortable = "comfortable",
  compact = "compact",
}

export interface LayoutStyleSettings {
  style: LayoutStyle
  cardPaddingX: number
  cardPaddingY: number
  cardSpacing: number
  controlMargin: number
  controlSpacing: number
  listSpacing: number
}

export function getLayoutStyleSettings(
  layout: LayoutStyle
): LayoutStyleSettings {
  switch (layout) {
    case LayoutStyle.comfortable: {
      return {
        style: layout,
        cardPaddingX: 5,
        cardPaddingY: 3,
        cardSpacing: 3,
        controlMargin: 3,
        controlSpacing: 1,
        listSpacing: 3,
      }
    }
    case LayoutStyle.compact: {
      return {
        style: layout,
        cardPaddingX: 3,
        cardPaddingY: 2,
        cardSpacing: 2,
        controlMargin: 1,
        controlSpacing: 1,
        listSpacing: 1,
      }
    }
  }
}

export function useFortuneSettings() {
  const [_settings, setSettings] = _useFortuneSettings<FortuneSettings>({
    blockedKeywords: [],
    blockedTags: [],
    layout: LayoutStyle.comfortable,
    obscureTag: false,
    enhancedMode: {
      enableHistory: false,
      enableStar: false,
    },
    notification: {
      enabled: false,
      intervalMinutes: 10,
    },
  })
  const settings = cloneDeep(_settings)
  if (settings.blockedKeywords === undefined) {
    settings.blockedKeywords = []
  }
  if (settings.layout === undefined) {
    settings.layout = LayoutStyle.comfortable
  }
  if (settings.blockedTags === undefined) {
    settings.blockedTags = []
  }
  if (settings.obscureTag === undefined) {
    settings.obscureTag = false
  }
  if (settings.enhancedMode === undefined) {
    settings.enhancedMode = {
      enableHistory: false,
      enableStar: false,
    }
  }
  if (settings.notification === undefined) {
    settings.notification = {
      enabled: false,
      intervalMinutes: 10,
    }
  }
  return [settings, setSettings] as const
}

export function useFortuneSettingsRead() {
  const [settings, _setSettings] = useFortuneSettings()
  return settings
}

export function useFortuneLayoutSettings() {
  const settings = useFortuneSettingsRead()
  return getLayoutStyleSettings(settings.layout)
}
