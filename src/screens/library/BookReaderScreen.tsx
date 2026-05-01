import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  StatusBar,
  Easing,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../../constants';
import { booksApi } from '../../api/books';
import { useFetch } from '../../hooks/useFetch';
import { Book, BookChapter } from '../../types/content';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BookReader'>;
type Rt = RouteProp<RootStackParamList, 'BookReader'>;

type ThemeKey = 'light' | 'sepia' | 'dark';
type FontKey = 'serif' | 'sans';

interface ReaderTheme {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  divider: string;
  toolbar: string;
  toolbarBorder: string;
}

const THEMES: Record<ThemeKey, ReaderTheme> = {
  light: {
    bg: '#FAF7F0',
    surface: '#FFFEFB',
    text: '#1F2419',
    textMuted: '#6B6557',
    accent: '#B8893E',
    divider: '#E5DFD0',
    toolbar: '#FFFEFB',
    toolbarBorder: '#E5DFD0',
  },
  sepia: {
    bg: '#F2EDE0',
    surface: '#EBE3D1',
    text: '#3D3528',
    textMuted: '#7A6E58',
    accent: '#9A7232',
    divider: '#D9CFB5',
    toolbar: '#EBE3D1',
    toolbarBorder: '#D9CFB5',
  },
  dark: {
    bg: '#1F2419',
    surface: '#2A2F22',
    text: '#FAF7F0',
    textMuted: '#A89F8B',
    accent: '#D4A85A',
    divider: '#3A3F2E',
    toolbar: '#2A2F22',
    toolbarBorder: '#3A3F2E',
  },
};

const FONT_SIZES = [15, 17, 19, 21, 23];
const DEFAULT_FONT_SIZE_INDEX = 1;

