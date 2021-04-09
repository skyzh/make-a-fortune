import React from "react"
import { Box, Text, Flex, Collapse } from "@chakra-ui/react"

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
  minLines = 2,
  maxLines = 4,
}: {
  content: string
  collapsed: boolean
  minLines?: number
  maxLines?: number
}) {
  maxLines = maxLines ?? minLines;

  return (
    <Flex minHeight={`${minLines * 25}px`} maxHeight={`${maxLines * 25}px`}>
      <Collapse startingHeight={50} in={!collapsed} animateOpacity={false}>
        <Content content={content} />
      </Collapse>
    </Flex>
  )
}
