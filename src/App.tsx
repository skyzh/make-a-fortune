import React from "react"

import { Container, ChakraProvider, Stack, Box, Heading, Text } from "@chakra-ui/react"
import { Flex, Spacer, Button } from "@chakra-ui/react"

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

function ArrowIcon() {
  return <i class="bi bi-arrow-right-short"></i>

}

function ArrowIconSelected() {
  return <i class="bi bi-arrow-right-circle-fill"></i>
}

function App() {
  return (
    <ChakraProvider>
      <Flex h="100vh">
        <Box size="200px" display={{ "base": "none", "md": "unset" }}>
          <Box padding="4" width="200px">
            <Stack spacing={1}>
              <Heading fontSize="lg" mb="3">无可奉告</Heading>
              <Button colorScheme="blue" leftIcon={<ArrowIconSelected/>} variant="ghost" isFullWidth={true} justifyContent="flex-start">
                首页
              </Button>
              <Button colorScheme="blue" leftIcon={<ArrowIcon/>} variant="ghost" isFullWidth={true} justifyContent="flex-start">
                趋势
              </Button>
              <Button colorScheme="blue" leftIcon={<ArrowIcon/>} variant="ghost" isFullWidth={true} justifyContent="flex-start">
                我的
              </Button>
              <Text>Web Portal</Text>
            </Stack>
          </Box>
        </Box>
        <Box flex="1" overflowY={{ "base": "unset", "md": "scroll" }}>
          <Container centerContent>
            <Box padding="4" maxW="3xl">
              <StackEx></StackEx>
            </Box>
          </Container>
        </Box>
      </Flex>
    </ChakraProvider>
  )
}

export default App
