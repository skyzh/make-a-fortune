import React from "react"

import { ChakraProvider, Box, Button } from "@chakra-ui/react"
import { Flex } from "@chakra-ui/react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Navbar from "./components/elements/Navbar"
import {
  PostListTrend,
  PostListTime,
  PostListMy,
  PostListStar,
  PostListNotification,
  PostListSearch, PostListCategory
} from "./components/lists/PostList"
import ThreadList from "./components/lists/ThreadList"
import Login from "./components/views/Login"
import { theme } from "./theme"
import Logo from "~src/components/widgets/Logo"
import PhoneNavbar from "~src/components/elements/PhoneNavbar"

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Flex h="100vh">
          <Box
            size="300px"
            display={{ base: "none", md: "unset" }}
            bg="gray.50"
          >
            <Box padding="4" width="300px">
              <Navbar />
            </Box>
          </Box>
          <Box flex="1">
            <Box display={{ base: "unset", md: "none" }}>
              <Box padding="4">
                <PhoneNavbar />
              </Box>
            </Box>

            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route exact path="/">
                <PostListTime />
              </Route>
              <Route path="/category/:categoryId">
                <PostListCategory />
              </Route>
              <Route path="/posts/trend">
                <PostListTrend />
              </Route>
              <Route path="/posts/star">
                <PostListStar />
              </Route>
              <Route path="/posts/me">
                <PostListMy />
              </Route>
              <Route path="/posts/notification">
                <PostListNotification />
              </Route>
              <Route path="/posts/search">
                <PostListSearch />
              </Route>
              <Route path="/posts/:postId">
                <ThreadList />
              </Route>
            </Switch>
          </Box>
        </Flex>
      </Router>
    </ChakraProvider>
  )
}

export default App
