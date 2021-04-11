import {
  Box,
  Divider,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  useToast,
} from "@chakra-ui/react"
import { concat, find, range } from "lodash"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { InView } from "react-intersection-observer"
import { useParams } from "react-router-dom"
import { Floor, ReplyOrder, Thread, useClient } from "~/src/client"
import { FloorComponent, FloorSkeleton } from "~/src/components/elements/Floor"
import NoMore from "~/src/components/elements/NoMore"
import ReplyModal from "~/src/components/elements/ReplyModal"
import {
  ThreadComponent,
  ThreadSkeleton,
} from "~/src/components/elements/Thread"
import ScrollableContainer from "~/src/components/scaffolds/Scrollable"
import GoBack from "~/src/components/widgets/GoBack"
import { handleError, sleep } from "~/src/utils"
import { addToHistory } from "~src/enhanced_control"
import { useFortuneLayoutSettings, useFortuneSettingsRead } from "~src/settings"
import { Callback, RequestFloor } from "../utils/types"

interface FloorListComponentProps {
  thread?: Thread
  floors?: Floor[]
  moreEntries: Function
  hasMore: boolean
  orderBy: any
  onReply: Function
  onPostReply: Callback
  requestFloor?: RequestFloor
}

export function OrderBy({
  value,
  setValue,
}: {
  value: ReplyOrder
  setValue: (v: ReplyOrder) => void
}) {
  return (
    <RadioGroup defaultValue="0" value={value} onChange={setValue}>
      <Stack spacing={4} direction="row">
        <Radio value="0">按时间</Radio>
        <Radio value="1">最新</Radio>
        <Radio value="-1">只看洞主</Radio>
        <Radio value="2">最热</Radio>
      </Stack>
    </RadioGroup>
  )
}

export function FloorListComponent({
  thread,
  floors,
  moreEntries,
  hasMore,
  orderBy,
  onReply,
  onPostReply,
  requestFloor,
}: FloorListComponentProps) {
  const layoutSettings = useFortuneLayoutSettings()

  return (
    <Stack spacing={layoutSettings.listSpacing} width="100%" mb="3">
      {thread ? (
        <ThreadComponent
          showPostTime
          thread={thread}
          showControl
          onReply={onPostReply}
        />
      ) : (
        <ThreadSkeleton showControl />
      )}
      <Divider />
      <Box p={1}>{thread ? orderBy : <Skeleton height="2rem" />}</Box>
      {thread && floors ? (
        <>
          {floors.map((floor) => (
            <Box key={floor.FloorID}>
              <FloorComponent
                floor={floor}
                theme={thread.AnonymousType}
                seed={thread.RandomSeed}
                threadId={thread.ThreadID}
                onReply={onReply}
                showControl
                allowExpand
                requestFloor={requestFloor}
              />
            </Box>
          ))}
          {hasMore ? (
            <InView
              as="div"
              onChange={(inView) => {
                if (inView) moreEntries()
              }}
            >
              <FloorSkeleton showControl />
            </InView>
          ) : (
            <NoMore />
          )}
        </>
      ) : (
        range(10).map((key) => (
          <Box key={key}>
            <FloorSkeleton showControl />
          </Box>
        ))
      )}
    </Stack>
  )
}

