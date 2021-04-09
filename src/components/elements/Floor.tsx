import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import * as moment from "moment"
import React, { useState } from "react"
import { Floor, useClient } from "~/src/client"
import useLikeControl from "~/src/components/controls/LikeControl"
import {
  ArrowRight,
  ArrowsExpand,
  Flag,
  FlagFill,
  HandThumbsUpFill,
  ReplyFill,
} from "~/src/components/utils/Icons"
import { generateName } from "~/src/name_theme"
import { useFortuneLayoutSettings } from "~src/settings"
import { handleError } from "~src/utils"
import useNetworkLocalControl from "../controls/NetworkLocalControl"
import { Content } from "./Content"

interface FloorComponentProps {
  floor: Floor
  key?: string
  theme: string
  seed: number
  threadId: string
  showControl?: boolean
  onReply?: Function
  allowExpand?: boolean
  requestFloor?: Function
}

export function FloorSkeleton({ showControl }) {
  const layoutSettings = useFortuneLayoutSettings()

  return (
    <Flex width="100%">
      <Box
        flex="1"
        p={layoutSettings.cardMargin}
        shadow="sm"
        borderWidth="1px"
        borderRadius="md"
      >
        <Stack spacing={layoutSettings.cardSpacing}>
          <Skeleton height="1rem" />
          <SkeletonText spacing="4" />
        </Stack>
      </Box>
      <Box
        size="80px"
        p={layoutSettings.controlMargin}
        display={{ base: "none", sm: "unset" }}
      >
        <Stack
          color="teal.500"
          width="80px"
          spacing={layoutSettings.controlSpacing}
        >
          <Text fontSize="sm">
            <HandThumbsUpFill />
          </Text>
          {showControl && (
            <>
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

export function FloorComponent({
  floor,
  theme,
  seed,
  threadId,
  showControl,
  onReply,
  allowExpand,
  requestFloor,
}: FloorComponentProps) {
  const client = useClient()
  const payload = { postId: threadId, replyId: floor.FloorID }
  const [
    likeTextControl,
    likeButtonControl,
    likeTextButtonControl,
  ] = useLikeControl({
    clientWhetherLike: floor.WhetherLike,
    clientCurrentLike: floor.Like - floor.Dislike,
    onCancelLike: () => client.cancelLikeReply(payload),
    onLike: () => client.likeReply(payload),
    onCancelDislike: () => client.cancelDislikeReply(payload),
    onDislike: () => client.dislikeReply(payload),
  })

  const reportControl = useNetworkLocalControl({
    clientState: floor.WhetherReport === 1,
    doAction: () => client.reportReply(payload),
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
    confirmComponent: <>确认举报</>,
    confirm: true,
  })

  const [stackedFloor, setStackedFloor] = useState(null)
  const [isExpanding, setIsExpanding] = useState(false)

  const toast = useToast()

  const layoutSettings = useFortuneLayoutSettings()

  const doExpand = () => {
    setIsExpanding(true)
    requestFloor(floor.Replytofloor.toString())
      .then((newFloor) => {
        if (!newFloor) {
          toast({
            title: `无法展开第 ${floor.Replytofloor} 楼`,
            description: "请稍候重试",
            isClosable: true,
            duration: 5000,
            status: "warning",
          })
          return
        }
        setStackedFloor(newFloor)
      })
      .catch((err) => handleError(toast, "无法展开回复", err))
      .finally(() => setIsExpanding(false))
  }

  return (
    <Flex width="100%">
      <Box
        flex="1"
        p={layoutSettings.cardMargin}
        shadow="sm"
        borderWidth="1px"
        borderRadius="md"
      >
        <Stack spacing={layoutSettings.cardSpacing}>
          {stackedFloor && allowExpand && (
            <Box
              mx={-layoutSettings.cardMargin + 1}
              mt={-layoutSettings.cardMargin + 1}
            >
              <FloorComponent
                floor={stackedFloor}
                theme={theme}
                seed={seed}
                threadId={threadId}
                allowExpand={allowExpand}
                requestFloor={requestFloor}
              />
            </Box>
          )}
          <Flex>
            <Text fontSize="sm" mr="2">
              <Badge colorScheme="gray"># {floor.FloorID}</Badge>
            </Text>
            <Text fontSize="sm" mr="2" fontWeight="bold">
              {generateName(theme, seed, parseInt(floor.Speakername))}
              {floor.Speakername === "0" && " (洞主)"}
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
                  {floor.Replytoname === "0" && " (洞主)"}
                </Text>
                {allowExpand && !stackedFloor && (
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="teal"
                    isLoading={isExpanding}
                    onClick={doExpand}
                  >
                    <ArrowsExpand />
                  </Button>
                )}
              </>
            )}
            <Spacer />
            <Text fontSize="sm" color="gray.500">
              {moment(floor.RTime).calendar()}
            </Text>
          </Flex>
          <Content content={floor.Context} />
        </Stack>

        {showControl && (
          <Box display={{ base: "block", sm: "none" }} paddingTop={3}>
            <Stack color="teal.500">
              <HStack justifyContent="space-between">
                {likeTextButtonControl}
                <HStack>
                  {reportControl}
                  <Button
                    colorScheme="teal"
                    size="xs"
                    variant="outline"
                    onClick={() => onReply(floor)}
                  >
                    <ReplyFill /> &nbsp; 回复
                  </Button>
                </HStack>
              </HStack>
            </Stack>
          </Box>
        )}
      </Box>
      {showControl && (
        <Box
          size="80px"
          p={layoutSettings.controlMargin}
          display={{ base: "none", sm: "unset" }}
          height="100%"
        >
          <Stack
            color="teal.500"
            width="80px"
            spacing={layoutSettings.controlSpacing}
          >
            {likeTextControl}
            {likeButtonControl}
            {reportControl}
            <Button
              colorScheme="teal"
              size="xs"
              variant="outline"
              onClick={() => onReply(floor)}
            >
              <ReplyFill /> &nbsp; 回复
            </Button>
          </Stack>
        </Box>
      )}
    </Flex>
  )
}
