import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { flow, sumBy } from "lodash"
import React, { useState } from "react"
import { Callback } from "../utils/types"

function ReplyModal({
  isOpen,
  toFloor,
  onCancel,
  doReply,
  isLoading,
}: {
  isOpen: boolean
  toFloor?: React.ReactNode
  onCancel: Callback
  doReply: (s: string) => void
  isLoading: boolean
}) {
  const [replyContent, setReplyContent] = useState("")
  const lines =
    sumBy(
      replyContent,
      flow((x) => x === "\n", Number)
    ) + 1
  const characters = replyContent.length
  const maxLines = 20
  const maxCharacters = 817
  const validate = () =>
    lines <= maxLines && characters <= maxCharacters && characters > 0
  return (
    <>
      <Modal isOpen={isOpen} isCentered onClose={onCancel} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>回复</ModalHeader>
          <ModalBody>
            <Stack spacing="3">
              {!!toFloor && toFloor}
              <Textarea
                value={replyContent}
                onChange={(event) => setReplyContent(event.target.value)}
                rows={8}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing="2" width="100%">
              <Text color="gray.500">
                {lines}/{maxLines} 行
              </Text>
              <Text color="gray.500">
                {characters}/{maxCharacters} 字
              </Text>
              <Spacer />
              <Button onClick={onCancel}>取消</Button>
              <Button
                colorScheme="blue"
                onClick={() => doReply(replyContent)}
                disabled={!validate()}
                isLoading={isLoading}
              >
                回复
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ReplyModal
