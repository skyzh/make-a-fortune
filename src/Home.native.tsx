import React from 'react';
import { NativeBaseProvider, Box, Icon, Fab, Avatar } from 'native-base';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThreadList from './ThreadList';

const Layout = () => (
  <Box flex={1} bgColor="white">
    <Fab
      placement="bottom-right"
      mb={20}
      size="sm"
      colorScheme="blue"
      shadow={3}
      icon={
        <Icon
          color="white"
          as={<MaterialCommunityIcons name="plus" />}
          size="sm"
        />
      }
    />
    <ThreadList />
  </Box>
);

const Tab = createBottomTabNavigator();

export default function HomeNative(): JSX.Element {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={Layout}
            options={{
              headerLeft: () => (
                <Avatar size="sm" ml={5}>
                  A
                </Avatar>
              ),
              tabBarIcon: ({ color, size, focused }) => (
                <Icon
                  as={
                    <MaterialCommunityIcons
                      name={focused ? 'home' : 'home-outline'}
                    />
                  }
                  size={size}
                  color={color}
                />
              ),
              title: '首页',
              tabBarShowLabel: false,
            }}
          />
          <Tab.Screen
            name="Notification"
            component={Layout}
            options={{
              headerLeft: () => (
                <Avatar size="sm" ml={5}>
                  A
                </Avatar>
              ),
              tabBarIcon: ({ color, size, focused }) => (
                <Icon
                  as={
                    <MaterialCommunityIcons
                      name={focused ? 'bell' : 'bell-outline'}
                    />
                  }
                  size={size}
                  color={color}
                />
              ),
              title: '通知',
              tabBarShowLabel: false,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Layout}
            options={{
              headerLeft: () => (
                <Avatar size="sm" ml={5}>
                  A
                </Avatar>
              ),
              tabBarIcon: ({ color, size, focused }) => (
                <Icon
                  as={
                    <MaterialCommunityIcons
                      name={focused ? 'account' : 'account-outline'}
                    />
                  }
                  size={size}
                  color={color}
                />
              ),
              title: '我',
              tabBarShowLabel: false,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
