import { Box, Button } from "@chakra-ui/react"
import React from "react"
import { ArrowClockwise } from "~/src/components/utils/Icons"

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
