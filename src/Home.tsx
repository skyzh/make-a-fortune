import React from 'react';
import { NativeBaseProvider, Box, VStack, HStack, Heading } from 'native-base';

import Footer from './Footer';
import ThreadList from './ThreadList';
import Navbar from './Navbar';
import Logo from './Logo';

export default function Home(): JSX.Element {
  return (
    <NativeBaseProvider>
      <Box ml={{ base: 0, lg: 300 }}>
        <ThreadList safeArea />
      </Box>
      <Box
        position="fixed"
        top={0}
        width="100%"
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        bgColor="white"
        display={{ base: 'inherit', lg: 'none' }}
      >
        <Navbar />
      </Box>
      <Box
        position="fixed"
        bottom={0}
        width="100%"
        borderTopWidth="1px"
        borderTopColor="gray.200"
        bgColor="white"
        display={{ base: 'inherit', lg: 'none' }}
      >
        <Footer />
      </Box>
      <Box
        position="fixed"
        left={0}
        top={0}
        bottom={0}
        width={300}
        shadow={5}
        py={3}
        px={3}
        bgColor="gray.50"
        display={{ base: 'none', lg: 'inherit' }}
      >
        <VStack>
          <HStack alignItems="center" space={1}>
            <Logo /> <Heading size="md">闷声发财</Heading>
          </HStack>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}
