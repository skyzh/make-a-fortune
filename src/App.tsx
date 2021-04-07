import React from "react"

import { Container, ChakraProvider, Stack, Box, Heading, Text } from "@chakra-ui/react"
import { Flex, Spacer, HStack, Button } from "@chakra-ui/react"
import Logo from "./Logo"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import Navbar from "./Navbar";
import PostList from "./PostList";
import Login from './Login';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Flex h="100vh">
          <Box size="300px" display={{ "base": "none", "md": "unset" }}>
            <Box padding="4" width="300px">
              <Navbar></Navbar>
            </Box>
          </Box>
          <Box flex="1" overflowY={{ "base": "unset", "md": "scroll" }}>
            <Container centerContent mt='3'>
              <Route path="/login">
                  <Login></Login>
              </Route>
              <Box padding="4" maxW="3xl">
                <Switch>
                  <Route exact path="/">
                    <PostList></PostList>
                  </Route>
                  <Route path="/trend">
                      趋势
                  </Route>
                  <Route path="/me">
                      我的
                  </Route>
                </Switch>
              </Box>
            </Container>
          </Box>
        </Flex>
      </Router>
    </ChakraProvider>
  )
}

export default App
