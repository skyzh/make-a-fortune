import { Button, ButtonProps, useColorMode } from "@chakra-ui/react"
import React from "react"
import { MoonFill, SunFill } from "../utils/Icons"

export function ColorModeButton(props: ButtonProps) {
  const mode = useColorMode()

  return (
    <Button
      colorScheme={mode.colorMode === "light" ? "blue" : "orange"}
      variant="ghost"
      onClick={mode.toggleColorMode}
      {...props}
    >
      {mode.colorMode === "light" ? <MoonFill /> : <SunFill />}
    </Button>
  )
}
