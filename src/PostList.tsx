import React from "react"
import { useEffect, useState } from "react"

import { Stack, Box, useToast } from "@chakra-ui/react"
import { useHistory } from "react-router-dom"
import { useClient, PostType, PostCategory, Thread } from "./client"
import { handleError } from "./utils"
import { concat, range, uniqBy } from "lodash"
import { ThreadComponent, ThreadSkeleton } from "./Thread"
import Refresh from "./Refresh"
import { InView } from "react-intersection-observer"
import ScrollableContainer from "./Scrollable"
import NoMore from "./NoMore"

interface ThreadListComponentProps {
  threadList?: Thread[]
  moreEntries: Function
  hasMore: boolean
}

function ThreadListComponent({
  threadList,
  moreEntries,
  hasMore,
}: ThreadListComponentProps) {
  const history = useHistory()
  return (
    <Stack spacing={3} width="100%" mb="3">
      {threadList ? (
        <>
          {threadList.map((thread) => (
            <Box
              key={thread.ThreadID}
              onClick={() => history.push(`/posts/${thread.ThreadID}`)}
              cursor="pointer"
            >
              <ThreadComponent thread={thread} />
            </Box>
          ))}
          {hasMore ? (
            <InView
              as="div"
              onChange={(inView) => {
                if (inView) moreEntries()
              }}
            >
              <ThreadSkeleton />
            </InView>
          ) : (
            <NoMore />
          )}
        </>
      ) : (
        range(10).map((key) => (
          <Box key={key}>
            <ThreadSkeleton />
          </Box>
        ))
      )}
    </Stack>
  )
}

export function PostListComponent({
  postCategory,
  postType,
  lastSeenField,
  isMessage,
}) {
  const client = useClient()
  const [threadList, setThreadList] = useState(null)
  const toast = useToast()
  const [hasMore, setHasMore] = useState(true)
  const [lastSeen, setLastSeen] = useState(null)

  function doFetch(lastSeen, previousThreads) {
    async function fetch() {
      const result = await client.fetchPost({
        postCategory,
        postType,
        lastSeen,
      })
      const toMerge = isMessage ? result.message_list : result.thread_list

      setThreadList(
        previousThreads
          ? uniqBy(concat(previousThreads, toMerge), "ThreadID")
          : toMerge
      )
      setLastSeen(result[lastSeenField])
      setHasMore(toMerge.length !== 0)
    }
    fetch()
      .then()
      .catch((err) => handleError(toast, "无法获取帖子列表", err))
  }

  useEffect(() => {
    doFetch(null, null)
  }, [postCategory, postType, lastSeenField])

  const moreEntries = () => doFetch(lastSeen, threadList)

  const refresh = () => {
    setThreadList(null)
    doFetch(null, null)
  }

  return (
    <>
      <Refresh onClick={refresh} />
      <ThreadListComponent
        threadList={threadList}
        moreEntries={moreEntries}
        hasMore={hasMore}
      ></ThreadListComponent>
    </>
  )
}

export function PostListTime() {
  return (
    <ScrollableContainer>
      <PostListComponent
        lastSeenField="LastSeenThreadID"
        postCategory={PostCategory.All}
        postType={PostType.Time}
      />
    </ScrollableContainer>
  )
}

export function PostListTrend() {
  return (
    <ScrollableContainer>
      <PostListComponent
        lastSeenField="LastSeenHotThreadID"
        postCategory={PostCategory.All}
        postType={PostType.Trending}
      />
    </ScrollableContainer>
  )
}

export function PostListMy() {
  return (
    <ScrollableContainer>
      <PostListComponent
        lastSeenField="LastSeenMyThreadID"
        postCategory={PostCategory.All}
        postType={PostType.My}
      />
    </ScrollableContainer>
  )
}

export function PostListStar() {
  return (
    <ScrollableContainer>
      <PostListComponent
        lastSeenField="LastSeenFavorThreadID"
        postCategory={PostCategory.All}
        postType={PostType.Favoured}
      />
    </ScrollableContainer>
  )
}

export function PostListNotification() {
  return (
    <ScrollableContainer>
      <PostListComponent
        lastSeenField="LastSeenMessageThreadID"
        isMessage={true}
        postCategory={PostCategory.All}
        postType={PostType.Message}
      />
    </ScrollableContainer>
  )
}
