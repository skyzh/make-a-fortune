import React from "react"
import { useEffect, useState } from "react"

import {
  Stack,
  Box,
  useToast,
  Divider,
  Select,
  Spacer,
  Flex,
} from "@chakra-ui/react"
import { useClient, Thread, ReplyOrder, Floor } from "~/src/client"
import { useParams } from "react-router-dom"
import { handleError } from "~/src/utils"
import {
  ThreadComponent,
  ThreadSkeleton,
} from "~/src/components/elements/Thread"
import { FloorComponent, FloorSkeleton } from "~/src/components/elements/Floor"
import { range, concat } from "lodash"
import { InView } from "react-intersection-observer"
import ScrollableContainer from "~/src/components/scaffolds/Scrollable"
import GoBack from "~/src/components/widgets/GoBack"
import NoMore from "~/src/components/elements/NoMore"
import ReplyModal from "~/src/components/elements/ReplyModal"

interface FloorListComponentProps {
  thread?: Thread
  floors?: Floor[]
  moreEntries: Function
  hasMore: boolean
  orderBy: any
  onReply: Function
  onPostReply: Function
}

export function OrderBy({ value, setValue }) {
  return (
    <Select value={value} onChange={(event) => setValue(event.target.value)}>
      <option value="0">按时间</option>
      <option value="1">最新</option>
      <option value="-1">只看洞主</option>
      <option value="2">最热</option>
    </Select>
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
}: FloorListComponentProps) {
  return (
    <Stack spacing={3} width="100%" mb="3">
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
      <Flex>
        <Spacer />
        <Box size="100px" p="3">
          {orderBy}
        </Box>
      </Flex>
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
              <FloorSkeleton />
            </InView>
          ) : (
            <NoMore />
          )}
        </>
      ) : (
        range(10).map((key) => (
          <Box key={key}>
            <FloorSkeleton />
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

  function doFetch(lastSeen, previousFloors, orderBy) {
    async function fetch() {
      const result = await client.fetchReply({
        postId: postId,
        order: orderBy,
        lastSeen: lastSeen,
      })
      setThread(result.this_thread)
      setLastSeen(result.LastSeenFloorID)
      setFloors(
        previousFloors
          ? concat(previousFloors, result.floor_list)
          : result.floor_list
      )
      setHasMore(result.floor_list.length !== 0)
    }

    fetch()
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
      />
    </ScrollableContainer>
  )
}

export default ThreadListComponent
