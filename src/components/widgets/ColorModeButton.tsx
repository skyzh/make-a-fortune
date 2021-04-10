import { Button, useColorMode } from "@chakra-ui/react"
import React from "react"
import { MoonFill, SunFill } from "../utils/Icons"

export function ColorModeButton(props) {
  const mode = useColorMode()

  return (
    <Button
      colorScheme="blue"
      variant="ghost"
      onClick={mode.toggleColorMode}
      _focus={false}
      {...props}
    >
      {mode.colorMode == "light" ? <MoonFill /> : <SunFill />}
    </Button>
  )
}
