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
import React, { useEffect, useState } from "react"
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
import { useFortuneLayoutSettings } from "~src/settings"

interface FloorListComponentProps {
  thread?: Thread
  floors?: Floor[]
  moreEntries: Function
  hasMore: boolean
  orderBy: any
  onReply: Function
  onPostReply: Function
  requestFloor?: Function
}

export function OrderBy({ value, setValue }) {
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
            // TS2322 caused by react-intersection-observer
            // @ts-ignore
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
  let { postId } = useParams()
  const [thread, setThread] = useState(null)
  const [lastSeen, setLastSeen] = useState(null)
  const [floors, setFloors] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const toast = useToast()
  const [orderBy, setOrderBy] = useState("0")

  async function fetchContent(lastSeen, previousFloors, orderBy) {
    const result = await client.fetchReply({
      postId: postId,
      order: orderBy,
      lastSeen: lastSeen,
    })
    const newFloors = previousFloors
      ? concat(previousFloors, result.floor_list)
      : result.floor_list
    const newLastSeen = result.LastSeenFloorID
    const hasMore = result.floor_list.length !== 0
    setThread(result.this_thread)
    setLastSeen(newLastSeen)
    setFloors(newFloors)
    setHasMore(hasMore)
    return { newFloors, newLastSeen, newHasMore: hasMore }
  }

  async function requestFloor(requestId) {
    let currentLastSeen = lastSeen
    let currentFloors = floors
    while (true) {
      const floor = find(
        currentFloors,
        (floor: Floor) => floor.FloorID === requestId
      )
      if (floor) {
        return floor
      }
      if (!hasMore) {
        return null
      }
      const { newFloors, newLastSeen, newHasMore } = await fetchContent(
        currentLastSeen,
        currentFloors,
        orderBy
      )
      currentFloors = newFloors
      currentLastSeen = newLastSeen
      if (!newHasMore) {
        break
      }
      // add some delay before continuing resolving
      await sleep(1000)
    }
    return null
  }

  function doFetch(lastSeen, previousFloors, orderBy) {
    fetchContent(lastSeen, previousFloors, orderBy)
      .then()
      .catch((err) => handleError(toast, "无法获取发帖信息", err))
  }

  useEffect(() => doFetch(null, null, orderBy), [postId])

  const moreEntries = () => doFetch(lastSeen, floors, orderBy)

  const [isReplyingFloor, setIsReplyingFloor] = useState(null)
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

  const updateOrderBy = (orderBy) => {
    setOrderBy(orderBy)
    setFloors(null)
    doFetch(null, null, orderBy)
  }

  const orderByComponent = <OrderBy value={orderBy} setValue={updateOrderBy} />

  const onReply = (floor) => {
    setIsReplyingFloor(floor)
  }

  const onPostReply = () => {
    setIsReplyingPost(true)
  }

  const doReply = (replyContent) => {
    setIsReplyInProgress(true)

    let request
    if (isReplyingPost) {
      const payload = { postId: thread.ThreadID, content: replyContent }
      request = client.replyPost(payload)
    } else {
      // reply to reply
      const payload = {
        postId: thread.ThreadID,
        replyId: isReplyingFloor.FloorID,
        content: replyContent,
      }
      request = client.replyReply(payload)
    }

    request
      .then(() => {
        setIsReplyingFloor(null)
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

  return (
    <ScrollableContainer>
      <GoBack />
      <ReplyModal
        isOpen={isReplyingFloor !== null || isReplyingPost}
        toFloor={toFloorComponent}
        onCancel={() => {
          setIsReplyingFloor(null)
          setIsReplyingPost(false)
        }}
        isLoading={isReplyInProgress}
        doReply={doReply}
      />
      <FloorListComponent
        thread={thread}
        floors={floors}
        moreEntries={moreEntries}
        hasMore={hasMore}
        orderBy={orderByComponent}
        onReply={onReply}
        onPostReply={onPostReply}
        requestFloor={requestFloor}
      />
    </ScrollableContainer>
  )
}

export default ThreadListComponent
