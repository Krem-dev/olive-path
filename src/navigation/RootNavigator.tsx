import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useLibraryStore } from '../store/libraryStore';
import { RootStackParamList } from '../types';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import SermonDetailScreen from '../screens/discover/SermonDetailScreen';
import MotivationDetailScreen from '../screens/discover/MotivationDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import PrayerRequestScreen from '../screens/prayer/PrayerRequestScreen';
import BookCounsellingScreen from '../screens/booking/BookCounsellingScreen';
import BookEricScreen from '../screens/booking/BookEricScreen';
import WeeklyDevotionScreen from '../screens/devotion/WeeklyDevotionScreen';
import BookDetailScreen from '../screens/library/BookDetailScreen';
import BookReaderScreen from '../screens/library/BookReaderScreen';
import SplashScreen from '../screens/SplashScreen';
import FluentGalleryScreen from '../screens/dev/FluentGalleryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const hydrate = useAuthStore((s) => s.hydrate);
  const [splashDone, setSplashDone] = useState(false);

  // Hydrate auth state from AsyncStorage on app boot
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  // Pull bookmarks from the backend whenever a user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      void useLibraryStore.getState().hydrateBookmarks();
    } else {
      useLibraryStore.getState().reset();
    }
  }, [isAuthenticated]);

  // Show our brand splash until BOTH hydration finishes AND its min duration elapses
  if (isHydrating || !splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="SermonDetail"
        component={SermonDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="MotivationDetail"
        component={MotivationDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="WeeklyDevotion"
        component={WeeklyDevotionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="BookReader"
        component={BookReaderScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="PrayerRequest"
        component={PrayerRequestScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="BookCounselling"
        component={BookCounsellingScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="BookEric"
        component={BookEricScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      {/* Fluent component gallery — dev builds only, stripped from release. */}
      {__DEV__ && (
        <Stack.Screen
          name="FluentGallery"
          component={FluentGalleryScreen}
          options={{ animation: 'slide_from_right' }}
        />
      )}
    </Stack.Navigator>
  );
}
