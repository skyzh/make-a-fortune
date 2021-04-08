import React from "react"

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
} from "@chakra-ui/react"
import { Thread, useClient } from "~/src/client"
import {
  HandThumbsUp,
  ChatSquareText,
  Flag,
  Broadcast,
  ReplyFill,
  FlagFill,
  Star,
  StarFill,
} from "~/src/components/utils/Icons"
import * as moment from "moment"
import useLikeControl from "~/src/components/controls/LikeControl"
import useNetworkLocalControl from "../controls/NetworkLocalControl"

interface ThreadComponentProps {
  thread: Thread
  key?: string
  showPostTime?: boolean
  showControl?: boolean
  onReply: Function
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
              <Skeleton height="6" />
              <Skeleton height="6" />
              <Skeleton height="6" />
              <Skeleton height="6" />
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
  onReply,
}: ThreadComponentProps) {
  const client = useClient()

  const payload = { postId: thread.ThreadID }
  const [likeTextControl, likeButtonControl] = useLikeControl({
    clientWhetherLike: thread.WhetherLike,
    clientCurrentLike: thread.Like - thread.Dislike,
    onCancelLike: () => client.cancelLikePost(payload),
    onLike: () => client.likePost(payload),
    onCancelDislike: () => client.cancelDislikePost(payload),
    onDislike: () => client.dislikePost(payload),
  })

  const favourControl = useNetworkLocalControl({
    clientState: thread.WhetherFavour === 1,
    doAction: () => client.favorPost(payload),
    cancelAction: () => client.defavorPost(payload),
    failedText: "无法收藏",
    doneComponent: (
      <>
        <StarFill /> &nbsp; 已收藏
      </>
    ),
    initialComponent: (
      <>
        <Star /> &nbsp; 收藏
      </>
    ),
  })

  const reportControl = useNetworkLocalControl({
    clientState: thread.WhetherReport === 1,
    doAction: () => client.report(payload),
    failedText: "无法举报",
    doneComponent: (
      <>
        <FlagFill /> &nbsp; 已举报
      </>
    ),
    initialComponent: (
      <>
        <Flag /> &nbsp; 举报
      </>
    ),
  })

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
          <Box>
            {thread.Summary.split("\n").map((line, index) => (
              <Text mt={0} wordBreak="break-word" key={index}>
                {line}
              </Text>
            ))}
          </Box>
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
              {favourControl}
              {reportControl}
              <Button
                colorScheme="teal"
                size="xs"
                variant="outline"
                onClick={onReply}
              >
                <ReplyFill /> &nbsp; 回复
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Flex>
  )
}
