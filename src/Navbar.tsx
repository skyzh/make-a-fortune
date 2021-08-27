import React from 'react';
import { Box, Image, Icon, Avatar, HStack, IconButton } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import logo from '../resources/logo1024.png';

const Navbar: React.FC<{
  composeButton?: boolean;
}> = ({ composeButton }) => {
  return (
    <HStack
      safeAreaTop
      justifyContent="space-between"
      px={10}
      alignItems="center"
    >
      {composeButton && <Avatar size="sm">A</Avatar>}
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
      {composeButton && (
        <IconButton
          variant="ghost"
          size="sm"
          colorScheme="lightBlue"
          icon={<Icon as={<MaterialCommunityIcons name="plus" />} size="sm" />}
        >
          {/* 发帖 */}
        </IconButton>
      )}
    </HStack>
  );
};

export default Navbar;
