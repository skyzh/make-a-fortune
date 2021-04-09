import { BannedError } from "./client"

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
