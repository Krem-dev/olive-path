import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopBar from './TopBar';
import { Spinner, useFluentColors } from '../fluent';
import { PAYSTACK_CALLBACK_URL } from '../../config/api';
import { Dismiss24Regular } from '../fluent/icons';

interface PaymentWebViewProps {
  visible: boolean;
  url: string;
  onClose: () => void;
  onSuccess: (reference: string) => void;
}

export default function PaymentWebView({ visible, url, onClose, onSuccess }: PaymentWebViewProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const colors = useFluentColors();

  const handleNavigationChange = (navState: { url: string }) => {
    // Paystack redirects to our callback URL after payment
    if (navState.url.startsWith(PAYSTACK_CALLBACK_URL) || navState.url.includes('callback')) {
      // Extract reference from URL params
      const urlObj = new URL(navState.url.replace('olivepath://', 'https://'));
      const ref = urlObj.searchParams.get('reference') || urlObj.searchParams.get('trxref');
      if (ref) {
        onSuccess(ref);
      } else {
        onClose();
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={[
          s.container,
          { paddingTop: insets.top, backgroundColor: colors.neutralBackground3 as string },
        ]}
      >
        <TopBar title="Complete Payment" backIcon={Dismiss24Regular} onBackPress={onClose} />
        {loading && (
          <View
            style={[s.loader, { backgroundColor: colors.neutralBackground3 as string }]}
          >
            <Spinner size="large" />
          </View>
        )}
        <WebView
          source={{ uri: url }}
          style={s.webview}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavigationChange}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
        />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
