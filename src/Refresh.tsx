import React from "react"
import { Button, HStack, Box } from "@chakra-ui/react"
import { ArrowClockwise } from "./Icons"

function Refresh({ onClick }) {
  return (
    <Box width="100%" my="3">
      <Button colorScheme="blue" variant="ghost" onClick={onClick}>
        <ArrowClockwise /> &nbsp; 刷新
      </Button>
    </Box>
  )
}

export default Refresh
