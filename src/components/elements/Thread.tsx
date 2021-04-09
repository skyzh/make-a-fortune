import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Skeleton,
  SkeletonText,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react"
import * as moment from "moment"
import React from "react"
import { Thread, useClient } from "~/src/client"
import useLikeControl from "~/src/components/controls/LikeControl"
import {
  Broadcast,
  ChatSquareText,
  Flag,
  FlagFill,
  HandThumbsUpFill,
  ReplyFill,
  Star,
  StarFill,
} from "~/src/components/utils/Icons"
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
      <Box size="80px" p="3" display={{ base: "none", sm: "unset" }}>
        <Stack color="teal.500" width="80px">
          <Text fontSize="sm">
            <HandThumbsUpFill />
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
          <Text mt={4} wordBreak="break-word">
            {thread.Summary}
          </Text>

          <Box display={{ base: "block", sm: "none" }}>
            <Stack color="teal.500">
              <HStack justifyContent="space-between">
                {likeTextControl}
                <HStack>
                  <Text fontSize="sm">
                    <ChatSquareText /> {thread.Comment}
                  </Text>
                  <Text fontSize="sm">
                    <Broadcast /> {thread.Read}
                  </Text>
                </HStack>
              </HStack>

              {showControl && (
                <HStack justifyContent="space-between">
                  {likeButtonControl}
                  <HStack>
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
                  </HStack>
                </HStack>
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Box size="80px" p="3" display={{ base: "none", sm: "unset" }}>
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
