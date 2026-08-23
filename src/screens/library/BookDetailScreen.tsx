import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Text,
  Spinner,
  FluentCard,
  useFluentColors,
  FluentSpacing,
  FluentCorner,
  FluentTint,
} from '../../components/fluent';
import {
  ChevronLeft24Regular,
  Bookmark24Regular,
  ShareAndroid24Regular,
  BookOpen24Filled,
  Checkmark12Filled,
  CheckmarkCircle16Filled,
  Cart24Regular,
  ArrowDownload24Regular,
} from '../../components/fluent/icons';
import { booksApi } from '../../api/books';
import { paymentsApi } from '../../api/payments';
import { useFetch } from '../../hooks/useFetch';
import { ApiError } from '../../api/client';
import { RootStackParamList } from '../../types';
import { PaymentWebView, Button } from '../../components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BookDetail'>;
type Rt = RouteProp<RootStackParamList, 'BookDetail'>;

const CURRENCY_SYMBOL: Record<string, string> = {
  GHS: '₵',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

function formatPrice(price: number, currency: string): string {
  if (price === 0) return 'Free';
  const symbol = CURRENCY_SYMBOL[currency] || `${currency} `;
  return `${symbol}${price}`;
}

function getInitials(fullName: string): string {
  const parts = fullName.replace(/\./g, '').split(/\s+/).filter(Boolean);
  const meaningful = parts.filter(
    (p) => !['Rev', 'Ing', 'Mr', 'Mrs', 'Dr', 'Pst', 'Ps'].includes(p),
  );
  const pick = meaningful.length >= 2 ? meaningful : parts;
  return pick
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export default function BookDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const bookId = route.params.bookId;
  const colors = useFluentColors();

  const [purchasing, setPurchasing] = useState(false);
  const [pendingReference, setPendingReference] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const { data, loading, error, refetch } = useFetch(
    () => booksApi.byId(bookId),
    [bookId],
  );

  // When the user returns to the app after a Paystack session, verify the txn.
  React.useEffect(() => {
    if (!pendingReference) return;
    const sub = AppState.addEventListener(
      'change',
      async (state: AppStateStatus) => {
        if (state !== 'active') return;
        try {
          const result = await paymentsApi.verify(pendingReference);
          if (result.status === 'paid' || result.status === 'free') {
            setPendingReference(null);
            await refetch();
            Alert.alert(
              'Purchase complete',
              "The book is now in your library.",
            );
          } else if (result.status === 'failed') {
            setPendingReference(null);
            Alert.alert(
              'Payment failed',
              'The payment did not go through. Please try again.',
            );
          }
          // status === 'pending' → leave the listener active for a retry
        } catch {
          // Network failure — silently retry next focus
        }
      },
    );
    return () => sub.remove();
  }, [pendingReference, refetch]);

  const screenBg = { backgroundColor: colors.neutralBackground3 as string };

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered, screenBg, { paddingTop: insets.top }]}>
        <Spinner />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.screen, styles.centered, screenBg, { paddingTop: insets.top }]}>
        <Text variant="body1" color={colors.neutralForeground2 as string}>
          {error || 'Book not found.'}
        </Text>
        <Button
          label="Go back"
          onPress={() => navigation.goBack()}
          variant="outlined"
          fullWidth={false}
        />
      </View>
    );
  }

  const book = data;
  const isOwned = book.owned;
  const progress = book.progress;
  const isFree = book.price === 0;
  const isComplete = isOwned && progress?.progress === 1;
  const inProgress =
    isOwned && progress && progress.progress > 0 && progress.progress < 1;
  const publishedYear = new Date(book.publishedAt).getFullYear();

  const handlePrimary = async () => {
    if (isOwned) {
      navigation.navigate('BookReader', { bookId });
      return;
    }

    setPurchasing(true);
    try {
      const result = await paymentsApi.initialize(bookId);
      if (result.type === 'free') {
        await refetch();
        Alert.alert('Added to library', 'Enjoy your reading.');
      } else {
        // Open Paystack in-app WebView
        setPendingReference(result.reference);
        setPaymentUrl(result.authorizationUrl);
        setShowPayment(true);
      }
    } catch (e) {
      Alert.alert(
        'Purchase failed',
        e instanceof ApiError ? e.message : 'Could not start purchase.',
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handlePaymentSuccess = async (reference: string) => {
    setShowPayment(false);
    setPurchasing(true);
    try {
      const result = await paymentsApi.verify(reference);
      if (result.status === 'paid') {
        await refetch();
        Alert.alert('Payment successful', 'The book has been added to your library.');
      } else {
        Alert.alert('Payment pending', 'We\'re still confirming your payment. Please check back shortly.');
      }
    } catch {
      Alert.alert('Verification failed', 'Please check your Library — the book may already be there.');
    } finally {
      setPurchasing(false);
      setPendingReference(null);
    }
  };

  const iconBtn = ({ pressed }: { pressed: boolean }) => [
    styles.iconBtn,
    pressed && { backgroundColor: colors.neutralBackground1Pressed as string },
  ];

  const primaryLabel = isOwned
    ? inProgress
      ? 'Continue reading'
      : isComplete
        ? 'Read again'
        : 'Start reading'
    : isFree
      ? 'Get free copy'
      : 'Buy now';

  const primaryIcon = isOwned
    ? BookOpen24Filled
    : isFree
      ? ArrowDownload24Regular
      : Cart24Regular;

  return (
    <View style={[styles.screen, screenBg]}>
      <PaymentWebView
        visible={showPayment}
        url={paymentUrl}
        onClose={() => {
          setShowPayment(false);
          // User closed the payment page — verify in case they already paid
          if (pendingReference) {
            handlePaymentSuccess(pendingReference);
          }
        }}
        onSuccess={handlePaymentSuccess}
      />

      {/* ── Top bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={iconBtn}
        >
          <ChevronLeft24Regular color={colors.neutralForeground1 as string} />
        </Pressable>
        <View style={styles.topBarRight}>
          <Pressable hitSlop={6} accessibilityRole="button" accessibilityLabel="Bookmark" style={iconBtn}>
            <Bookmark24Regular color={colors.neutralForeground1 as string} />
          </Pressable>
          <Pressable hitSlop={6} accessibilityRole="button" accessibilityLabel="Share" style={iconBtn}>
            <ShareAndroid24Regular color={colors.neutralForeground1 as string} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + FluentSpacing.xxxl }}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.coverWrap}>
            <Image
              source={{ uri: book.coverUrl }}
              style={[styles.cover, { backgroundColor: colors.neutralBackground4 as string }]}
            />
            {isComplete && (
              <View style={[styles.completedBadge, { backgroundColor: colors.successForeground1 as string }]}>
                <Checkmark12Filled color="#FFFFFF" width={13} height={13} />
              </View>
            )}
          </View>

          {isOwned && (
            <View style={[styles.ownedRibbon, { backgroundColor: colors.successBackground1 as string }]}>
              <CheckmarkCircle16Filled color={colors.successForeground1 as string} width={12} height={12} />
              <Text variant="caption1Strong" color={colors.successForeground1 as string}>
                In your library
              </Text>
            </View>
          )}

          <Text variant="title1" style={styles.center}>
            {book.title}
          </Text>
          {book.subtitle ? (
            <Text variant="body2" color={colors.neutralForeground2 as string} style={styles.center}>
              {book.subtitle}
            </Text>
          ) : null}
        </View>

        {/* ── Author ── */}
        <View style={styles.gutter}>
          <FluentCard appearance="filled" size="large" horizontal>
            <View style={[styles.avatar, { backgroundColor: colors.brandBackground as string }]}>
              <Text variant="body2Strong" color={colors.neutralForegroundOnColor as string}>
                {getInitials(book.author)}
              </Text>
            </View>
            <View style={styles.flex}>
              <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
                WRITTEN BY
              </Text>
              <Text variant="body1Strong">{book.author}</Text>
              {book.authorTitle ? (
                <Text variant="caption1" color={colors.neutralForeground2 as string}>
                  {book.authorTitle}
                </Text>
              ) : null}
            </View>
          </FluentCard>
        </View>

        {/* ── Stats ── */}
        <View style={[styles.gutter, styles.statsWrap]}>
          <FluentCard appearance="filled" size="large" horizontal>
            {[
              { value: String(book.pages), label: 'Pages' },
              { value: book.categories[0] || '—', label: 'Category' },
              { value: String(publishedYear), label: 'Published' },
            ].map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && (
                  <View style={[styles.statDivider, { backgroundColor: colors.neutralStroke2 as string }]} />
                )}
                <View style={styles.statItem}>
                  <Text variant="body1Strong" numberOfLines={1}>
                    {stat.value}
                  </Text>
                  <Text variant="caption1" color={colors.neutralForeground2 as string}>
                    {stat.label}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </FluentCard>
        </View>

        {/* ── CTA ── */}
        <View style={[styles.gutter, styles.ctaWrap]}>
          {isOwned && inProgress && progress ? (
            <FluentCard appearance="filled" size="large">
              <View style={styles.progressHeader}>
                <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
                  YOUR PROGRESS
                </Text>
                <Text variant="body1Strong" color={colors.brandForeground1 as string}>
                  {`${Math.round(progress.progress * 100)}%`}
                </Text>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: colors.neutralBackground4 as string }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress.progress * 100}%`,
                      backgroundColor: colors.brandBackground as string,
                    },
                  ]}
                />
              </View>
              <Text variant="caption1" color={colors.neutralForeground2 as string}>
                {`Page ${progress.currentPage} of ${book.pages}`}
              </Text>
            </FluentCard>
          ) : null}

          {!isOwned ? (
            <View style={styles.priceBlock}>
              <Text variant="caption1Strong" color={colors.neutralForeground2 as string} style={styles.tracked}>
                {isFree ? 'AVAILABLE' : 'PRICE'}
              </Text>
              <Text variant="title1" color={colors.brandForeground1 as string}>
                {formatPrice(book.price, book.currency)}
              </Text>
            </View>
          ) : null}

          <Button
            label={primaryLabel}
            onPress={handlePrimary}
            variant="primary"
            size="lg"
            icon={primaryIcon}
            loading={purchasing}
            disabled={purchasing}
          />

          {!isOwned && !isFree ? (
            <Text variant="caption1" color={colors.neutralForeground3 as string} style={styles.center}>
              Secure payment via Paystack
            </Text>
          ) : null}
        </View>

        {/* ── About ── */}
        <View style={[styles.gutter, styles.section]}>
          <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
            ABOUT THIS BOOK
          </Text>
          <Text variant="body1" color={colors.neutralForeground1 as string} style={styles.description}>
            {book.description}
          </Text>
        </View>

        {/* ── Topics ── */}
        {book.categories.length > 0 ? (
          <View style={[styles.gutter, styles.section]}>
            <Text variant="caption1Strong" color={colors.brandForeground1 as string} style={styles.tracked}>
              TOPICS
            </Text>
            <View style={styles.tagRow}>
              {book.categories.map((c) => (
                <View key={c} style={[styles.tag, { backgroundColor: FluentTint.subtle }]}>
                  <Text variant="caption1Strong" color={colors.brandForeground1 as string}>
                    {c}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  gutter: { paddingHorizontal: FluentSpacing.l },
  center: { textAlign: 'center' },
  tracked: { letterSpacing: 1.2 },
  centered: { justifyContent: 'center', alignItems: 'center', gap: FluentSpacing.l },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: FluentSpacing.l,
    paddingBottom: FluentSpacing.m,
  },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: FluentSpacing.xxs },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: FluentCorner.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },

  hero: {
    alignItems: 'center',
    paddingHorizontal: FluentSpacing.xxl,
    paddingBottom: FluentSpacing.xl,
    gap: FluentSpacing.s,
  },
  coverWrap: { position: 'relative' },
  cover: {
    width: 150,
    height: 220,
    borderRadius: FluentCorner.xLarge,
  },
  completedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownedRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.xs,
    paddingHorizontal: FluentSpacing.m,
    paddingVertical: FluentSpacing.xs,
    borderRadius: FluentCorner.circular,
    marginTop: FluentSpacing.s,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: FluentCorner.circular,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsWrap: { marginTop: FluentSpacing.m },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch' },

  ctaWrap: { marginTop: FluentSpacing.l, gap: FluentSpacing.m },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTrack: { height: 6, borderRadius: FluentCorner.circular, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: FluentCorner.circular },
  priceBlock: { alignItems: 'center', gap: 2 },

  section: { marginTop: FluentSpacing.xl, gap: FluentSpacing.s },
  description: { lineHeight: 24 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: FluentSpacing.s },
  tag: {
    paddingHorizontal: FluentSpacing.m,
    paddingVertical: FluentSpacing.xs,
    borderRadius: FluentCorner.circular,
  },
});
