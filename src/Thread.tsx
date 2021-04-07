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
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react"
import { Thread } from "./client"
import { HandThumbsUp, ChatSquareText, Flag, Broadcast } from "./Icons"
import * as moment from "moment"

interface ThreadComponentProps {
  thread: Thread
  key?: string
  showPostTime?: boolean
}

export function ThreadSkeleton() {
  return (
    <Box p={5} shadow="sm" borderWidth="1px" width="100%">
      <Stack spacing="3">
        <Skeleton height="1rem" />
        <Skeleton height="2rem" />
        <SkeletonText spacing="4" />
        <Skeleton height="1rem" />
      </Stack>
    </Box>
  )
}

export function ThreadComponent({
  thread,
  showPostTime,
}: ThreadComponentProps) {
  return (
    <Box p={5} shadow="sm" borderWidth="1px" width="100%">
      <Stack spacing="3">
        <Flex>
          <Text fontSize="sm">
            <Badge colorScheme="gray"># {thread.ThreadID}</Badge>
          </Text>
          <Text fontSize="sm">
            {thread.Tag != "NULL" && (
              <Badge ml="2" colorScheme="teal">
                {thread.Tag}
              </Badge>
            )}
          </Text>
          <Spacer />
          <Text fontSize="sm">
            {moment(
              showPostTime ? thread.PostTime : thread.LastUpdateTime
            ).calendar()}
          </Text>
        </Flex>
        <Heading fontSize="md">{thread.Title}</Heading>
        <Text mt={4}>{thread.Summary}</Text>
        <HStack spacing="10" justify="space-between" color="teal.500">
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
