import React from "react"
import { useEffect, useState } from "react"

import {
  Stack,
  Box,
  Heading,
  Text,
  HStack,
  Flex,
  Spacer,
  Badge,
} from "@chakra-ui/react"
import { useClient, PostType, PostCategory, Thread } from "./client"
import { HandThumbsUp, ChatSquareText, Flag, Broadcast } from "./Icons"
import * as moment from "moment"

interface ThreadComponentProps {
  thread: Thread
  key?: string
}

function ThreadComponent({ thread }: ThreadComponentProps) {
  return (
    <Box p={5} shadow="sm" borderWidth="1px" width="100%">
      <Stack spacing="3">
        <Flex>
          <Text fontSize="sm">
            <Badge colorScheme="gray">#</Badge> {thread.ThreadID}
          </Text>
          <Text fontSize="sm">
            {thread.Tag != "NULL" && (
              <Badge ml="2" colorScheme="teal">
                {thread.Tag}
              </Badge>
            )}
          </Text>
          <Spacer />
          <Text fontSize="sm">{moment(thread.LastUpdateTime).calendar()}</Text>
        </Flex>
        <Heading fontSize="md">{thread.Title}</Heading>
        <Text mt={4}>{thread.Summary}</Text>
        <HStack spacing="10" justify="space-between" px="3" color="blue.500">
          <Text fontSize="sm">
            <HandThumbsUp /> {thread.Like - thread.Dislike}
          </Text>
          <Text fontSize="sm">
            <Flag /> {thread.Block}
          </Text>
          <Text fontSize="sm">
            <ChatSquareText /> {thread.Comment}
          </Text>
          <Text fontSize="sm">
            <Broadcast /> {thread.Read}
          </Text>
        </HStack>
      </Stack>
    </Box>
  )
}

interface ThreadListComponentProps {
  threadList: Thread[]
}

function ThreadListComponent({ threadList }: ThreadListComponentProps) {
  return (
    <Stack spacing={3} width="100%" mb="3">
      {threadList.map((thread) => (
        <ThreadComponent key={thread.ThreadID} thread={thread} />
      ))}
    </Stack>
  )
}

export function PostListTime() {
  const client = useClient()
  const [threadList, setThreadList] = useState([])
  useEffect(() => {
    async function fetch() {
      const result = await client.fetchPost({
        postCategory: PostCategory.All,
        postType: PostType.Time,
      })
      setThreadList(result.thread_list)
    }
    fetch().then()
  }, [])

  return <ThreadListComponent threadList={threadList}></ThreadListComponent>
}

export function PostListTrend() {
  const client = useClient()
  const [threadList, setThreadList] = useState([])
  useEffect(() => {
    async function fetch() {
      const result = await client.fetchPost({
        postCategory: PostCategory.All,
        postType: PostType.Trending,
      })
      setThreadList(result.thread_list)
    }
    fetch().then()
  }, [])

  return <ThreadListComponent threadList={threadList}></ThreadListComponent>
}
