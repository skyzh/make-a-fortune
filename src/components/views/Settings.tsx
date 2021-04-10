import {
  Box,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react"
import React, { useState } from "react"
import ScrollableContainer from "~/src/components/scaffolds/Scrollable"
import { LayoutStyle, useFortuneSettings } from "~/src/settings"
import { Tag } from "~src/client"
import KeywordBlock from "./KeywordBlock"

function useSetArray<T>(defaultValue: T[]) {
  const [content, setContent] = useState(new Set(defaultValue))
  const appendValue = (value: T | null) => {
    if (!value) return
    const newContent = new Set(content)
    newContent.add(value)
    setContent(newContent)
  }
  const deleteValue = (value: T) => {
    const newContent = new Set(content)
    newContent.delete(value)
    setContent(newContent)
  }
  return [Array.from(content), appendValue, deleteValue] as const
}

function LayoutSettings({
  layout,
  setLayout,
}: {
  layout: LayoutStyle
  setLayout: (l: LayoutStyle) => void
}) {
  return (
    <RadioGroup value={layout} onChange={setLayout}>
      <Stack spacing={3}>
        <Radio value="compact">紧凑</Radio>
        <Radio value="comfortable">舒适</Radio>
      </Stack>
    </RadioGroup>
  )
}

function TagBlockSettings({
  tags,
  addTag,
  deleteTag,
}: {
  tags: Tag[]
  addTag: (t: Tag | null) => void
  deleteTag: (t: Tag) => void
}) {
  const toggleTagFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    tag: Tag
  ) => {
    if (e.currentTarget.checked) addTag(tag)
    else deleteTag(tag)
  }

  return (
    <Stack spacing={3}>
      {Object.values(Tag).map((tag) => (
        <Switch
          onChange={(e) => toggleTagFilter(e, tag)}
          isChecked={tags.includes(tag)}
          key={tag}
        >
          {tag}
        </Switch>
      ))}
    </Stack>
  )
}

function Settings() {
  const [persistSetting, setPersistSetting] = useFortuneSettings()

  const [keywords, addKeyword, deleteKeyword] = useSetArray(
    persistSetting.blockedKeywords
  )
  const [tags, addTag, deleteTag] = useSetArray(persistSetting.blockedTags)
  const [layout, setLayout] = useState(persistSetting.layout)
  const toast = useToast()

  const saveSettings = () => {
    setPersistSetting({
      blockedKeywords: keywords,
      blockedTags: tags,
      layout,
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
        <Stack spacing="10">
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
            <Heading fontSize="lg" mb="2">
              标签屏蔽
            </Heading>
            <Box mb={4}>隐藏标记有以下标签的帖子</Box>
            <TagBlockSettings
              tags={tags}
              addTag={addTag}
              deleteTag={deleteTag}
            />
          </Box>
          <Box>
            <Heading fontSize="lg" mb="5">
              布局
            </Heading>
            <LayoutSettings layout={layout} setLayout={setLayout} />
          </Box>
          <Box>
            <Heading fontSize="lg" mb="5">
              通知
            </Heading>
            <Box my="1">敬请期待</Box>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb="3">
              「闷声发财」的设置存储在您的浏览器中。当您切换浏览器或设备时，需要重新进行设置。
            </Text>
            <Button colorScheme="blue" isFullWidth onClick={saveSettings}>
              保存
            </Button>
          </Box>
        </Stack>
      </Box>
    </ScrollableContainer>
  )
}

export default Settings
