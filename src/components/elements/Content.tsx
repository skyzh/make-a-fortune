import { Box, Collapse, Flex, Link, Text } from "@chakra-ui/react"
import React from "react"
// @ts-ignore as the library does not have a type definition
import processString from "react-process-string"
import { NavLink } from "react-router-dom"

let renderer = processString([
  {
    regex: /wkfg:\/\/\d{6}/gim,
    fn: (key: number, result: string[]) => {
      const postId = result[0].substring(7)
      return (
        <span key={key}>
          <Link color="teal.500" as={NavLink} to={`/posts/${postId}`}>
            #{postId}
          </Link>
        </span>
      )
    },
  },
  {
    regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key: number, result: string[]) => (
      <span key={key}>
        <Link
          color="teal.500"
          isExternal
          href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}
        >
          {result[2]}.{result[3]}
          {result[4]}
        </Link>
        {result[5]}
      </span>
    ),
  },
])

export function Content({ content }: { content: string }) {
  return (
    <Box>
      {content.split("\n").map((line, index) => (
        <Text mt={0} wordBreak="break-word" key={index}>
          {renderer(line)}
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
