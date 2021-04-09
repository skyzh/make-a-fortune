import { Button } from "@chakra-ui/button"
import { useToast } from "@chakra-ui/toast"
import React, { useState } from "react"
import { handleError } from "~/src/utils"

interface NetworkLocalControlProps {
  clientState: boolean
  doAction: Function
  cancelAction?: Function
  failedText: string
  doneComponent: any
  initialComponent: any
  confirm?: boolean
  confirmComponent?: any
}

export default function useNetworkLocalControl({
  clientState,
  doAction,
  cancelAction,
  failedText,
  doneComponent,
  initialComponent,
  confirmComponent,
  confirm,
}: NetworkLocalControlProps) {
  const [whetherAction, setWhetherAction] = useState<boolean>(null)
  const whetherActionCombined =
    whetherAction === null ? clientState : whetherAction
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false)
  const toast = useToast()
  const [isConfirming, setIsConfirming] = useState<boolean>(false)

  const toggleState = async () => {
    if (confirm) {
      if (!isConfirming) {
        setIsConfirming(true)
        setTimeout(() => setIsConfirming(false), 5000)
        return
      } else {
        setIsConfirming(false)
      }
    }
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
      {isConfirming
        ? confirmComponent
        : whetherActionCombined
        ? doneComponent
        : initialComponent}
    </Button>
  )
}
