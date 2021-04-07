import React from "react"
import { useEffect, useState } from "react"

import {
  Stack,
  Box,
  Text,
  HStack,
  Flex,
  Spacer,
  Badge,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react"
import { Floor } from "./client"
import { ArrowRight, HandThumbsUp, ReplyFill } from "./Icons"
import * as moment from "moment"
import { generateName } from "./name_theme"

interface FloorComponentProps {
  floor: Floor
  key?: string
  showPostTime?: boolean
  theme: string
  seed: number
}

export function FloorSkeleton() {
  return (
    <Flex width="100%">
      <Box flex="1" p={5} shadow="sm" borderWidth="1px" borderRadius="md">
        <Stack spacing="3">
          <Skeleton height="1rem" />
          <SkeletonText spacing="4" />
        </Stack>
      </Box>
      <Box size="80px" p="3">
        <Stack color="teal.500" width="80px">
          <Text fontSize="sm">
            <HandThumbsUp />
          </Text>
        </Stack>
      </Box>
    </Flex>
  )
}

export function FloorComponent({ floor, theme, seed }: FloorComponentProps) {
  return (
    <Flex width="100%">
      <Box flex="1" p={5} shadow="sm" borderWidth="1px" borderRadius="md">
        <Stack spacing="3">
          <Flex>
            <Text fontSize="sm" mr="2">
              <Badge colorScheme="gray"># {floor.FloorID}</Badge>
            </Text>
            <Text fontSize="sm" mr="2" fontWeight="bold">
              {generateName(theme, seed, parseInt(floor.Speakername))}
            </Text>
            {floor.Replytofloor != 0 && (
              <>
                <Text fontSize="sm" mr="2" fontWeight="bold">
                  <ArrowRight />
                </Text>
                <Text fontSize="sm" mr="2" fontWeight="bold">
                  <Badge colorScheme="gray" mx="1">
                    # {floor.Replytofloor}
                  </Badge>
                  {generateName(theme, seed, parseInt(floor.Replytoname))}
                </Text>
              </>
            )}
            <Spacer />
            <Text fontSize="sm">{moment(floor.RTime).calendar()}</Text>
          </Flex>
          <Text mt={4} wordBreak="break-word">
            {floor.Context}
          </Text>
        </Stack>
      </Box>
      <Box size="80px" p="3">
        <Stack color="teal.500" width="80px">
          <Text fontSize="sm">
            <HandThumbsUp /> {floor.Like - floor.Dislike}
          </Text>
        </Stack>
      </Box>
    </Flex>
  )
}
