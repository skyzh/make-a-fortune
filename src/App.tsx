import { Box, ChakraProvider, Flex } from "@chakra-ui/react"
import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import PhoneNavbar from "~src/components/elements/PhoneNavbar"
import Navbar from "./components/elements/Navbar"
import {
  PostListCategory,
  PostListMy,
  PostListNotification,
  PostListSearch,
  PostListStar,
  PostListTime,
  PostListTrend,
} from "./components/lists/PostList"
import ThreadList from "./components/lists/ThreadList"
import Login from "./components/views/Login"
import Settings from "./components/views/Settings"
import { theme } from "./theme"

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box
          display={{ base: "unset", md: "none" }}
          position={{ base: "fixed", md: "unset" }}
          top="0"
          background="white"
          shadow="sm"
          width="100%"
          zIndex="1000"
        >
          <Box padding="4">
            <PhoneNavbar />
          </Box>
        </Box>
        <Flex
          h={{
            base: "unset",
            md: "100vh",
          }}
          mt={{
            base: "5rem",
            md: "0",
          }}
        >
          <Box
            size="300px"
            display={{ base: "none", md: "unset" }}
            bg="gray.50"
            overflowY={{ base: "unset", md: "scroll" }}
            overflowX="hidden"
            height="100%"
          >
            <Box padding="4" width="300px">
              <Navbar />
            </Box>
          </Box>
          <Box flex="1">
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/settings">
                <Settings />
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
