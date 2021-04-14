import { Badge, Box } from "@chakra-ui/react"
import React from "react"

declare var process: {
  env: {
    NODE_ENV: string
  }
}

export default function DevBadge() {
  let devSite = null
  if (process.env.NODE_ENV === "development") {
    devSite = "开发模式"
  }
  if (
    window.location.hostname.endsWith("vercel.app") &&
    window.location.hostname !== "make-a-fortune.vercel.app"
  ) {
    devSite = "Vercel Review App"
  }
  return devSite ? (
    <Box mt={-3} mb={3}>
      <Badge variant="outline" fontSize="md" colorScheme="blue">
        {devSite}
      </Badge>
    </Box>
  ) : (
    <></>
  )
}
