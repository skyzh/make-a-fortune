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
  Spinner,
  Center,
  Button,
} from "@chakra-ui/react"
import { useHistory } from "react-router-dom"
import { useClient, PostType, PostCategory, Thread } from "./client"
import {
  HandThumbsUp,
  ChatSquareText,
  Flag,
  Broadcast,
  ArrowRight,
} from "./Icons"
import * as moment from "moment"

interface ThreadComponentProps {
  thread: Thread
  key?: string
}

function ThreadComponent({ thread }: ThreadComponentProps) {
  const history = useHistory()
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
        <HStack spacing="10" justify="space-between" px="3" color="teal.500">
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
          <Button
            variant="ghost"
            onClick={() => history.push(`/posts/${thread.ThreadID}`)}
          >
            <ArrowRight />
          </Button>
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
      {threadList.length > 0 ? (
        threadList.map((thread) => (
          <Box key={thread.ThreadID}>
            <ThreadComponent thread={thread} />
          </Box>
        ))
      ) : (
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      )}
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