export function ThreadListComponent() {
  const client = useClient()
  let { postId } = useParams<{ postId: string }>()
  const [thread, setThread] = useState<Thread>()
  const [lastSeen, setLastSeen] = useState<string>()
  const [floors, setFloors] = useState<Floor[]>()
  const [hasMore, setHasMore] = useState(true)
  const toast = useToast()
  const [orderBy, setOrderBy] = useState<ReplyOrder>(ReplyOrder.Earliest)

  const allLastSeen = useRef<string>()
  const allFloors = useRef<Floor[]>()

  async function fetchContent(
    orderBy: ReplyOrder,
    lastSeen?: string,
    previousFloors?: Floor[],
    update: boolean = true // whether to update view state or `allXxx`
  ) {
    const result = await client.fetchReply({
      postId: postId,
      order: orderBy,
      lastSeen: lastSeen,
    })
    const newFloors = concat(previousFloors ?? [], result?.floor_list ?? [])
    const newLastSeen = result?.LastSeenFloorID ?? lastSeen
    const hasMore = (result?.floor_list.length ?? 0) !== 0

    if (update) {
      setThread(result?.this_thread)
      setLastSeen(newLastSeen)
      setFloors(newFloors)
      setHasMore(hasMore)
    } else if (orderBy == ReplyOrder.Earliest) {
      allFloors.current = newFloors
      allLastSeen.current = newLastSeen
    }

    return {
      thread: result?.this_thread,
      newFloors,
      newLastSeen,
      newHasMore: hasMore,
    }
  }

  async function requestFloor(requestId: string) {
    let currentLastSeen =
      orderBy === ReplyOrder.Host ? allLastSeen.current : lastSeen
    let currentFloors = orderBy === ReplyOrder.Host ? allFloors.current : floors

    while (true) {
      const floor = find(
        currentFloors,
        (floor: Floor) => floor.FloorID === requestId
      )
      if (floor) {
        return floor
      }
      const { newFloors, newLastSeen, newHasMore } = await fetchContent(
        orderBy !== ReplyOrder.Host ? orderBy : ReplyOrder.Earliest,
        currentLastSeen,
        currentFloors,
        orderBy !== ReplyOrder.Host
      )
      currentFloors = newFloors
      currentLastSeen = newLastSeen
      if (!newHasMore) {
        break
      }
      // add some delay before continuing resolving
      await sleep(200)
    }
    return null
  }

  function doFetch(
    orderBy: ReplyOrder,
    lastSeen?: string,
    previousFloors?: Floor[]
  ) {
    return fetchContent(orderBy, lastSeen, previousFloors)
      .then()
      .catch((err) => handleError(toast, "无法获取发帖信息", err))
  }

  const settings = useFortuneSettingsRead()

  useEffect(() => {
    fetchContent(orderBy)
      .then(({ thread }) => {
        if (settings.enhancedMode.enableHistory) {
          // Add thread to history
          //
          // We do not want to trigger rerender upon LocalStorage update,
          // so we directly read / write to localstorage instead of using
          // existing React Hooks
          if (thread) {
            addToHistory(thread)
          }
        }
      })
      .catch((err) => handleError(toast, "无法获取发帖信息", err))
  }, [postId])

  const moreEntries = () => doFetch(orderBy, lastSeen, floors)

  const [isReplyingFloor, setIsReplyingFloor] = useState<Floor>()
  const [isReplyingPost, setIsReplyingPost] = useState(false)
  const [isReplyInProgress, setIsReplyInProgress] = useState(false)

  const toFloorComponent = thread && isReplyingFloor && (
    <FloorComponent
      floor={isReplyingFloor}
      theme={thread.AnonymousType}
      seed={thread.RandomSeed}
      threadId={thread.ThreadID}
    />
  )

  const updateOrderBy = (orderBy: ReplyOrder) => {
    setOrderBy(orderBy)
    setFloors(undefined)
    doFetch(orderBy)
  }

  const onReply = (floor: Floor) => {
    setIsReplyingFloor(floor)
  }

  const onPostReply = () => {
    setIsReplyingPost(true)
  }

  const doReply = (replyContent: string) => {
    setIsReplyInProgress(true)

    let request
    if (isReplyingPost) {
      const payload = { postId: thread!.ThreadID, content: replyContent }
      request = client.replyPost(payload)
    } else {
      // reply to reply
      const payload = {
        postId: thread!.ThreadID,
        replyId: isReplyingFloor!.FloorID,
        content: replyContent,
      }
      request = client.replyReply(payload)
    }

    request
      .then(() => {
        setIsReplyingFloor(undefined)
        setIsReplyingPost(false)
        toast({
          title: "回复成功",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      })
      .catch((err) => handleError(toast, "发帖失败", err))
      .finally(() => {
        setIsReplyInProgress(false)
        updateOrderBy(ReplyOrder.Newest)
      })
  }

  const floorList = useMemo(
    () => (
      <FloorListComponent
        thread={thread}
        floors={floors}
        moreEntries={moreEntries}
        hasMore={hasMore}
        orderBy={<OrderBy value={orderBy} setValue={updateOrderBy} />}
        onReply={onReply}
        onPostReply={onPostReply}
        requestFloor={requestFloor}
      />
    ),
    [orderBy, hasMore, floors, thread]
  )

  return (
    <ScrollableContainer>
      <GoBack />
      <ReplyModal
        isOpen={!!isReplyingFloor || isReplyingPost}
        toFloor={toFloorComponent}
        onCancel={() => {
          setIsReplyingFloor(undefined)
          setIsReplyingPost(false)
        }}
        isLoading={isReplyInProgress}
        doReply={doReply}
      />
      {floorList}
    </ScrollableContainer>
  )
}

export default ThreadListComponent
