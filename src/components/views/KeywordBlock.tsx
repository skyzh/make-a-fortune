import {
  Box,
  Button,
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react"
import React, { useState } from "react"

function KeywordItem({ keyword, onDelete }) {
  return (
    <HStack>
      <Text>{keyword}</Text>
      <Spacer />
      <Button
        colorScheme="red"
        aria-label="delete"
        size="sm"
        variant="ghost"
        onClick={onDelete}
      >
        移除
      </Button>
    </HStack>
  )
}

export default function KeywordBlock({ keywords, addKeyword, deleteKeyword }) {
  const [pendingKeyword, setPendingKeyword] = useState("")

  const addOnce = () => {
    addKeyword(pendingKeyword)
    setPendingKeyword("")
  }
  return (
    <Box>
      <Stack spacing="1">
        {keywords.map((keyword) => (
          <KeywordItem
            key={keyword}
            keyword={keyword}
            onDelete={() => deleteKeyword(keyword)}
          />
        ))}
        <HStack>
          <Input
            value={pendingKeyword}
            onChange={(event) => setPendingKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addOnce()
            }}
          />
          <Spacer />
          <Button onClick={addOnce}>添加</Button>
        </HStack>
      </Stack>
    </Box>
  )
}
