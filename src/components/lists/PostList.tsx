import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Stack,
  Switch,
  Text,
  useBoolean,
  useToast,
} from "@chakra-ui/react"
import { concat, range, uniqBy } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import { InView } from "react-intersection-observer"
import { useHistory, useLocation, useParams } from "react-router-dom"
import {
  LastSeenField,
  PostCategory,
  PostType,
  Thread,
  useClient,
} from "~/src/client"
import NoMore from "~/src/components/elements/NoMore"
import {
  ThreadComponent,
  ThreadSkeleton,
} from "~/src/components/elements/Thread"
import ScrollableContainer from "~/src/components/scaffolds/Scrollable"
import Refresh from "~/src/components/widgets/Refresh"
import { handleError, useThreadFilter } from "~/src/utils"
import {
  FORTUNE_HISTORY_KEY,
  FORTUNE_STAR_KEY,
  useFortuneLayoutSettings,
  useFortuneSettingsRead,
} from "~src/settings"
import { Search } from "../utils/Icons"
import { FortuneHistoryItem, FortuneStarItem } from "../utils/types"

interface ThreadListComponentProps {
  threadList?: Thread[]
  moreEntries: Function
  hasMore: boolean
  isMessage?: boolean
}

interface PostListComponentProps {
  postCategory: number
  postType: PostType
  lastSeenField: LastSeenField
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
      {threadList ? (
        <>
          {threadList?.map((thread) => (
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
  const [threadList, setThreadList] = useState<Thread[]>()
  const toast = useToast()
  const [hasMore, setHasMore] = useState(true)
  const [lastSeen, setLastSeen] = useState<string>()

  function doFetch(lastSeen?: string, previousThreads: Thread[] = []) {
    async function fetch() {
      const result = await client.fetchPost({
        postCategory,
        postType,
        lastSeen,
      })
      const toMerge =
        (isMessage ? result.message_list : result.thread_list) ?? []

      setThreadList(uniqBy(concat(previousThreads, toMerge), "ThreadID"))
      setLastSeen(result[lastSeenField])
      setHasMore((toMerge?.length ?? 0) !== 0)
    }
    fetch()
      .then()
      .catch((err) => handleError(toast, "无法获取帖子列表", err))
  }

  useEffect(() => {
    doFetch()
  }, [postCategory, postType, lastSeenField])

  const moreEntries = () => doFetch(lastSeen, threadList)

  const refresh = () => {
    setThreadList(undefined)
    doFetch()
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
  const { categoryId } = useParams<{ categoryId: string }>()

  return (
    <ScrollableContainer>
      <PostListComponent
        lastSeenField="LastSeenThreadID"
        postCategory={parseInt(categoryId)}
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
  const [enhancedEnabled, setEnhancedEnabled] = useBoolean()
  const settings = useFortuneSettingsRead()

  return (
    <ScrollableContainer>
      {settings.enhancedMode.enableStar && (
        <Flex width="100%" mb={3}>
          <Spacer />
          <Switch
            onChange={() => {
              setEnhancedEnabled.toggle()
            }}
            isChecked={enhancedEnabled}
          >
            按收藏时间排序
          </Switch>
        </Flex>
      )}
      {enhancedEnabled ? (
        <PostListEnhancedStar />
      ) : (
        <PostListComponent
          lastSeenField="LastSeenFavorThreadID"
          postCategory={PostCategory.All}
          postType={PostType.Favoured}
        />
      )}
    </ScrollableContainer>
  )
}

export function PostListEnhancedStar() {
  const threadList = useMemo<Thread[]>(() => {
    const historyItems: FortuneStarItem[] = JSON.parse(
      localStorage.getItem(FORTUNE_STAR_KEY) || "[]"
    )
    return historyItems.map((x) => x.thread)
  }, [])

  return (
    <ThreadListComponent
      threadList={threadList}
      hasMore={false}
      moreEntries={() => {}}
    />
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
  const [threadList, setThreadList] = useState<Thread[]>()
  const toast = useToast()
  const [hasMore, setHasMore] = useState(true)
  const [lastSeen, setLastSeen] = useState<string>()
  const keyword = useSearchKeyword().get("keyword")
  const [inputKeyword, setInputKeyword] = useState(keyword)
  const history = useHistory()

  function doFetch(lastSeen?: string, previousThreads: Thread[] = []) {
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
    doFetch()
  }, [keyword])

  const moreEntries = () => doFetch(lastSeen, threadList)

  const doSearch = (inputKeyword: string | null) => {
    history.replace(
      `/posts/search?keyword=${encodeURIComponent(inputKeyword ?? "")}`
    )
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
            value={inputKeyword ?? ""}
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
      {keyword && keyword !== "" ? (
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

export function PostListHistory() {
  const settings = useFortuneSettingsRead()

  const threadList = useMemo<Thread[]>(() => {
    const historyItems: FortuneHistoryItem[] = JSON.parse(
      localStorage.getItem(FORTUNE_HISTORY_KEY) || "[]"
    )
    return historyItems.map((x) => x.thread)
  }, [])

  return (
    <ScrollableContainer>
      {settings.enhancedMode.enableHistory ? (
        <ThreadListComponent
          threadList={threadList}
          hasMore={false}
          moreEntries={() => {}}
        />
      ) : (
        <Center>
          <Text>您没有启用历史记录功能。</Text>
        </Center>
      )}
    </ScrollableContainer>
  )
}
