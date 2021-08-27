import React, { useState } from 'react';
import {
  NativeBaseProvider,
  Text,
  VStack,
  Badge,
  HStack,
  FlatList,
  Box,
  Button,
  Icon,
  Fab,
} from 'native-base';
import { registerRootComponent } from 'expo';
import range from 'lodash/range';
import map from 'lodash/map';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

const data = map(range(100), x => ({
  id: x,
  title: '我的失败，彻彻底底',
  content: '面对命中注定的失败',
}));

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

function App(): JSX.Element {
  const [refreshing, setRefreshing] = useState(false);

  const reloadLines = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <NativeBaseProvider>
      <Box flex={1} safeArea>
        <Fab
          position="absolute"
          size="sm"
          icon={
            <Icon
              color="white"
              as={<MaterialCommunityIcons name="plus" />}
              size="sm"
            />
          }
        />
        <FlatList
          removeClippedSubviews
          userSelect="none"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={reloadLines} />
          }
          initialNumToRender={5}
          data={data}
          renderItem={({ item }) => (
            <VStack
              borderColor="gray.300"
              borderWidth={1}
              py={4}
              px={3}
              my={2}
              rounded="md"
              alignSelf="center"
              width={700}
              maxWidth="100%"
              key={item.id}
              space={1}
            >
              <Text fontSize="sm">
                <Badge>#23333</Badge>
              </Text>
              <HStack space={1} alignItems="center">
                <Text>{item.title}</Text>
              </HStack>
              <Text>{item.content}</Text>
            </VStack>
          )}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <Box alignSelf="center">
              <Button
                startIcon={
                  <Icon as={MaterialCommunityIcons} name="refresh" size={5} />
                }
              >
                有新帖子
              </Button>
            </Box>
          }
        />
      </Box>
    </NativeBaseProvider>
  );
}
export default registerRootComponent(App);
