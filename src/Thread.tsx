import React from "react"
import { useEffect, useState } from "react"

import {
  Stack,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Spacer,
  Badge,
  Skeleton,
  SkeletonText,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react"
import { Thread, useClient } from "./client"
import {
  HandThumbsUp,
  ChatSquareText,
  Flag,
  Broadcast,
  ReplyFill,
  Check,
} from "./Icons"
import * as moment from "moment"
import { handleError } from "./utils"

interface ThreadComponentProps {
  thread: Thread
  key?: string
  showPostTime?: boolean
  showControl?: boolean
}

interface ThreadSkeletonProps {
  showControl?: boolean
}

export function ThreadSkeleton({ showControl }: ThreadSkeletonProps) {
  return (
    <Flex width="100%">
      <Box flex="1" p={5} shadow="sm" borderWidth="1px" borderRadius="md">
        <Stack spacing="3">
          <Skeleton height="3" />
          <Skeleton height="8" />
          <SkeletonText spacing="3" noOfLines="4" />
        </Stack>
      </Box>
      <Box size="80px" p="3">
        <Stack color="teal.500" width="80px">
          <Text fontSize="sm">
            <HandThumbsUp />
          </Text>
          <Text fontSize="sm">
            <ChatSquareText />
          </Text>
          <Text fontSize="sm">
            <Broadcast />
          </Text>
          {showControl && (
            <>
              <Skeleton height="5" />
              <Skeleton height="5" />
              <Skeleton height="5" />
              <Skeleton height="5" />
            </>
          )}
        </Stack>
      </Box>
    </Flex>
  )
}

export function ThreadComponent({
  thread,
  showPostTime,
  showControl,
}: ThreadComponentProps) {
  const [whetherLike, setWhetherLike] = useState(null)
  const whetherLikeCombined =
    whetherLike === null ? thread.WhetherLike : whetherLike
  const client = useClient()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const likePost = () => {
    if (whetherLikeCombined === 1) {
      setIsLoading(true)
      client
        .cancelLikePost({ postId: thread.ThreadID })
        .then(() => setWhetherLike(0))
        .catch((err) => handleError(toast, "无法取消点赞", err))
        .finally(() => setIsLoading(false))
    }
    if (whetherLikeCombined === 0) {
      client
        .likePost({ postId: thread.ThreadID })
        .then(() => setWhetherLike(1))
        .catch((err) => handleError(toast, "无法点赞", err))
        .finally(() => setIsLoading(false))
    }
  }

  const dislikePost = () => {
    if (whetherLikeCombined === -1) {
      setIsLoading(true)
      client
        .cancelDislikePost({ postId: thread.ThreadID })
        .then(() => setWhetherLike(0))
        .catch((err) => handleError(toast, "无法取消点踩", err))
        .finally(() => setIsLoading(false))
    }
    if (whetherLikeCombined === 0) {
      client
        .dislikePost({ postId: thread.ThreadID })
        .then(() => setWhetherLike(-1))
        .catch((err) => handleError(toast, "无法点踩", err))
        .finally(() => setIsLoading(false))
    }
  }

  return (
    <Flex width="100%">
      <Box flex="1" p={5} shadow="sm" borderWidth="1px" borderRadius="md">
        <Stack spacing="3">
          <Flex>
            <Text fontSize="sm">
              <Badge colorScheme="gray"># {thread.ThreadID}</Badge>
            </Text>
            <Text fontSize="sm">
              {thread.Tag !== "NULL" && (
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
          <Text mt={4} wordBreak="break-word">
            {thread.Summary}
          </Text>
        </Stack>
      </Box>
      <Box size="80px" p="3">
        <Stack color="teal.500" width="80px">
          <Text fontSize="sm">
            <HandThumbsUp />{" "}
            {thread.Like -
              thread.Dislike +
              (whetherLike !== null ? whetherLike - thread.WhetherLike : 0)}
          </Text>
          <Text fontSize="sm">
            <ChatSquareText /> {thread.Comment}
          </Text>
          <Text fontSize="sm">
            <Broadcast /> {thread.Read}
          </Text>
          {showControl && (
            <>
              <ButtonGroup isAttached colorScheme="teal" size="xs">
                <Button
                  mr="-px"
                  isFullWidth
                  variant={whetherLikeCombined === 1 ? "solid" : "outline"}
                  isDisabled={whetherLikeCombined === -1}
                  onClick={likePost}
                  isLoading={isLoading}
                >
                  赞
                </Button>
                <Button
                  isFullWidth
                  variant={whetherLikeCombined === -1 ? "solid" : "outline"}
                  isDisabled={whetherLikeCombined === 1}
                  onClick={dislikePost}
                  isLoading={isLoading}
                >
                  踩
                </Button>
              </ButtonGroup>
              <Button colorScheme="teal" size="xs" variant="outline">
                <Check /> &nbsp; 收藏
              </Button>
              {thread.WhetherReport === 1 ? (
                <Button colorScheme="teal" size="xs" variant="solid" isDisabled>
                  <Check /> &nbsp; 已举报
                </Button>
              ) : (
                <Button colorScheme="teal" size="xs" variant="outline">
                  <Flag /> &nbsp; 举报
                </Button>
              )}
              <Button colorScheme="teal" size="xs" variant="outline">
                <ReplyFill /> &nbsp; 回复
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Flex>
  )
}
