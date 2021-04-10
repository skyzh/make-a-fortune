import { cloneDeep } from "lodash"
import createPersistedState from "use-persisted-state"

export const useTokenState = createPersistedState("fortune-settings")
export const useRPCState = createPersistedState("fortune-rpc")
const _useFortuneSettings = createPersistedState<FortuneSettings>(
  "fortune-local-settings"
)

export class FortuneSettings {
  blockedKeywords: string[]
  layout: LayoutStyle
}

export enum LayoutStyle {
  comfortable = "comfortable",
  compact = "compact",
}

export class LayoutStyleSettings {
  style: LayoutStyle
  cardPaddingX: number
  cardPaddingY: number
  cardSpacing: number
  controlMargin: number
  controlSpacing: number
  listSpacing: number
}

function getLayoutStyleSettings(layout: LayoutStyle): LayoutStyleSettings {
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
  const [_settings, setSettings] = _useFortuneSettings<FortuneSettings>({})
  const settings = cloneDeep(_settings)
  if (!settings.blockedKeywords) {
    settings.blockedKeywords = []
  }
  if (!settings.layout) {
    settings.layout = "comfortable"
  }
  return [settings as FortuneSettings, setSettings]
}

export function useFortuneSettingsRead() {
  const [settings, _setSettings] = useFortuneSettings()
  return settings
}

export function useFortuneLayoutSettings() {
  const settings = useFortuneSettingsRead()
  return getLayoutStyleSettings(settings.layout)
}
