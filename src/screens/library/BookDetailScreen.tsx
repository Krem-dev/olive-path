import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants';
import { booksApi } from '../../api/books';
import { paymentsApi } from '../../api/payments';
import { useFetch } from '../../hooks/useFetch';
import { ApiError } from '../../api/client';
import { RootStackParamList } from '../../types';

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

  const [purchasing, setPurchasing] = useState(false);
  const [pendingReference, setPendingReference] = useState<string | null>(null);

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

  if (loading) {
    return (
      <View
        style={[styles.screen, styles.centered, { paddingTop: insets.top }]}
      >
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View
        style={[styles.screen, styles.centered, { paddingTop: insets.top }]}
      >
        <Text style={styles.notFoundText}>{error || 'Book not found.'}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.notFoundBtn}
        >
          <Text style={styles.notFoundBtnText}>Go back</Text>
        </TouchableOpacity>
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
        // Open Paystack payment page in the system browser; we'll verify when
        // the app returns to the foreground.
        setPendingReference(result.reference);
        const supported = await Linking.canOpenURL(result.authorizationUrl);
        if (supported) {
          await Linking.openURL(result.authorizationUrl);
        } else {
          Alert.alert(
            'Cannot open payment page',
            'Please update the app or try again later.',
          );
          setPendingReference(null);
        }
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

  return (
    <View style={styles.screen}>
      {/* ── Top bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.iconBtn}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.topBarRight}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconBtn}
            hitSlop={6}
          >
            <Ionicons
              name="bookmark-outline"
              size={20}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconBtn}
            hitSlop={6}
          >
            <Ionicons
              name="share-outline"
              size={20}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* ── Hero (cover + title) ── */}
        <View style={styles.hero}>
          <View style={styles.coverShadow}>
            <View style={styles.coverWrap}>
              <Image source={{ uri: book.coverUrl }} style={styles.cover} />
              {isComplete && (
                <View style={styles.completedBadge}>
                  <Ionicons
                    name="checkmark"
                    size={13}
                    color={Colors.textInverse}
                  />
                </View>
              )}
            </View>
          </View>
          {isOwned && (
            <View style={styles.ownedRibbon}>
              <Ionicons
                name="checkmark-circle"
                size={11}
                color={Colors.success}
              />
              <Text style={styles.ownedRibbonText}>In your library</Text>
            </View>
          )}
          <Text style={styles.title}>{book.title}</Text>
          {book.subtitle && (
            <Text style={styles.subtitle}>{book.subtitle}</Text>
          )}
        </View>

        {/* ── Author row ── */}
        <View style={styles.authorRow}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorInitials}>
              {getInitials(book.author)}
            </Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorLabel}>WRITTEN BY</Text>
            <Text style={styles.authorName}>{book.author}</Text>
            {book.authorTitle && (
              <Text style={styles.authorTitle}>{book.authorTitle}</Text>
            )}
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.pages}</Text>
            <Text style={styles.statLabel}>Pages</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue} numberOfLines={1}>
              {book.categories[0] || '—'}
            </Text>
            <Text style={styles.statLabel}>Category</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{publishedYear}</Text>
            <Text style={styles.statLabel}>Published</Text>
          </View>
        </View>

        {/* ── CTA ── */}
        <View style={styles.ctaWrap}>
          {isOwned ? (
            <>
              {inProgress && progress && (
                <View style={styles.progressBlock}>
                  <View style={styles.progressHeaderRow}>
                    <Text style={styles.progressLabel}>YOUR PROGRESS</Text>
                    <Text style={styles.progressPercent}>
                      {Math.round(progress.progress * 100)}%
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress.progress * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressMeta}>
                    Page {progress.currentPage} of {book.pages}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={handlePrimary}
              >
                <Ionicons
                  name="book"
                  size={16}
                  color={Colors.textInverse}
                />
                <Text style={styles.primaryButtonText}>
                  {inProgress
                    ? 'Continue reading'
                    : isComplete
                    ? 'Read again'
                    : 'Start reading'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.priceBlock}>
                <Text style={styles.priceLabel}>
                  {isFree ? 'AVAILABLE' : 'PRICE'}
                </Text>
                <Text style={styles.priceValue}>
                  {formatPrice(book.price, book.currency)}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  purchasing && styles.buttonDisabled,
                ]}
                activeOpacity={0.85}
                onPress={handlePrimary}
                disabled={purchasing}
              >
                {purchasing ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.textInverse}
                  />
                ) : (
                  <>
                    <Ionicons
                      name={isFree ? 'download-outline' : 'cart-outline'}
                      size={16}
                      color={Colors.textInverse}
                    />
                    <Text style={styles.primaryButtonText}>
                      {isFree ? 'Get free copy' : 'Buy now'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              {!isFree && (
                <Text style={styles.paymentNote}>
                  Secure payment via Paystack
                </Text>
              )}
            </>
          )}
        </View>

        {/* ── About ── */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>ABOUT THIS BOOK</Text>
          <Text style={styles.descriptionText}>{book.description}</Text>
        </View>

        {/* ── Categories ── */}
        {book.categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>TOPICS</Text>
            <View style={styles.tagRow}>
              {book.categories.map((c) => (
                <View key={c} style={styles.tag}>
                  <Text style={styles.tagText}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  notFoundText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  notFoundBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  notFoundBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverse,
  },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginLeft: Spacing.sm,
  },

  // ── Hero ──
  hero: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  coverShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 12,
    marginBottom: Spacing.lg,
  },
  coverWrap: {
    width: 180,
    aspectRatio: 2 / 3,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceBlue,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  completedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  ownedRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.successLight,
    borderWidth: 1,
    borderColor: 'rgba(92, 122, 61, 0.3)',
    marginBottom: Spacing.md,
  },
  ownedRibbonText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
    letterSpacing: 0.6,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: Spacing.sm,
  },

  // ── Author ──
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.lg,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitials: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.5,
  },
  authorInfo: {
    flex: 1,
  },
  authorLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.4,
    marginBottom: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  authorTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },

  // ── Stats ──
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceBlue,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(184, 137, 62, 0.2)',
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statValue: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },

  // ── CTA ──
  ctaWrap: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  priceBlock: {
    marginBottom: Spacing.base,
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  progressBlock: {
    marginBottom: Spacing.base,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.4,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  progressMeta: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 0.1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  paymentNote: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 0.2,
  },

  // ── Section ──
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.4,
    marginBottom: Spacing.base,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 25,
    fontWeight: '400',
    color: Colors.textPrimary,
  },

  // ── Tags ──
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceBlue,
    borderWidth: 1,
    borderColor: 'rgba(184, 137, 62, 0.25)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
    letterSpacing: 0.1,
  },
});
