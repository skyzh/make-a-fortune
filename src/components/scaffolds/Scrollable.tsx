import { Box, Container } from "@chakra-ui/react"
import React from "react"

const ScrollableContainer: React.FC = ({ children }) => {
  return (
    <Box overflowX="hidden">
      <Container maxW="container.md" centerContent my="3">
        {children}
      </Container>
    </Box>
  )
}

export default ScrollableContainer
