import { Button, useToast } from "@chakra-ui/react"
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
  const [whetherAction, setWhetherAction] = useState<boolean>()
  const whetherActionCombined = whetherAction ?? clientState
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
        await cancelAction?.()
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
  const BreakpointButton = ({
    baseVariant,
    display,
  }: {
    baseVariant: string
    display: any
  }) => (
    <Button
      colorScheme="teal"
      size="xs"
      variant={whetherActionCombined ? "solid" : baseVariant}
      onClick={toggleState}
      isLoading={isActionLoading}
      isDisabled={!cancelAction && whetherActionCombined}
      display={display}
    >
      {isConfirming
        ? confirmComponent
        : whetherActionCombined
        ? doneComponent
        : initialComponent}
    </Button>
  )
  return (
    <>
      <BreakpointButton
        baseVariant="outline"
        display={{ base: "none", md: "unset" }}
      />
      <BreakpointButton
        baseVariant="ghost"
        display={{ base: "unset", md: "none" }}
      />
    </>
  )
}
