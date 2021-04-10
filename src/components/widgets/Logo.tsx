import { Square, Text, useColorModeValue } from "@chakra-ui/react"
import React from "react"

function Logo() {
  const bgColor = useColorModeValue("white", "gray.700")

  return (
    <Square size="35px" shadow="lg" borderRadius="md" bgColor={bgColor}>
      <Text p="1">
        <span className="maf-logo">發</span>
      </Text>
    </Square>
  )
}

export default Logo
