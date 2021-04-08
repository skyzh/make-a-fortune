import React from "react"
import { useEffect, useState } from "react"

import { Stack, Box, useToast, Divider } from "@chakra-ui/react"
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

interface FloorListComponentProps {
  thread?: Thread
  floors?: Floor[]
  moreEntries: Function
  hasMore: boolean
}

export function FloorListComponent({
  thread,
  floors,
  moreEntries,
  hasMore,
}: FloorListComponentProps) {
  return (
    <Stack spacing={3} width="100%" mb="3">
      {thread ? (
        <ThreadComponent showPostTime thread={thread} showControl />
      ) : (
        <ThreadSkeleton showControl />
      )}
      <Divider />
      {thread && floors ? (
        <>
          {floors.map((floor) => (
            <Box key={floor.FloorID}>
              <FloorComponent
                floor={floor}
                theme={thread.AnonymousType}
                seed={thread.RandomSeed}
                threadId={thread.ThreadID}
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

  function doFetch(lastSeen, previousFloors) {
    async function fetch() {
      const result = await client.fetchReply({
        postId: postId,
        order: ReplyOrder.Earliest,
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

  useEffect(() => doFetch(null, null), [postId])

  const moreEntries = () => doFetch(lastSeen, floors)

  return (
    <ScrollableContainer>
      <GoBack />
      <FloorListComponent
        thread={thread}
        floors={floors}
        moreEntries={moreEntries}
        hasMore={hasMore}
      />
    </ScrollableContainer>
  )
}

export default ThreadListComponent
