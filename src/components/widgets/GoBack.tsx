import React from "react"
import { useHistory } from "react-router-dom"
import { Button, HStack, Box } from "@chakra-ui/react"
import { ArrowLeft } from "~/src/components/utils/Icons"

function GoBack() {
  const history = useHistory()
  return (
    <Box width="100%" my="3">
      <HStack>
        <Button
          colorScheme="blue"
          variant="ghost"
          onClick={() => history.goBack()}
        >
          <ArrowLeft /> &nbsp; 返回
        </Button>
      </HStack>
    </Box>
  )
}

export default GoBack
