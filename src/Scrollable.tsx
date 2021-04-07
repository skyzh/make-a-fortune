import React from "react"
import { Box, Container } from "@chakra-ui/react"

function ScrollableContainer({ children }) {
  return (
    <Box
      overflowY={{ base: "unset", md: "scroll" }}
      overflowX="hidden"
      height="100%"
    >
      <Container centerContent mt="3">
        {children}
      </Container>
    </Box>
  )
}

export default ScrollableContainer
