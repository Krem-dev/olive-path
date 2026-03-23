import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../../constants';

/**
 * Placeholder for the church logo.
 * Replace the contents with an <Image> once the logo asset is provided.
 */
export default function LogoPlaceholder({ size = 80 }: { size?: number }) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size * 0.3 }]}>OP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    color: Colors.textInverse,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
