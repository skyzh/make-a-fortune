import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useBoolean,
  useToast,
} from "@chakra-ui/react"
import { clone } from "lodash"
import moment from "moment"
import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Client, RPCVersion } from "~/src/client"
import ScrollableContainer from "~/src/components/scaffolds/Scrollable"
import { useRPCState, useTokenState } from "~/src/settings"
import { getRpcDisplayName, handleError } from "~src/utils"
import { ArrowRightShort } from "../utils/Icons"

function RpcSettings({
  rpc,
  setRpc,
}: {
  rpc: string
  setRpc: (r: string) => void
}) {
  const [connectionLoading, setConnectionLoading] = useState(false)
  const [backend, setBackend] = useState<RPCVersion>()
  const [latency, setLatency] = useState<number[]>()
  const [isCheckingConnection, setIsCheckingConnection] = useBoolean(false)
  const toast = useToast()

  const checkConnection = () => {
    setConnectionLoading(true)
    const client = new Client(rpc)

    client
      .version()
      .then((backend) => {
        if (!backend.name) {
          handleError(
            toast,
            "非法的 RPC 服务器",
            new Error("服务器返回了无法解析的信息")
          )
          return
        }
        setBackend(backend)
        setLatency(undefined)
        setIsCheckingConnection.on()
        return (async () => {
          const latencies = []
          for (let i = 0; i < 3; i++) {
            const now = moment()
            await client.verifyToken()
            latencies.push(moment().diff(now, "milliseconds"))
            setLatency(clone(latencies))
          }
        })()
      })
      .then()
      .catch((err) => handleError(toast, "无法连接到 RPC 服务器", err))
      .finally(() => {
        setConnectionLoading(false)
        setIsCheckingConnection.off()
      })
  }

  const doSetRpc = (value: string) => {
    setBackend(undefined)
    setRpc(value)
  }

  const rpcDisplayName = getRpcDisplayName(rpc)

  return (
    <Stack spacing="3">
      <Heading fontSize="xl" mb="5">
        RPC 服务器
      </Heading>
      <FormControl>
        <RadioGroup onChange={doSetRpc} value={rpc}>
          <Stack>
            <Radio value="https://fortune.lightquantum.me:9108">
              <HStack spacing={1}>
                <Text>fortune.lightquantum.me:9108</Text>
                <Text color="gray.500">
                  (Powered by Tencent Cloud, 低延迟低带宽)
                </Text>
              </HStack>
            </Radio>
            <Radio value="https://fortune.skyzh.dev/">
              <HStack spacing={1}>
                <Text>fortune.skyzh.dev</Text>
                <Text color="gray.500">(Powered by Vultr)</Text>
              </HStack>
            </Radio>
            <Radio value="https://make-a-fortune.vercel.app">
              <HStack spacing={1}>
                <Text>make-a-fortune.vercel.app</Text>
                <Text color="gray.500">(Powered by Vercel Function)</Text>
              </HStack>
            </Radio>
            <Radio value="https://fortune.fly.dev">
              <HStack spacing={1}>
                <Text>fortune.fly.dev</Text>
                <Text color="gray.500">(Powered by Fly.io)</Text>
              </HStack>
            </Radio>
            <Radio value="http://localhost:8080">
              <HStack spacing={1}>
                <Text>本地 RPC 服务器</Text>
                <Text color="gray.500">[*1]</Text>
              </HStack>
            </Radio>
            <Radio value="/">
              <HStack spacing={1}>
                <Text>本地开发服务器</Text>
                <Text color="gray.500">[*2]</Text>
              </HStack>
            </Radio>
          </Stack>
        </RadioGroup>
        {rpc === "http://localhost:8080" && (
          <Box my="3">
            <Text color="gray.500" fontSize="sm">
              [*1] 若使用本地 RPC 服务器，您需要使用 HTTP 协议打开前端。Vercel
              默认不支持 HTTP 访问。
            </Text>
          </Box>
        )}
        {rpc === "/" && (
          <Box my="3">
            <Text color="gray.500" fontSize="sm">
              [*2] 如果您正在使用 yarn / parcel 进行开发，请选择此选项。
            </Text>
          </Box>
        )}
        <Input
          mt={3}
          value={rpc}
          onChange={(event) => doSetRpc(event.target.value)}
        />
        <FormHelperText>
          您的所有消息（包括用户令牌、发送与接收的内容）都将通过 RPC
          服务器传输。务必确保您信任 RPC 服务器的提供者。
        </FormHelperText>
      </FormControl>
      <Button
        colorScheme="blue"
        isFullWidth
        isLoading={connectionLoading}
        onClick={checkConnection}
      >
        检测连通性
      </Button>
      {backend && (
        <Stack spacing={1}>
          <Text color="gray.500">RPC 后端：{backend?.name}</Text>
          <Text color="gray.500">上游地址：{backend?.addr}</Text>
          <Text color="gray.500">版本：{backend?.version}</Text>
          <HStack color="gray.500" spacing={1}>
            <Text>延迟：</Text>
            {latency &&
              latency.map((lat) => (
                <Text
                  color={
                    lat <= 100
                      ? "green.500"
                      : lat <= 1000
                      ? "yellow.500"
                      : "orange.500"
                  }
                >
                  {lat}ms
                </Text>
              ))}
            {isCheckingConnection && <Spinner size="xs" />}
          </HStack>
          <Text color="blue.500">
            <a href={backend.terms_of_service}>
              <ArrowRightShort /> {backend.name || "<匿名社区>"} 用户协议
            </a>
          </Text>
          <Text color="blue.500">
            <a href={backend.rpc_source_code}>
              <ArrowRightShort /> {rpcDisplayName} 开源代码
            </a>
          </Text>
          <Text color="blue.500">
            <a href={backend.rpc_terms_of_service}>
              <ArrowRightShort /> {rpcDisplayName} 用户协议
            </a>
          </Text>
        </Stack>
      )}
    </Stack>
  )
}

function Login() {
  const [email, setEmail] = useState("")
  const [persistToken, setPersistToken] = useTokenState("")
  const [persistRPC, setPersistRPC] = useRPCState(
    "https://fortune.lightquantum.me:9108"
  )
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
    setLoginSent(true)
    client
      .verifyToken(token.trim())
      .then((result) => {
        if (result.login_flag === "1" || result.login_flag === "-1") {
          setPersistToken(token.trim())
          setToken(token.trim())
          setPersistRPC(rpc)
          toast({
            title: "设置成功",
            description: "即将刷新网页",
            status: "success",
            duration: 5000,
            isClosable: true,
          })
          setTimeout(() => (window.location.href = "/"), 2000)
        } else if (result.login_flag === "0") {
          toast({
            title: "无法登录",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        }
      })
      .catch((err) => handleError(toast, "无法登录", err))
      .finally(() => setLoginSent(false))
  }

  return (
    <ScrollableContainer>
      <Stack spacing="3" width="100%">
        <Box p={5} shadow="md" borderWidth="1px">
          <RpcSettings rpc={rpc} setRpc={setRpc} />
        </Box>
        <Box p={5} shadow="md" borderWidth="1px">
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
                <Stack spacing={5}>
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
                      rows={5}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <Button
                    mt={4}
                    colorScheme="blue"
                    onClick={setTokenSetting}
                    isLoading={loginSent}
                  >
                    更新 Token
                  </Button>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </ScrollableContainer>
  )
}

export default Login
