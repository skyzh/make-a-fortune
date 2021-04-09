import { Box, Collapse, Flex, Text } from "@chakra-ui/react"
import React from "react"

export function Content({ content }: { content: string }) {
  return (
    <Box>
      {content.split("\n").map((line, index) => (
        <Text mt={0} wordBreak="break-word" key={index}>
          {line}
        </Text>
      ))}
    </Box>
  )
}

export function CollapseContent({
  content,
  collapsed,
  minLines = "auto",
  maxLines = "auto",
}: {
  content: string
  collapsed: boolean
  minLines?: number | "auto"
  maxLines?: number | "min" | "auto"
}) {
  const minHeight = (minLines == "auto" ? 2 : minLines) * 24 + 2
  const maxHeight =
    maxLines == "min" ? minHeight : (maxLines == "auto" ? 4 : maxLines) * 24 + 2

  return (
    <Flex minHeight={`${minHeight}px`} maxHeight={`${maxHeight}px`}>
      <Collapse startingHeight={50} in={!collapsed} animateOpacity={false}>
        <Content content={content} />
      </Collapse>
    </Flex>
  )
}
