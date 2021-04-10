import { Box, Flex, useColorModeValue } from "@chakra-ui/react"
import React, { Fragment } from "react"
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
import ScrollToTop from "./components/utils/ScrollToTop"
import Login from "./components/views/Login"
import Settings from "./components/views/Settings"

function App() {
  const navBgColor = useColorModeValue("gray.50", "gray.900")
  const phoneNavbarBgColor = useColorModeValue("white", "gray.800")

  return (
    <Router>
      <Fragment>
        <ScrollToTop />
        <Box
          display={{ base: "unset", md: "none" }}
          position="fixed"
          top="0"
          backgroundColor={phoneNavbarBgColor}
          shadow="sm"
          width="100%"
          zIndex="1000"
        >
          <Box padding="4">
            <PhoneNavbar />
          </Box>
        </Box>
        <Box
          size="300px"
          display={{ base: "none", md: "unset" }}
          position="fixed"
          top={0}
          bottom={0}
          bg={navBgColor}
          overflowY={{ base: "unset", md: "scroll" }}
          overflowX="hidden"
        >
          <Box padding="4" width="300px">
            <Navbar />
          </Box>
        </Box>
        <Flex
          mt={{
            base: "5rem",
            md: "0",
          }}
        >
          <Box
            size="300px"
            display={{ base: "none", md: "unset" }}
            bg={navBgColor}
            overflowY={{ base: "unset", md: "scroll" }}
            overflowX="hidden"
            height="100%"
          >
            <Box width="300px"></Box>
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
      </Fragment>
    </Router>
  )
}

export default App
