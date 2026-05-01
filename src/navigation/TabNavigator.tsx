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

const TAB_ICON_MAP: Record<
  string,
  {
    focused: keyof typeof Ionicons.glyphMap;
    default: keyof typeof Ionicons.glyphMap;
  }
> = {
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
          borderTopWidth: 1,
          borderTopColor: Colors.borderLight,
          height: TAB_BAR_HEIGHT,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.1,
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
                    top: -12,
                    width: 22,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: Colors.accent,
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
