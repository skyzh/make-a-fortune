import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from "@chakra-ui/react"
import { concat, range, uniqBy } from "lodash"
import React, { useEffect, useState } from "react"
import { InView } from "react-intersection-observer"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { PostCategory, PostType, Thread, useClient } from "~/src/client"
import NoMore from "~/src/components/elements/NoMore"
import {
  ThreadComponent,
  ThreadSkeleton,
} from "~/src/components/elements/Thread"
import ScrollableContainer from "~/src/components/scaffolds/Scrollable"
import Refresh from "~/src/components/widgets/Refresh"
import { handleError, useThreadFilter } from "~/src/utils"
import { useFortuneLayoutSettings } from "~src/settings"
import { Search } from "../utils/Icons"

interface ThreadListComponentProps {
  threadList?: Thread[]
  moreEntries: Function
  hasMore: boolean
  isMessage?: boolean
}

interface PostListComponentProps {
  postCategory: number
  postType: PostType
  lastSeenField?: string
  isMessage?: boolean
}

function ThreadListComponent({
  threadList,
  moreEntries,
  hasMore,
  isMessage,
}: ThreadListComponentProps) {
  const history = useHistory()
  const layoutSettings = useFortuneLayoutSettings()

  return (
    <Stack spacing={layoutSettings.listSpacing} width="100%" mb="3">
      {threadList !== null ? (
        <>
          {threadList.map((thread) => (
            <Box
              key={thread.ThreadID}
              onClick={() => history.push(`/posts/${thread.ThreadID}`)}
              cursor="pointer"
            >
              <ThreadComponent
                thread={thread}
                onReply={() => {}}
                isMessage={isMessage}
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
}: PostListComponentProps) {
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

  const finalThreadList = useThreadFilter(threadList)

  return (
    <>
      <Refresh onClick={refresh} />
      <ThreadListComponent
        threadList={finalThreadList}
        moreEntries={moreEntries}
        hasMore={hasMore}
        isMessage={isMessage}
      />
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

export function PostListCategory() {
  const { categoryId } = useParams()

  return (
    <ScrollableContainer key={categoryId}>
      <PostListComponent
        lastSeenField="LastSeenThreadID"
        postCategory={categoryId}
        postType={PostType.Time}
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
        isMessage
        postCategory={PostCategory.All}
        postType={PostType.Message}
      />
    </ScrollableContainer>
  )
}

function useSearchKeyword() {
  return new URLSearchParams(useLocation().search)
}

export function PostListSearch() {
  const client = useClient()
  const [threadList, setThreadList] = useState(null)
  const toast = useToast()
  const [hasMore, setHasMore] = useState(true)
  const [lastSeen, setLastSeen] = useState(null)
  const keyword = useSearchKeyword().get("keyword")
  const [inputKeyword, setInputKeyword] = useState(keyword)
  const history = useHistory()

  function doFetch(lastSeen, previousThreads) {
    async function fetch() {
      if (!keyword) return
      const result = await client.search({
        lastSeen,
        keyword,
      })

      const toMerge = result.thread_list

      setThreadList(
        previousThreads
          ? uniqBy(concat(previousThreads, toMerge), "ThreadID")
          : toMerge
      )
      setLastSeen(result["LastSeenQueryThreadID"])
      setHasMore(toMerge.length !== 0)
    }
    fetch()
      .then()
      .catch((err) => handleError(toast, "无法搜索帖子", err))
  }

  useEffect(() => {
    doFetch(null, null)
  }, [keyword])

  const moreEntries = () => doFetch(lastSeen, threadList)

  const doSearch = (inputKeyword) => {
    history.replace(`/posts/search?keyword=${encodeURIComponent(inputKeyword)}`)
  }

  const finalThreadList = useThreadFilter(threadList)

  return (
    <ScrollableContainer>
      <HStack spacing={4} width="100%" mb="3">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search />
          </InputLeftElement>
          <Input
            placeholder="搜点什么？"
            value={inputKeyword || ""}
            onChange={(event) => setInputKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") doSearch(inputKeyword)
            }}
          />
        </InputGroup>
        <Button
          colorScheme="teal"
          onClick={() => doSearch(inputKeyword)}
          width="100px"
        >
          搜索
        </Button>
      </HStack>
      {keyword !== "" && keyword !== null ? (
        <ThreadListComponent
          threadList={finalThreadList}
          moreEntries={moreEntries}
          hasMore={hasMore}
        />
      ) : (
        <NoMore />
      )}
    </ScrollableContainer>
  )
}
