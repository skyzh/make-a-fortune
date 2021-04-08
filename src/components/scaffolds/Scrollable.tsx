import React from "react"
import { Box, Container } from "@chakra-ui/react"

const ScrollableContainer: React.FC = ({ children }) => {
  return (
    <Box
      overflowY={{ base: "unset", md: "scroll" }}
      overflowX="hidden"
      height="100%"
    >
      <Container maxW="container.md" centerContent my="3">
        {children}
      </Container>
    </Box>
  )
}

export default ScrollableContainer
