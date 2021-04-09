import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import React from "react"
import Navbar from "~src/components/elements/Navbar"
import Logo from "../widgets/Logo"

const PhoneNavbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef<HTMLButtonElement>(null!)

  const drawerBgColor = useColorModeValue("gray.50", "gray.900")

  return (
    <Box>
      <Button ref={btnRef} colorScheme="blue" variant="ghost" onClick={onOpen}>
        <Logo />
      </Button>

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
    </Box>
  )
}

export default PhoneNavbar
