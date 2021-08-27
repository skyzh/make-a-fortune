import React from 'react';
import { NativeBaseProvider, Box, Icon, Fab } from 'native-base';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import Footer from './Footer.tsx';
import ThreadList from './ThreadList.tsx';
import Navbar from './Navbar';

export default function AppNative(): JSX.Element {
  return (
    <NativeBaseProvider>
      <Box flex={1}>
        <Box borderBottomWidth="1px" borderBottomColor="gray.200">
          <Navbar />
        </Box>
        <Fab
          placement="bottom-right"
          mb={20}
          size="sm"
          icon={
            <Icon
              color="white"
              as={<MaterialCommunityIcons name="plus" />}
              size="sm"
            />
          }
          bgColor="lightBlue.500"
        />
        <ThreadList />
        <Box>
          <Footer />
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
