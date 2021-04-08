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
import { Thread, useClient } from "~/src/client"
import {
  HandThumbsUp,
  ChatSquareText,
  Flag,
  Broadcast,
  ReplyFill,
  Check,
  Star,
  StarFill,
} from "~/src/components/utils/Icons"
import * as moment from "moment"
import { handleError } from "~/src/utils"
import useLikeControl from "~/src/components/controls/LikeControl"

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
  const [whetherFavour, setWhetherFavour] = useState<boolean>(null)

  const whetherFavourCombined =
    whetherFavour === null ? thread.WhetherFavour : whetherFavour
  const client = useClient()

  const [isFavourLoading, setIsFavourLoading] = useState<boolean>(false)
  const toast = useToast()

  const payload = { postId: thread.ThreadID }
  const [likeTextControl, likeButtonControl] = useLikeControl({
    clientWhetherLike: thread.WhetherLike,
    clientCurrentLike: thread.Like - thread.Dislike,
    onCancelLike: () => client.cancelLikePost(payload),
    onLike: () => client.likePost(payload),
    onCancelDislike: () => client.cancelDislikePost(payload),
    onDislike: () => client.dislikePost(payload),
  })

  const toggleFavour = async () => {
    setIsFavourLoading(true)
    try {
      if (whetherFavourCombined) {
        await client.defavorPost({ postId: thread.ThreadID })
      } else {
        await client.favorPost({ postId: thread.ThreadID })
      }
      setWhetherFavour(!whetherFavourCombined)
    } catch (err) {
      handleError(toast, "无法收藏", err)
    } finally {
      setIsFavourLoading(false)
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
          {likeTextControl}
          <Text fontSize="sm">
            <ChatSquareText /> {thread.Comment}
          </Text>
          <Text fontSize="sm">
            <Broadcast /> {thread.Read}
          </Text>
          {showControl && (
            <>
              {likeButtonControl}
              <Button
                colorScheme="teal"
                size="xs"
                variant={whetherFavourCombined ? "solid" : "outline"}
                onClick={toggleFavour}
                isLoading={isFavourLoading}
              >
                {whetherFavourCombined ? <StarFill /> : <Star />}
                &nbsp;
                {whetherFavourCombined ? "已收藏" : "收藏"}
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
