import React from "react"
import { useState } from "react"

import {
  Container,
  ChakraProvider,
  Stack,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react"
import { Flex, Spacer, HStack, Button } from "@chakra-ui/react"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Textarea,
} from "@chakra-ui/react"

import { Client } from "./client"
import { v4 as uuidv4 } from "uuid"
import { useTokenState, useRPCState } from "./settings"
import ScrollableContainer from "./Scrollable"

function Login() {
  const [email, setEmail] = useState("")
  const [persistToken, setPersistToken] = useTokenState("")
  const [persistRPC, setPersistRPC] = useRPCState("https://fortune.skyzh.dev")
  const [token, setToken] = useState(persistToken)
  const [otpToken, setOtpToken] = useState("")
  const [rpc, setRpc] = useState(persistRPC)
  const [tokenSent, setTokenSent] = useState(false)
  const [loginSent, setLoginSent] = useState(false)
  const toast = useToast()

  const client = new Client(rpc)
  const sendCode = () => {
    setTokenSent(true)
    async function doSend() {
      await client.requestLoginCode({ email })
      toast({
        title: "验证邮件已发送",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      await new Promise((r) => setTimeout(r, 5000))
    }
    doSend()
      .catch((err) =>
        toast({
          title: "无法发送验证邮件",
          description: `${err}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      )
      .finally(() => setTokenSent(false))
  }

  const sendLogin = () => {
    setLoginSent(true)
    async function doSend() {
      const uuid = uuidv4()
      return await client.login({ email, code: otpToken, device: uuid })
    }
    doSend()
      .then((resp) => {
        if (resp.Token !== "") {
          setPersistToken(resp.Token)
          setPersistRPC(rpc)
          setToken(resp.Token)
          toast({
            title: "登录成功",
            description: "即将刷新网页",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
          setTimeout(() => (window.location.href = "/"), 2000)
        } else {
          toast({
            title: "无法登录",
            status: "error",
            description: `${JSON.stringify(resp)}`,
            duration: 5000,
            isClosable: true,
          })
        }
      })
      .catch((err) =>
        toast({
          title: "无法登录",
          description: `${err}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      )
      .finally(() => setLoginSent(false))
  }

  const setTokenSetting = () => {
    setPersistToken(token)
    setPersistRPC(rpc)
    toast({
      title: "设置成功",
      description: "即将刷新网页",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
    setTimeout(() => (window.location.href = "/"), 2000)
  }

  return (
    <ScrollableContainer>
      <Box p={5} shadow="md" borderWidth="1px" width="100%">
        <Heading fontSize="xl" mb="5">
          登录
        </Heading>
        <Tabs>
          <TabList>
            <Tab>邮箱登录</Tab>
            <Tab>Token 登录</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Stack spacing="3">
                <FormControl id="email">
                  <FormLabel>邮箱</FormLabel>
                  <InputGroup size="md">
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <InputRightElement width="6rem" mx="0.5rem">
                      <Button
                        size="sm"
                        h="1.75rem"
                        onClick={sendCode}
                        isLoading={tokenSent}
                      >
                        发送验证码
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText>
                    您所使用的匿名社区可能对邮箱后缀进行限制。
                  </FormHelperText>
                </FormControl>
                <FormControl id="otpToken">
                  <FormLabel>验证码</FormLabel>
                  <Input
                    value={otpToken}
                    onChange={(event) => setOtpToken(event.target.value)}
                  />
                  <FormHelperText>
                    您可以通过邮箱查收验证码邮件。
                  </FormHelperText>
                </FormControl>
                <FormControl id="proxyServer">
                  <FormLabel>RPC 服务器</FormLabel>
                  <Input
                    value={rpc}
                    onChange={(event) => setRpc(event.target.value)}
                  />
                  <FormHelperText>
                    您的所有消息（包括用户令牌、发送与接收的内容）都将通过 RPC
                    服务器传输。务必确保您信任 RPC 服务器的提供者。
                  </FormHelperText>
                </FormControl>
                <Button
                  mt={4}
                  colorScheme="blue"
                  isLoading={loginSent}
                  onClick={sendLogin}
                >
                  登录
                </Button>
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack spacing="3">
                <FormControl id="token">
                  <FormLabel>Token</FormLabel>
                  <Textarea
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                  />
                </FormControl>
                <FormControl id="proxyServer">
                  <FormLabel>RPC 服务器</FormLabel>
                  <Input
                    value={rpc}
                    onChange={(event) => setRpc(event.target.value)}
                  />
                  <FormHelperText>
                    您的所有消息（包括用户令牌、发送与接收的内容）都将通过 RPC
                    服务器传输。务必确保您信任 RPC 服务器的提供者。
                  </FormHelperText>
                </FormControl>
                <Button mt={4} colorScheme="blue" onClick={setTokenSetting}>
                  使用该设置
                </Button>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ScrollableContainer>
  )
}

export default Login