export default function BookReaderScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const bookId = route.params.bookId;

  // Fetch book metadata + chapters in parallel
  const bookFetch = useFetch(() => booksApi.byId(bookId), [bookId]);
  const contentFetch = useFetch(() => booksApi.content(bookId), [bookId]);

  const book: Book | undefined = bookFetch.data || undefined;
  const chapters: BookChapter[] = contentFetch.data?.chapters ?? [];

  // Debounced "save current page" — fires ~1.2s after the user stops scrolling.
  const lastSavedPage = useRef<number>(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistProgress = useCallback(
    (page: number) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        if (page === lastSavedPage.current) return;
        try {
          await booksApi.updateProgress(bookId, page);
          lastSavedPage.current = page;
        } catch {
          // Best-effort — will retry on next save trigger
        }
      }, 1200);
    },
    [bookId],
  );

  // Save the very last position when leaving the screen
  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    [],
  );

  // ── Reader preferences ──
  const [theme, setTheme] = useState<ThemeKey>('light');
  const [fontSizeIdx, setFontSizeIdx] = useState(DEFAULT_FONT_SIZE_INDEX);
  const [fontFamily, setFontFamily] = useState<FontKey>('serif');
  const [showSettings, setShowSettings] = useState(false);

  const t = THEMES[theme];
  const fontSize = FONT_SIZES[fontSizeIdx];

  // ── Toolbars (auto-hide on scroll down, show on scroll up) ──
  const toolbarOpacity = useRef(new Animated.Value(1)).current;
  const [toolbarsVisible, setToolbarsVisible] = useState(true);
  const lastY = useRef(0);

  const animateToolbars = (visible: boolean) => {
    if (visible === toolbarsVisible) return;
    setToolbarsVisible(visible);
    Animated.timing(toolbarOpacity, {
      toValue: visible ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  // ── Scroll progress ──
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(1);
  const chapterOffsets = useRef<number[]>([]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const y = contentOffset.y;
    const max = contentSize.height - layoutMeasurement.height;
    const p = max > 0 ? y / max : 0;
    const ratio = Math.max(0, Math.min(1, p));
    setProgress(ratio);

    // Determine current chapter from measured offsets
    if (chapterOffsets.current.length > 0) {
      const viewY = y + 80; // bias toward top of viewport
      let idx = 0;
      for (let i = 0; i < chapterOffsets.current.length; i++) {
        if (viewY >= chapterOffsets.current[i]) idx = i;
        else break;
      }
      const chapNum = chapters[idx]?.number ?? 1;
      if (chapNum !== activeChapter) setActiveChapter(chapNum);
    }

    // Persist scroll → page progress (debounced)
    if (book && book.pages > 0) {
      const page = Math.round(ratio * book.pages);
      persistProgress(page);
    }

    // Hide toolbar when scrolling down past 60px, show when scrolling up
    const dy = y - lastY.current;
    if (y < 40) animateToolbars(true);
    else if (dy > 6) animateToolbars(false);
    else if (dy < -6) animateToolbars(true);
    lastY.current = y;
  };

  // Loading state — neither metadata nor chapters yet
  if (bookFetch.loading || contentFetch.loading) {
    return (
      <View
        style={[styles.screen, styles.centered, { backgroundColor: t.bg }]}
      >
        <ActivityIndicator color={t.accent} />
      </View>
    );
  }

  // ── Empty state ──
  if (!book) {
    return (
      <View
        style={[styles.screen, styles.centered, { backgroundColor: t.bg }]}
      >
        <Text style={[styles.notFoundText, { color: t.textMuted }]}>
          Book not found.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.notFoundBtn, { backgroundColor: t.accent }]}
        >
          <Text style={styles.notFoundBtnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (chapters.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: t.bg }]}>
        {/* Top bar so user can leave */}
        <View
          style={[
            styles.topBar,
            {
              paddingTop: insets.top + 8,
              backgroundColor: t.toolbar,
              borderBottomColor: t.toolbarBorder,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={[
              styles.iconBtn,
              { backgroundColor: t.bg, borderColor: t.toolbarBorder },
            ]}
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color={t.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centered}>
          <View
            style={[
              styles.emptyIcon,
              {
                backgroundColor: t.surface,
                borderColor: t.toolbarBorder,
              },
            ]}
          >
            <Ionicons name="book-outline" size={28} color={t.accent} />
          </View>
          <Text style={[styles.emptyTitle, { color: t.text }]}>
            Coming soon
          </Text>
          <Text style={[styles.emptySub, { color: t.textMuted }]}>
            This book is in your library, but the digital edition isn't ready
            yet. We'll let you know the moment it is.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: t.bg }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* ── Top bar ── */}
      <Animated.View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + 8,
            backgroundColor: t.toolbar,
            borderBottomColor: t.toolbarBorder,
            opacity: toolbarOpacity,
            transform: [
              {
                translateY: toolbarOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents={toolbarsVisible ? 'auto' : 'none'}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={[
            styles.iconBtn,
            { backgroundColor: t.bg, borderColor: t.toolbarBorder },
          ]}
          hitSlop={8}
        >
          <Ionicons name="close" size={20} color={t.text} />
        </TouchableOpacity>
        <View style={styles.topBarTitleWrap}>
          <Text
            style={[styles.topBarTitle, { color: t.text }]}
            numberOfLines={1}
          >
            {book.title}
          </Text>
          <Text
            style={[styles.topBarChapter, { color: t.textMuted }]}
            numberOfLines={1}
          >
            Chapter {activeChapter} of {chapters.length}
          </Text>
        </View>
        <View style={styles.topBarRight}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.iconBtn,
              { backgroundColor: t.bg, borderColor: t.toolbarBorder },
            ]}
            hitSlop={6}
          >
            <Ionicons name="bookmark-outline" size={18} color={t.text} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.iconBtn,
              { backgroundColor: t.bg, borderColor: t.toolbarBorder },
            ]}
            hitSlop={6}
            onPress={() => setShowSettings(true)}
          >
            <Ionicons name="text" size={18} color={t.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Content ── */}
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 70,
          paddingBottom: insets.bottom + 90,
          paddingHorizontal: Spacing.xl,
        }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
      >
        {chapters.map((ch, i) => (
          <View
            key={ch.id}
            onLayout={(e) => {
              chapterOffsets.current[i] = e.nativeEvent.layout.y;
            }}
            style={i > 0 ? { marginTop: Spacing['3xl'] } : undefined}
          >
            {i > 0 && (
              <View style={styles.chapterDivider}>
                <Text style={[styles.dividerOrnament, { color: t.accent }]}>
                  ✦
                </Text>
              </View>
            )}
            <Text style={[styles.chapterEyebrow, { color: t.accent }]}>
              CHAPTER {ch.number}
            </Text>
            <Text
              style={[
                styles.chapterTitle,
                { color: t.text, fontFamily: 'serif' },
              ]}
            >
              {ch.title}
            </Text>
            {ch.paragraphs.map((p, idx) => (
              <Text
                key={idx}
                style={[
                  styles.bodyText,
                  {
                    color: t.text,
                    fontSize,
                    lineHeight: fontSize * 1.65,
                    fontFamily: fontFamily === 'serif' ? 'serif' : undefined,
                  },
                ]}
              >
                {p}
              </Text>
            ))}
          </View>
        ))}

        {/* End-of-book footer */}
        <View style={styles.endFooter}>
          <View style={[styles.endLine, { backgroundColor: t.divider }]} />
          <Text style={[styles.endText, { color: t.textMuted }]}>
            END OF BOOK
          </Text>
          <View style={[styles.endLine, { backgroundColor: t.divider }]} />
        </View>
      </ScrollView>

      {/* ── Bottom bar ── */}
      <Animated.View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + Spacing.sm,
            backgroundColor: t.toolbar,
            borderTopColor: t.toolbarBorder,
            opacity: toolbarOpacity,
            transform: [
              {
                translateY: toolbarOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents={toolbarsVisible ? 'auto' : 'none'}
      >
        <View style={styles.progressRow}>
          <View style={[styles.progressTrack, { backgroundColor: t.divider }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: t.accent,
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: t.accent }]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </Animated.View>

      {/* ── Settings sheet ── */}
      <Modal
        visible={showSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowSettings(false)}
        >
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: t.toolbar,
                borderTopColor: t.toolbarBorder,
                paddingBottom: insets.bottom + Spacing.lg,
              },
            ]}
          >
            <View style={[styles.sheetHandle, { backgroundColor: t.divider }]} />
            <Text style={[styles.sheetTitle, { color: t.text }]}>
              Reading
            </Text>

            {/* Font size */}
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: t.textMuted }]}>
                FONT SIZE
              </Text>
              <View
                style={[
                  styles.stepperRow,
                  { backgroundColor: t.bg, borderColor: t.toolbarBorder },
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    setFontSizeIdx((i) => Math.max(0, i - 1))
                  }
                  disabled={fontSizeIdx === 0}
                  style={styles.stepperBtn}
                >
                  <Text
                    style={[
                      styles.stepperA,
                      {
                        color: fontSizeIdx === 0 ? t.textMuted : t.text,
                        fontSize: 14,
                      },
                    ]}
                  >
                    A
                  </Text>
                </TouchableOpacity>
                <View
                  style={[
                    styles.stepperDivider,
                    { backgroundColor: t.toolbarBorder },
                  ]}
                />
                <View style={styles.stepperValue}>
                  <View style={styles.stepperDots}>
                    {FONT_SIZES.map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.stepperDot,
                          {
                            backgroundColor:
                              i === fontSizeIdx ? t.accent : t.divider,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <View
                  style={[
                    styles.stepperDivider,
                    { backgroundColor: t.toolbarBorder },
                  ]}
                />
                <TouchableOpacity
                  onPress={() =>
                    setFontSizeIdx((i) =>
                      Math.min(FONT_SIZES.length - 1, i + 1),
                    )
                  }
                  disabled={fontSizeIdx === FONT_SIZES.length - 1}
                  style={styles.stepperBtn}
                >
                  <Text
                    style={[
                      styles.stepperA,
                      {
                        color:
                          fontSizeIdx === FONT_SIZES.length - 1
                            ? t.textMuted
                            : t.text,
                        fontSize: 22,
                      },
                    ]}
                  >
                    A
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Font family */}
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: t.textMuted }]}>
                TYPEFACE
              </Text>
              <View
                style={[
                  styles.segmented,
                  { backgroundColor: t.bg, borderColor: t.toolbarBorder },
                ]}
              >
                <FontFamilyPill
                  label="Serif"
                  family="serif"
                  active={fontFamily === 'serif'}
                  onPress={() => setFontFamily('serif')}
                  theme={t}
                />
                <FontFamilyPill
                  label="Sans"
                  family="sans"
                  active={fontFamily === 'sans'}
                  onPress={() => setFontFamily('sans')}
                  theme={t}
                />
              </View>
            </View>

            {/* Theme */}
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: t.textMuted }]}>
                THEME
              </Text>
              <View style={styles.themeRow}>
                {(['light', 'sepia', 'dark'] as ThemeKey[]).map((k) => {
                  const tt = THEMES[k];
                  const active = theme === k;
                  return (
                    <TouchableOpacity
                      key={k}
                      style={[
                        styles.themeChip,
                        {
                          backgroundColor: tt.bg,
                          borderColor: active ? tt.accent : tt.toolbarBorder,
                          borderWidth: active ? 2 : 1,
                        },
                      ]}
                      onPress={() => setTheme(k)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.themeChipAa,
                          {
                            color: tt.text,
                            fontFamily: 'serif',
                          },
                        ]}
                      >
                        Aa
                      </Text>
                      <Text
                        style={[
                          styles.themeChipLabel,
                          { color: active ? tt.accent : tt.textMuted },
                        ]}
                      >
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowSettings(false)}
              style={[styles.doneBtn, { backgroundColor: t.accent }]}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function FontFamilyPill({
  label,
  family,
  active,
  onPress,
  theme,
}: {
  label: string;
  family: FontKey;
  active: boolean;
  onPress: () => void;
  theme: ReaderTheme;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.familyPill,
        active && {
          backgroundColor: theme.surface,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.familyPillText,
          {
            fontFamily: family === 'serif' ? 'serif' : undefined,
            color: active ? theme.text : theme.textMuted,
            fontWeight: active ? '700' : '600',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  notFoundText: {
    fontSize: 15,
  },
  notFoundBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  notFoundBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFEFB',
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1.5,
  },
  emptyTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Top bar ──
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginLeft: 6,
  },
  topBarTitleWrap: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  topBarChapter: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ── Body ──
  chapterEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
    marginBottom: 6,
  },
  chapterTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: Spacing['2xl'],
  },
  chapterDivider: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  dividerOrnament: {
    fontSize: 18,
    letterSpacing: 4,
  },
  bodyText: {
    fontWeight: '400',
    marginBottom: Spacing.base,
  },
  endFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  endLine: {
    flex: 1,
    height: 1,
  },
  endText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },

  // ── Bottom bar ──
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },

  // ── Settings modal ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth: 1,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: Spacing.lg,
  },
  settingRow: {
    marginBottom: Spacing.lg,
  },
  settingLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  // Stepper (font size)
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: 52,
    overflow: 'hidden',
  },
  stepperBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperA: {
    fontFamily: 'serif',
    fontWeight: '700',
  },
  stepperDivider: {
    width: 1,
    height: '60%',
  },
  stepperValue: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperDots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  stepperDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // Segmented (typeface)
  segmented: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: 4,
    gap: 4,
  },
  familyPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm + 2,
    alignItems: 'center',
  },
  familyPillText: {
    fontSize: 14,
  },

  // Theme chips
  themeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeChip: {
    flex: 1,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: 6,
  },
  themeChipAa: {
    fontSize: 22,
    fontWeight: '700',
  },
  themeChipLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  doneBtn: {
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFEFB',
    letterSpacing: 0.1,
  },
});
