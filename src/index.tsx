import { ColorModeScript } from "@chakra-ui/color-mode"
import { ChakraProvider } from "@chakra-ui/react"
import "bootstrap-icons/font/bootstrap-icons.css"
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "./index.scss"
import { theme } from "./theme"
import "./vendor"

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </>,
  document.getElementById("root")
)
