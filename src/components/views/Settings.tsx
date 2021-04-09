import { Box, Button, Heading, Stack, Text, useToast } from "@chakra-ui/react"
import React, { useState } from "react"
import ScrollableContainer from "~/src/components/scaffolds/Scrollable"
import { FortuneSettings, useFortuneSettings } from "~/src/settings"
import KeywordBlock from "./KeywordBlock"

function useSetArray(defaultValue) {
  const [content, setContent] = useState(new Set(defaultValue))
  const appendValue = (value) => {
    if (!value) return
    const newContent = new Set(content)
    newContent.add(value)
    setContent(newContent)
  }
  const deleteValue = (value) => {
    const newContent = new Set(content)
    newContent.delete(value)
    setContent(newContent)
  }
  return [Array.from(content), appendValue, deleteValue]
}

function Settings() {
  const [
    persistSetting,
    setPersistSetting,
  ] = useFortuneSettings<FortuneSettings>({})
  const [keywords, addKeyword, deleteKeyword] = useSetArray(
    persistSetting.blockedKeywords || []
  )
  const toast = useToast()

  const saveSettings = () => {
    setPersistSetting({
      blockedKeywords: keywords,
    })
    toast({
      title: "设置已保存",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <ScrollableContainer>
      <Box p={5} shadow="md" borderWidth="1px" width="100%">
        <Stack spacing="3">
          <Heading fontSize="xl" mb="5">
            设置
          </Heading>
          <Box>
            <Heading fontSize="lg" mb="5">
              关键词屏蔽
            </Heading>
            <KeywordBlock
              keywords={keywords}
              addKeyword={addKeyword}
              deleteKeyword={deleteKeyword}
            />
          </Box>
          <Box>
            <Heading fontSize="lg" mb="5">
              通知
            </Heading>
            <Box my="1">敬请期待</Box>
          </Box>
          <Button colorScheme="blue" isFullWidth onClick={saveSettings}>
            保存
          </Button>
          <Text fontSize="sm" color="gray.500">
            「闷声发财」的设置存储在您的浏览器中。当您切换浏览器或设备时，需要重新进行设置。
          </Text>
        </Stack>
      </Box>
    </ScrollableContainer>
  )
}

export default Settings
