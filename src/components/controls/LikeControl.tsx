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

export default function useLikeControl({
  clientWhetherLike,
  clientCurrentLike,
  onCancelLike,
  onLike,
  onCancelDislike,
  onDislike,
}) {
  const toast = useToast()

  const [whetherLike, setWhetherLike] = useState<boolean>(null)
  const whetherLikeCombined =
    whetherLike === null ? clientWhetherLike : whetherLike
  const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false)

  const toggleLikePost = () => {
    if (whetherLikeCombined === 1) {
      setIsLikeLoading(true)
      onCancelLike()
        .then(() => setWhetherLike(0))
        .catch((err) => handleError(toast, "无法取消点赞", err))
        .finally(() => setIsLikeLoading(false))
    }
    if (whetherLikeCombined === 0) {
      onLike()
        .then(() => setWhetherLike(1))
        .catch((err) => handleError(toast, "无法点赞", err))
        .finally(() => setIsLikeLoading(false))
    }
  }

  const toggleDislikePost = () => {
    if (whetherLikeCombined === -1) {
      setIsLikeLoading(true)
      onCancelDislike()
        .then(() => setWhetherLike(0))
        .catch((err) => handleError(toast, "无法取消点踩", err))
        .finally(() => setIsLikeLoading(false))
    }
    if (whetherLikeCombined === 0) {
      onDislike()
        .then(() => setWhetherLike(-1))
        .catch((err) => handleError(toast, "无法点踩", err))
        .finally(() => setIsLikeLoading(false))
    }
  }

  return [
    <Text fontSize="sm">
      <HandThumbsUp />{" "}
      {clientCurrentLike +
        (whetherLike !== null ? whetherLike - clientWhetherLike : 0)}
    </Text>,
    <ButtonGroup isAttached colorScheme="teal" size="xs">
      <Button
        mr="-px"
        isFullWidth
        variant={whetherLikeCombined === 1 ? "solid" : "outline"}
        isDisabled={whetherLikeCombined === -1}
        onClick={toggleLikePost}
        isLoading={isLikeLoading}
      >
        赞
      </Button>
      <Button
        isFullWidth
        variant={whetherLikeCombined === -1 ? "solid" : "outline"}
        isDisabled={whetherLikeCombined === 1}
        onClick={toggleDislikePost}
        isLoading={isLikeLoading}
      >
        踩
      </Button>
    </ButtonGroup>,
  ]
}
