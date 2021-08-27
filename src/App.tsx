import React from 'react';
import { NativeBaseProvider, Box, Icon, Fab, Image, Center } from 'native-base';
import { registerRootComponent } from 'expo';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import Footer from './Footer.tsx';
import ThreadList from './ThreadList.tsx';

import logo = require('../resources/logo1024.png');

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <Box flex={1}>
        <Box flex={1}>
          <Center
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
            safeAreaTop
          >
            <Box shadow={1} width={10} height={10} my={2}>
              <Image
                source={logo}
                width={10}
                height={10}
                resizeMode="contain"
                alt="logo"
                borderRadius={5}
              />
            </Box>
          </Center>
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
          <Footer />
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
export default registerRootComponent(App);
