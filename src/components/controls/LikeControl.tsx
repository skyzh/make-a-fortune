import { Button, ButtonGroup, Text, useToast } from "@chakra-ui/react"
import React, { useState } from "react"
import {
  HandThumbsDown,
  HandThumbsDownFill,
  HandThumbsUp,
  HandThumbsUpFill,
} from "~/src/components/utils/Icons"
import { handleError } from "~/src/utils"
import { AsyncCallback } from "../utils/types"

export default function useLikeControl({
  clientWhetherLike,
  clientCurrentLike,
  onCancelLike,
  onLike,
  onCancelDislike,
  onDislike,
}: {
  clientWhetherLike: number
  clientCurrentLike: number
  onCancelLike: AsyncCallback
  onLike: AsyncCallback
  onCancelDislike: AsyncCallback
  onDislike: AsyncCallback
}) {
  const toast = useToast()

  const [whetherLike, setWhetherLike] = useState<number>()
  const whetherLikeCombined = whetherLike ?? clientWhetherLike
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
      setIsLikeLoading(true)
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
      setIsLikeLoading(true)
      onDislike()
        .then(() => setWhetherLike(-1))
        .catch((err) => handleError(toast, "无法点踩", err))
        .finally(() => setIsLikeLoading(false))
    }
  }

  return [
    <Text fontSize="sm">
      <HandThumbsUpFill />{" "}
      {clientCurrentLike + (whetherLike ? whetherLike - clientWhetherLike : 0)}
    </Text>,
    <ButtonGroup isAttached colorScheme="teal" size="xs">
      {whetherLikeCombined >= 0 && !isLikeLoading && (
        <Button
          mr="-px"
          isFullWidth
          variant={whetherLikeCombined === 1 ? "solid" : "outline"}
          onClick={toggleLikePost}
          isLoading={isLikeLoading}
        >
          {whetherLikeCombined === 1 && (
            <>
              {" "}
              <HandThumbsUpFill /> &nbsp;{" "}
            </>
          )}{" "}
          赞
        </Button>
      )}
      {whetherLikeCombined <= 0 && !isLikeLoading && (
        <Button
          isFullWidth
          variant={whetherLikeCombined === -1 ? "solid" : "outline"}
          onClick={toggleDislikePost}
          isLoading={isLikeLoading}
        >
          {whetherLikeCombined === -1 && (
            <>
              {" "}
              <HandThumbsDownFill /> &nbsp;{" "}
            </>
          )}{" "}
          踩
        </Button>
      )}
      {isLikeLoading && (
        <Button isFullWidth variant="solid" isLoading={isLikeLoading}></Button>
      )}
    </ButtonGroup>,
    <Text fontSize="sm">
      <span onClick={toggleLikePost}>
        {whetherLikeCombined === 1 ? <HandThumbsUpFill /> : <HandThumbsUp />}
      </span>
      &nbsp;
      {clientCurrentLike + (whetherLike ? whetherLike - clientWhetherLike : 0)}
      &nbsp;&nbsp;&nbsp;
      <span onClick={toggleDislikePost}>
        {whetherLikeCombined === -1 ? (
          <HandThumbsDownFill />
        ) : (
          <HandThumbsDown />
        )}
      </span>
    </Text>,
  ]
}
