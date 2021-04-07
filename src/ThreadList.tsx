import React from "react"
import { useEffect, useState } from "react"

import {
  Stack,
  Box,
  Heading,
  Text,
  HStack,
  Flex,
  Spacer,
  Badge,
  Spinner,
  Center,
} from "@chakra-ui/react"
import {
  useClient,
  PostType,
  PostCategory,
  Thread,
  ReplyOrder,
  Floor,
} from "./client"
import { HandThumbsUp, ChatSquareText, Flag, Broadcast } from "./Icons"
import * as moment from "moment"
import { useParams } from "react-router-dom"

interface FloorListComponentProps {
  thread?: Thread
  floors: Floor[]
}

export function FloorListComponent({
  thread,
  floors,
}: FloorListComponentProps) {
  return (
    <Stack spacing={3} width="100%" mb="3">
      {floors.length > 0 ? (
        floors.map((floor) => <Box key={floor.FloorId}>{floor.Context}</Box>)
      ) : (
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      )}
    </Stack>
  )
}

export function ThreadListComponent() {
  const client = useClient()
  let { postId } = useParams()
  const [floorList, setFloorList] = useState([])
  const [thread, setThread] = useState(null)
  useEffect(() => {
    async function fetch() {
      const result = await client.fetchReply({
        postId: postId,
        order: ReplyOrder.Earliest,
      })
      setThread(result.this_thread)
      setFloorList(result.floor_list)
    }
    fetch().then()
  }, [])

  return <FloorListComponent thread={thread} floors={floorList} />
}

export default ThreadListComponent
