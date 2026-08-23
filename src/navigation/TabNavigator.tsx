import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFluentColors } from '../components/fluent';
import {
  Home24Regular,
  Home24Filled,
  Search24Regular,
  Search24Filled,
  ChatMultiple24Regular,
  ChatMultiple24Filled,
  Library24Regular,
  Library24Filled,
} from '../components/fluent/icons';

import HomeScreen from '../screens/home/HomeScreen';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import QAScreen from '../screens/discover/QAScreen';
import LibraryScreen from '../screens/library/LibraryScreen';

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = 64;

type FluentIcon = React.FC<any>;

const TAB_ICON_MAP: Record<string, { focused: FluentIcon; default: FluentIcon }> = {
  Home: { focused: Home24Filled, default: Home24Regular },
  Discover: { focused: Search24Filled, default: Search24Regular },
  'Q&A': { focused: ChatMultiple24Filled, default: ChatMultiple24Regular },
  Library: { focused: Library24Filled, default: Library24Regular },
};

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const colors = useFluentColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brandForeground1 as string,
        tabBarInactiveTintColor: colors.neutralForeground3 as string,
        tabBarStyle: {
          backgroundColor: colors.neutralBackground1 as string,
          borderTopWidth: 1,
          borderTopColor: colors.neutralStroke2 as string,
          // Reserve room for the device's bottom inset (gesture bar / home indicator)
          // so labels never sit under the system handle.
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 8,
          elevation: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.1,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICON_MAP[route.name];
          const Icon = focused ? icons.focused : icons.default;
          // React Navigation does not always supply `size`; without a fallback
          // the icon would get width/height NaN and render nothing.
          const glyph = (size ?? 24) - 2;
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
                    backgroundColor: colors.brandBackground as string,
                  }}
                />
              )}
              <Icon color={color} width={glyph} height={glyph} />
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
