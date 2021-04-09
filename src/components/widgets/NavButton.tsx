import { Button } from "@chakra-ui/react"
import React from "react"
import { NavLink, Route } from "react-router-dom"
import {
  ArrowRightCircleFill,
  ArrowRightShort,
} from "~/src/components/utils/Icons"

const NavButton: React.FC = ({ to, exact, children, ...rest }) => {
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
