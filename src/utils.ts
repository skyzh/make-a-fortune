import { every, filter } from "lodash"
import { BannedError, Thread } from "./client"
import { useFortuneSettings } from "./settings"

export function handleError(toast, title: string, err: Error) {
  if (err instanceof BannedError) {
    const bannedError = err as BannedError
    toast({
      title: "您已被封禁",
      description: `由于 “${bannedError.resp.Ban_Content}” ${bannedError.resp.Ban_Reason}`,
      status: "error",
      duration: 5000,
      isClosable: true,
    })
  } else {
    toast({
      title,
      description: `${err}`,
      status: "error",
      duration: 5000,
      isClosable: true,
    })
  }
}

export function getRpcDisplayName(rpc) {
  return rpc === "/"
    ? window.location.hostname
    : rpc?.replace("https://", "")?.replace("/", "")
}

export function parseThreadNotification(thread: Thread) {
  if (thread.Judge === 0) {
    if (thread.Type === 0) {
      return "有新回复"
    }
    if (thread.Type > 0) {
      return `新增 ${thread.Type} 个赞`
    }
  }
  if (thread.Judge === 1) {
    if (thread.Type === 0) {
      return "已读回复"
    }
    if (thread.Type > 0) {
      return `${thread.Type} 个人赞了`
    }
  }
  return null
}

export function useThreadFilter(threads) {
  const [settings, _setSettings] = useFortuneSettings()

  if (!threads) return threads
  if (!settings?.blockedKeywords) return threads

  return filter(threads, (thread: Thread) =>
    every(
      settings?.blockedKeywords,
      (keyword: string) =>
        !thread.Title.toLowerCase().includes(keyword.toLowerCase()) &&
        !thread.Summary.toLowerCase().includes(keyword.toLowerCase())
    )
  )
}
