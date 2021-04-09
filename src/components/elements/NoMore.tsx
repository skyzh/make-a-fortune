import { Box, Center, Flex, Text } from "@chakra-ui/react"
import React from "react"

function NoMore() {
  return (
    <Flex width="100%">
      <Center flex="1" py={20}>
        <Text size="sm" color="gray.500">
          没有更多帖子了。
        </Text>
      </Center>
      <Box size="80px" p="3" display={{ base: "none", sm: "unset" }}>
        <Box width="80px" />
      </Box>
    </Flex>
  )
}

export default NoMore
