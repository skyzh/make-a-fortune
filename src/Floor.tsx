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
    <Box p={5} shadow="sm" borderWidth="1px" width="100%">
      <Stack spacing="3">
        <Skeleton height="1rem" />
        <Skeleton height="2rem" />
        <SkeletonText spacing="4" />
        <Skeleton height="1rem" />
      </Stack>
    </Box>
  )
}

export function FloorComponent({ floor, theme, seed }: FloorComponentProps) {
  return (
    <Box p={5} shadow="sm" borderWidth="1px" width="100%">
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
        <Text mt={4}>{floor.Context}</Text>
        <HStack spacing="10" justify="space-between" color="teal.500">
          <Text fontSize="sm">
            <HandThumbsUp /> {floor.Like - floor.Dislike}
          </Text>
        </HStack>
      </Stack>
    </Box>
  )
}
