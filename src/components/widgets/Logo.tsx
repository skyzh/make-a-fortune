import { Square, Text } from "@chakra-ui/react"
import React from "react"

function Logo() {
  return (
    <Square size="35px" shadow="lg" borderRadius="md">
      <Text p="1">
        <span className="maf-logo">發</span>
      </Text>
    </Square>
  )
}

export default Logo
