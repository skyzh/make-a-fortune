import { Avatar, Box, HStack, Stack, Text } from "@chakra-ui/react"
import React from "react"
import { generateName, NameTheme } from "~src/name_theme"

interface ThemeAvatarProps {
  theme: NameTheme
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
        <Avatar size="sm" name={name} showBorder={true} />
      </Box>
      <Stack fontWeight="bold" spacing={-2}>
        {floorId && (
          <Text color="gray.500" fontSize="xs">
            #{floorId}
          </Text>
        )}
        <Text fontSize="sm">
          {name} {showIsPoster && id === 0 && " (洞主)"}
        </Text>
      </Stack>
    </HStack>
  )
}
