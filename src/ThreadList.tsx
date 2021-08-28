import React, { useState } from 'react';
import { Text, VStack, Badge, HStack, FlatList, Box, Icon } from 'native-base';

import range from 'lodash/range';
import map from 'lodash/map';
import { RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const data = map(range(20), x => ({
  id: x,
  title: '我的失败，彻彻底底',
  content: '面对命中注定的失败',
}));

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const ThreadList: React.FC<{
  safeArea?: boolean;
}> = ({ safeArea }) => {
  const [refreshing, setRefreshing] = useState(false);

  const reloadLines = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <>
      <Box safeAreaTop={safeArea} />
      <FlatList
        removeClippedSubviews
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={reloadLines} />
        }
        initialNumToRender={5}
        data={data}
        my={safeArea ? 12 : undefined}
        renderItem={({ item }) => (
          <VStack
            borderColor="gray.100"
            borderTopWidth={1}
            py={4}
            px={3}
            alignSelf="center"
            width={700}
            maxWidth="100%"
            key={item.id}
            space={1}
            bgColor="white"
          >
            <HStack space={2} alignItems="center">
              <Badge>#23333</Badge>
              <Badge>校园</Badge>
              <Box mx="auto" />
              <HStack space={1}>
                <Icon
                  as={<MaterialCommunityIcons name="comment-outline" />}
                  color="black"
                  size="xs"
                />
                <Text alignSelf="flex-end" fontSize="sm">
                  1
                </Text>
              </HStack>
            </HStack>
            <HStack space={1} alignItems="center">
              <Text>{item.title}</Text>
            </HStack>
            <Text>{item.content}</Text>
          </VStack>
        )}
        keyExtractor={item => item.id.toString()}
        // ListHeaderComponent={
        //   <Box alignSelf="center">
        //     <Button
        //       startIcon={
        //         <Icon as={MaterialCommunityIcons} name="refresh" size={5} />
        //       }
        //     >
        //       有新帖子
        //     </Button>
        //   </Box>
        // }
      />
      <Box safeAreaBottom={safeArea} />
    </>
  );
};

export default ThreadList;
