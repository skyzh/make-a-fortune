import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Spacer,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import Navbar from "~src/components/elements/Navbar"
import { ChevronDoubleUp } from "../utils/Icons"
import Logo from "../widgets/Logo"

function ButtonScrollTop() {
  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowScroll(window.pageYOffset > 10)
    }
    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [showScroll])

  return showScroll ? (
    <Button colorScheme="blue" variant="ghost" onClick={backToTop}>
      <ChevronDoubleUp />
    </Button>
  ) : (
    <></>
  )
}

const PhoneNavbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef<HTMLButtonElement>(undefined!)

  const drawerBgColor = useColorModeValue("gray.50", "gray.900")

  return (
    <>
      <HStack>
        <Button
          ref={btnRef}
          colorScheme="black"
          variant="ghost"
          onClick={onOpen}
        >
          <Logo />
        </Button>
        <Spacer />
        <ButtonScrollTop />
      </HStack>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent bg={drawerBgColor}>
            <DrawerHeader />
            <DrawerBody>
              <Navbar onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default PhoneNavbar
