import React from 'react';
import { HStack, Box, Icon, Pressable, Center } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Footer(): JSX.Element {
  const [selected, setSelected] = React.useState(1);
  return (
    <Box>
      <HStack
        safeAreaBottom
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
      >
        <Pressable py={2} flex={1} onPress={() => setSelected(0)}>
          <Center>
            {selected === 0 ? (
              <Icon
                as={<MaterialCommunityIcons name="home" />}
                color="black"
                size="md"
              />
            ) : (
              <Icon
                as={<MaterialCommunityIcons name="home-outline" />}
                color="gray"
                size="md"
              />
            )}
          </Center>
        </Pressable>
        <Pressable py={2} flex={1} onPress={() => setSelected(1)}>
          <Center>
            {selected === 1 ? (
              <Icon
                as={<MaterialCommunityIcons name="bell" />}
                color="black"
                size="md"
              />
            ) : (
              <Icon
                as={<MaterialCommunityIcons name="bell-outline" />}
                color="gray"
                size="md"
              />
            )}
          </Center>
        </Pressable>
        <Pressable py={2} flex={1} onPress={() => setSelected(2)}>
          <Center>
            {selected === 2 ? (
              <Icon
                as={<MaterialCommunityIcons name="account" />}
                color="black"
                size="md"
              />
            ) : (
              <Icon
                as={<MaterialCommunityIcons name="account-outline" />}
                color="gray"
                size="md"
              />
            )}
          </Center>
        </Pressable>
      </HStack>
    </Box>
  );
}
