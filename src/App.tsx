import React from 'react';
import { NativeBaseProvider, Text, Box } from 'native-base';
import { registerRootComponent } from 'expo';

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text>Hello, World!</Text>
      </Box>
    </NativeBaseProvider>
  );
}
export default registerRootComponent(App);
