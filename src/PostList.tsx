import React from "react"

import { Container, ChakraProvider, Stack, Box, Heading, Text } from "@chakra-ui/react"
import { Flex, Spacer, HStack, Button } from "@chakra-ui/react"

function Feature({ title, desc, ...rest }) {
    return (
      <Box p={5} shadow="sm" borderWidth="1px" {...rest}>
        <Heading fontSize="xl">{title}</Heading>
        <Text mt={4}>{desc}</Text>
      </Box>
    )
  }
  
  function StackEx() {
    return (
      <Stack spacing={3}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => <Feature
          title="Plan Money"
          desc="The future can be even brighter but a goal without a plan is just a wish"
        />)}
      </Stack>
    )
  }

  
function PostList() {
    return  <StackEx></StackEx>
}

export default PostList;