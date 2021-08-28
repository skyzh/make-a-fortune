import React from 'react';
import { HStack, Icon, Pressable, Center } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Footer(): JSX.Element {
  const [selected, setSelected] = React.useState(1);
  return (
    <HStack justifyContent="center" safeAreaBottom mb={1}>
      <Pressable py={3} flex={1} onPress={() => setSelected(0)}>
        <Center>
          {selected === 0 ? (
            <Icon
              as={<MaterialCommunityIcons name="home" />}
              color="black"
              size="sm"
            />
          ) : (
            <Icon
              as={<MaterialCommunityIcons name="home-outline" />}
              color="gray"
              size="sm"
            />
          )}
        </Center>
      </Pressable>
      <Pressable py={3} flex={1} onPress={() => setSelected(1)}>
        <Center>
          {selected === 1 ? (
            <Icon
              as={<MaterialCommunityIcons name="bell" />}
              color="black"
              size="sm"
            />
          ) : (
            <Icon
              as={<MaterialCommunityIcons name="bell-outline" />}
              color="gray"
              size="sm"
            />
          )}
        </Center>
      </Pressable>
      <Pressable py={3} flex={1} onPress={() => setSelected(2)}>
        <Center>
          {selected === 2 ? (
            <Icon
              as={<MaterialCommunityIcons name="account" />}
              color="black"
              size="sm"
            />
          ) : (
            <Icon
              as={<MaterialCommunityIcons name="account-outline" />}
              color="gray"
              size="sm"
            />
          )}
        </Center>
      </Pressable>
    </HStack>
  );
}
