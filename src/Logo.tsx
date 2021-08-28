import React from 'react';
import { Box, Image } from 'native-base';

import logo from '../resources/logo1024.png';

export default function Logo(): JSX.Element {
  return (
    <Box shadow={1} width={10} height={10} my={2} borderRadius={10}>
      <Image
        source={logo}
        width={10}
        height={10}
        resizeMode="contain"
        alt="logo"
        rounded={10}
      />
    </Box>
  );
}
