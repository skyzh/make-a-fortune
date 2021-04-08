import React from "react"
import { useEffect, useState } from "react"

import {
  Stack,
  Box,
  Text,
  ButtonGroup,
  Button,
  Flex,
  Spacer,
  Badge,
  Skeleton,
  SkeletonText,
  HStack,
} from "@chakra-ui/react"
import { Floor, useClient } from "~/src/client"
import {
  HandThumbsUp,
  ArrowRight,
  Flag,
  Broadcast,
  ReplyFill,
} from "~/src/components/utils/Icons"
import * as moment from "moment"
import { generateName } from "~/src/name_theme"
import useLikeControl from "~/src/components/controls/LikeControl"

interface FloorComponentProps {
  floor: Floor
  key?: string
  showPostTime?: boolean
  theme: string
  seed: number
  threadId: string
}

export function FloorSkeleton() {
  return (
    <Flex width="100%">
      <Box flex="1" p={5} shadow="sm" borderWidth="1px" borderRadius="md">
        <Stack spacing="3">
          <Skeleton height="1rem" />
          <SkeletonText spacing="4" />
        </Stack>
      </Box>
      <Box size="80px" p="3">
        <Stack color="teal.500" width="80px">
          <Text fontSize="sm">
            <HandThumbsUp />
          </Text>
        </Stack>
      </Box>
    </Flex>
  )
}

export function FloorComponent({
  floor,
  theme,
  seed,
  threadId,
}: FloorComponentProps) {
  const client = useClient()
  const payload = { postId: threadId, replyId: floor.FloorID }
  const [likeTextControl, likeButtonControl] = useLikeControl({
    clientWhetherLike: floor.WhetherLike,
    clientCurrentLike: floor.Like - floor.Dislike,
    onCancelLike: () => client.cancelLikeReply(payload),
    onLike: () => client.likeReply(payload),
    onCancelDislike: () => client.cancelDislikeReply(payload),
    onDislike: () => client.dislikeReply(payload),
  })

  return (
    <Flex width="100%">
      <Box flex="1" p={5} shadow="sm" borderWidth="1px" borderRadius="md">
        <Stack spacing="3">
          <Flex>
            <Text fontSize="sm" mr="2">
              <Badge colorScheme="gray"># {floor.FloorID}</Badge>
            </Text>
            <Text fontSize="sm" mr="2" fontWeight="bold">
              {generateName(theme, seed, parseInt(floor.Speakername))}
            </Text>
            {floor.Replytofloor !== 0 && (
              <>
                <Text fontSize="sm" mr="2" fontWeight="bold">
                  <ArrowRight />
                </Text>
                <Text fontSize="sm" mr="2" fontWeight="bold">
                  <Badge colorScheme="gray" mx="1">
                    # {floor.Replytofloor}
                  </Badge>
                  {generateName(theme, seed, parseInt(floor.Replytoname))}
                </Text>
              </>
            )}
            <Spacer />
            <Text fontSize="sm">{moment(floor.RTime).calendar()}</Text>
          </Flex>
          <Text mt={4} wordBreak="break-word">
            {floor.Context}
          </Text>
        </Stack>
      </Box>
      <Box size="80px" p="3">
        <Stack color="teal.500" width="80px">
          {likeTextControl}
          {likeButtonControl}
          <Button colorScheme="teal" size="xs" variant="outline">
            <Flag /> &nbsp; 举报
          </Button>
          <Button colorScheme="teal" size="xs" variant="outline">
            <ReplyFill /> &nbsp; 回复
          </Button>
        </Stack>
      </Box>
    </Flex>
  )
}
