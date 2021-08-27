import React from 'react';
import { NativeBaseProvider, Box } from 'native-base';
import { registerRootComponent } from 'expo';

import Footer from './Footer.tsx';
import ThreadList from './ThreadList.tsx';
import Navbar from './Navbar';

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <ThreadList safeArea />
      <Box
        position="fixed"
        top={0}
        width="100%"
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        bgColor="white"
      >
        <Navbar composeButton />
      </Box>
      <Box
        position="fixed"
        bottom={0}
        width="100%"
        borderTopWidth="1px"
        borderTopColor="gray.200"
        bgColor="white"
      >
        <Footer />
      </Box>
    </NativeBaseProvider>
  );
}

export default registerRootComponent(App);
