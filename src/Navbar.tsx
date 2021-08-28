import React from 'react';
import { Icon, Avatar, HStack, IconButton } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from './Logo';

const Navbar: React.FC<{
  composeButton?: boolean;
}> = () => {
  const ComposeButton = () => (
    <IconButton
      variant="ghost"
      size="sm"
      colorScheme="lightBlue"
      icon={
        <Icon
          as={<MaterialCommunityIcons name="plus" />}
          size="sm"
          color="lightBlue.500"
        />
      }
    >
      {/* 发帖 */}
    </IconButton>
  );
  const AvatarButton = () => <Avatar size="sm">A</Avatar>;

  return (
    <HStack
      safeAreaTop
      px={5}
      justifyContent="space-between"
      alignItems="center"
    >
      <AvatarButton />
      <Logo />
      <ComposeButton />
    </HStack>
  );
};

export default Navbar;
