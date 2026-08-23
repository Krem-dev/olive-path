import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@fluentui-react-native/theme';
import RootNavigator from './src/navigation/RootNavigator';
import ProgramPopup from './src/components/ui/ProgramPopup';
import { fluentTheme } from './src/theme/fluent';

// Hide native splash immediately — we use our own custom splash
SplashScreen.preventAutoHideAsync().then(() => {
  SplashScreen.hideAsync();
});

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider theme={fluentTheme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
            <ProgramPopup />
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
