import { Button } from "@chakra-ui/react"
import React, { PropsWithChildren } from "react"
import { NavLink, Route } from "react-router-dom"
import {
  ArrowRightCircleFill,
  ArrowRightShort,
} from "~/src/components/utils/Icons"
import { AsyncCallback, Callback } from "../utils/types"

export type NavButtonProps = PropsWithChildren<{
  to: string
  exact?: boolean
  onClose?: AsyncCallback | Callback
}>

function NavButton({ to, exact = false, children, ...rest }: NavButtonProps) {
  return (
    <Route
      path={to}
      exact={exact}
      children={({ match }) => (
        <NavLink exact={exact} to={to}>
          <Button
            colorScheme={match ? "blue" : "gray"}
            color={match ? "blue.600" : "gray.500"}
            variant={match ? "outline" : "ghost"}
            isFullWidth={true}
            justifyContent="flex-start"
            leftIcon={match ? <ArrowRightCircleFill /> : <ArrowRightShort />}
            onClick={() => {
              rest.onClose && rest.onClose()
            }}
            {...rest}
          >
            {children}
          </Button>
        </NavLink>
      )}
    />
  )
}

export default NavButton
