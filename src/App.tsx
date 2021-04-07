import React from "react"

import { Container, ChakraProvider, Box } from "@chakra-ui/react"
import { Flex } from "@chakra-ui/react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Navbar from "./Navbar"
import { PostListTrend, PostListTime } from "./PostList"
import Login from "./Login"

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Flex h="100vh">
          <Box
            size="300px"
            display={{ base: "none", md: "unset" }}
            bg="gray.50"
          >
            <Box padding="4" width="300px">
              <Navbar></Navbar>
            </Box>
          </Box>
          <Box
            flex="1"
            overflowY={{ base: "unset", md: "scroll" }}
            overflowX="hidden"
          >
            <Container centerContent mt="3">
              <Switch>
                <Route path="/login">
                  <Login></Login>
                </Route>
                <Route exact path="/">
                  <PostListTime></PostListTime>
                </Route>
                <Route path="/trend">
                  <PostListTrend></PostListTrend>
                </Route>
                <Route path="/me">我的</Route>
              </Switch>
            </Container>
          </Box>
        </Flex>
      </Router>
    </ChakraProvider>
  )
}

export default App
