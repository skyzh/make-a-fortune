import React from "react"
import { useState } from "react"

import {
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalHeader,
  HStack,
  Stack,
  Textarea,
  Text,
  Spacer,
} from "@chakra-ui/react"
import { sumBy, flow } from "lodash"

function ReplyModal({ isOpen, toFloor, onCancel, doReply, isLoading }) {
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
      <Modal isOpen={isOpen} isCentered onClose={onCancel} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>回复</ModalHeader>
          <ModalBody>
            <Stack spacing="3">
              {!!toFloor && toFloor}
              <Textarea
                value={replyContent}
                onChange={(event) => setReplyContent(event.target.value)}
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
