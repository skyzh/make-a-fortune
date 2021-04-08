import React from "react"
import { useState, useEffect } from "react"
import Logo from "../widgets/Logo"

import {
  Stack,
  Box,
  Heading,
  Text,
  HStack,
  Button,
  Divider,
  useToast,
} from "@chakra-ui/react"
import { Route, NavLink } from "react-router-dom"
import { useRPCState, useTokenState } from "~/src/settings"
import { Client } from "~/src/client"
import {
  ArrowRightShort,
  ArrowRightCircleFill,
} from "~/src/components/utils/Icons"

const NavButton: React.FC = ({ to, exact, children, ...rest }) => {
  return (
    <Route
      path={to}
      exact={exact}
      children={({ match }) => (
        <NavLink exact={exact} to={to}>
          <Button
            colorScheme={match ? "blue" : "gray"}
            color={match ? "blue.600" : "gray.500"}
            variant={match ? "outline" : "ghost"}
            isFullWidth={true}
            justifyContent="flex-start"
            leftIcon={match ? <ArrowRightCircleFill /> : <ArrowRightShort />}
            onClick={() => {
              rest.onClose && rest.onClose()
            }}
            {...rest}
          >
            {children}
          </Button>
        </NavLink>
      )}
    />
  )
}

const Navbar: React.FC = ({ onClose }) => {
  const [rpc, _setRpc] = useRPCState()
  const [token, _setToken] = useTokenState()
  const [backend, setBackend] = useState({})
  const toast = useToast()
  useEffect(() => {
    async function sendRequest() {
      if (rpc !== "") {
        const client = new Client(rpc)
        setBackend(await client.version())
      }
    }

    sendRequest()
      .then(() => {})
      .catch((err) =>
        toast({
          title: "无法获取 RPC 后端信息",
          description: `${err}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      )
  }, [rpc])

  const NB: React.FC = (props) => <NavButton {...props} onClose={onClose} />

  return (
    <Stack spacing={1}>
      <HStack mb="3">
        <Logo />
        <Heading fontSize="lg">闷声发财</Heading>
      </HStack>

      <NB exact to="/">
        最新
      </NB>
      <NB to="/posts/trend">趋势</NB>
      <Divider />
      <Box px="5">
        <Text color="gray.500" fontSize="sm">
          个人
        </Text>
      </Box>
      <NB to="/posts/star">收藏</NB>
      <NB to="/posts/notification">通知</NB>
      <NB to="/posts/me">我的发帖</NB>
      <Divider />
      <Box px="5">
        <Text color="gray.500" fontSize="sm">
          系统
        </Text>
      </Box>
      <NB to="/login">{token ? "切换用户" : "登录"}</NB>
      <Box pt="5">
        <Text color="gray.500" fontSize="xs">
          「闷声发财」是一个通用的匿名社区前端。
          使用「闷声发财」访问社区内容，即意味着您同意所使用 RPC
          后端的服务条款，且同意对应匿名社区的社区规范与服务条款。
        </Text>
        <Text color="gray.500" fontSize="xs" mt="3">
          您正在使用 {rpc === "/" ? window.location.hostname : rpc}{" "}
          作为「闷声发财」的 RPC 后端。 该 RPC 后端由{" "}
          {backend?.name || "<无法获取信息>"} 提供服务。
        </Text>
      </Box>
    </Stack>
  )
}

export default Navbar
