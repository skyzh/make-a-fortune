import { extendTheme } from "@chakra-ui/react"

export const theme = extendTheme({
  fontWeights: {
    semibold: 500,
    bold: 500,
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
})
