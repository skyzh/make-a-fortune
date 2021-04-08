import React from "react"
import { useState, useEffect } from "react"
import Logo from "../widgets/Logo"

import {
  Stack,
  Box,
  Heading,
  Text,
  HStack,
  Button,
  Divider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody
} from "@chakra-ui/react"
import { Route, NavLink } from "react-router-dom"
import { useRPCState, useTokenState } from "~/src/settings"
import { Client } from "~/src/client"
import {
  ArrowRightShort,
  ArrowRightCircleFill
} from "~/src/components/utils/Icons"
import Navbar from "~src/components/elements/Navbar"

const PhoneNavbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  return (
    <Box>
      <Button
        ref={btnRef}
        colorScheme="blue"
        variant="ghost"
        onClick={onOpen}
      >
        <Logo />
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader />
            <DrawerBody>
              <Navbar />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  )
}

export default PhoneNavbar
