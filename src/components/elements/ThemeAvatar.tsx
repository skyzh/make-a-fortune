import { Avatar, Box, HStack, Text } from "@chakra-ui/react"
import React from "react"
import { generateName } from "~src/name_theme"

interface ThemeAvatarProps {
  theme: string
  seed: number
  id: number
  showIsPoster?: boolean
  floorId?: number
}
export default function ThemeAvatar({
  theme,
  seed,
  id,
  showIsPoster,
  floorId,
}: ThemeAvatarProps) {
  const name = generateName(theme, seed, id)
  return (
    <HStack alignItems="center">
      <Box my={-1} ml={1} mr={-1}>
        <Avatar size="xs" name={name} />
      </Box>
      <HStack fontSize="sm" fontWeight="bold" spacing="1">
        {floorId && <Text color="gray.500">#{floorId}</Text>}
        <Text>
          {name} {showIsPoster && id === 0 && " (洞主)"}
        </Text>
      </HStack>
    </HStack>
  )
}
