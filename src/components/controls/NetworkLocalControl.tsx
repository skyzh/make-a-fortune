import { Button } from "@chakra-ui/button"
import { useToast } from "@chakra-ui/toast"
import React from "react"
import { useState } from "react"
import { handleError } from "~/src/utils"

interface NetworkLocalControlProps {
  clientState: boolean
  doAction: Function
  cancelAction?: Function
  failedText: string
  doneComponent: any
  initialComponent: any
}

export default function useNetworkLocalControl({
  clientState,
  doAction,
  cancelAction,
  failedText,
  doneComponent,
  initialComponent,
}: NetworkLocalControlProps) {
  const [whetherAction, setWhetherAction] = useState<boolean>(null)
  const whetherActionCombined =
    whetherAction === null ? clientState : whetherAction
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false)
  const toast = useToast()

  const toggleState = async () => {
    setIsActionLoading(true)
    try {
      if (whetherActionCombined) {
        await cancelAction()
      } else {
        await doAction()
      }
      setWhetherAction(!whetherActionCombined)
    } catch (err) {
      handleError(toast, failedText, err)
    } finally {
      setIsActionLoading(false)
    }
  }

  return (
    <Button
      colorScheme="teal"
      size="xs"
      variant={whetherActionCombined ? "solid" : "outline"}
      onClick={toggleState}
      isLoading={isActionLoading}
      isDisabled={cancelAction == null && whetherActionCombined}
    >
      {whetherActionCombined ? doneComponent : initialComponent}
    </Button>
  )
}
