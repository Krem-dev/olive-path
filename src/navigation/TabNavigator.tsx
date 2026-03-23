import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors, TAB_BAR_HEIGHT } from '../constants';

import HomeScreen from '../screens/home/HomeScreen';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import QAScreen from '../screens/discover/QAScreen';
import LibraryScreen from '../screens/library/LibraryScreen';

const Tab = createBottomTabNavigator();

const TAB_ICON_MAP: Record<string, { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }> = {
  Home: { focused: 'home', default: 'home-outline' },
  Discover: { focused: 'search', default: 'search-outline' },
  'Q&A': { focused: 'chatbubbles', default: 'chatbubbles-outline' },
  Library: { focused: 'library', default: 'library-outline' },
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBackground,
          borderTopColor: Colors.borderLight,
          borderTopWidth: 1,
          height: TAB_BAR_HEIGHT,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICON_MAP[route.name];
          const iconName = focused ? icons.focused : icons.default;
          return (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    top: -10,
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: Colors.tabBarActive,
                  }}
                />
              )}
              <Ionicons name={iconName} size={size - 2} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Q&A" component={QAScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
    </Tab.Navigator>
  );
}
