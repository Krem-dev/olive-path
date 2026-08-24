/**
 * QAScreen — migrated to Fluent UI.
 *
 * Each question is an expanding FluentCard; categories are Fluent Chips and
 * the search field is Fluent's Input.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Input,
  Text,
  Spinner,
  Divider,
  FluentCard,
  useFluentColors,
  FluentSpacing,
} from '../../components/fluent';
import {
  Search24Regular,
  ChatMultiple24Regular,
  Add24Regular,
  Subtract24Regular,
  BookOpen16Regular,
} from '../../components/fluent/icons';
import { qaApi } from '../../api/qa';
import { useFetch } from '../../hooks/useFetch';
import { QAItem } from '../../types/content';
import { EmptyState, FilterPills } from '../../components/ui';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function QAScreen() {
  const insets = useSafeAreaInsets();
  const colors = useFluentColors();

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const itemsFetch = useFetch(
    () =>
      qaApi.list({
        category: category === 'All' ? undefined : category,
        search: debounced || undefined,
      }),
    [category, debounced],
  );
  const catsFetch = useFetch(() => qaApi.categories(), []);

  const items = itemsFetch.data ?? [];
  const categoryOptions = ['All', ...(catsFetch.data ?? [])].map((c) => ({
    key: c,
    label: c,
  }));

  const toggle = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }: { item: QAItem }) => {
    const open = expandedId === item.id;
    const Toggle = open ? Subtract24Regular : Add24Regular;

    return (
      <FluentCard appearance="filled" size="large" onPress={() => toggle(item.id)}>
        <View style={s.cardTop}>
          <Text variant="body1Strong" style={s.flex}>
            {item.question}
          </Text>
          <Toggle color={colors.neutralForeground3 as string} />
        </View>

        {open && (
          <View style={s.answerWrap}>
            <Divider />
            <Text
              variant="body2"
              color={colors.neutralForeground2 as string}
              style={s.answer}
            >
              {item.answer}
            </Text>
            <View style={s.refRow}>
              <BookOpen16Regular color={colors.brandForeground1 as string} />
              <Text variant="caption1Strong" color={colors.brandForeground1 as string}>
                {item.scripture}
              </Text>
            </View>
          </View>
        )}
      </FluentCard>
    );
  };

  return (
    <View
      style={[
        s.screen,
        { paddingTop: insets.top, backgroundColor: colors.neutralBackground3 as string },
      ]}
    >
      <View style={s.header}>
        <Text variant="title1">Q&amp;A</Text>
      </View>

      <View style={s.gutter}>
        <Input
          placeholder="Search questions…"
          value={search}
          onChange={setSearch}
          defaultIcon={{ svgSource: { src: Search24Regular } }}
          accessoryButtonOnPress={() => setSearch('')}
          accessoryIconAccessibilityLabel="Clear search"
          accessibilityLabel="Search questions"
          textInputProps={{ autoCapitalize: 'none', returnKeyType: 'search' }}
        />
      </View>

      <View style={s.filters}>
        <FilterPills options={categoryOptions} activeKey={category} onSelect={setCategory} />
      </View>

      {itemsFetch.loading ? (
        <Spinner style={s.loader} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: FluentSpacing.l,
            paddingBottom: insets.bottom + FluentSpacing.xxxl,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={s.gap} />}
          ListEmptyComponent={
            <EmptyState icon={ChatMultiple24Regular} title="No questions yet" />
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  gutter: { paddingHorizontal: FluentSpacing.l },
  header: {
    paddingHorizontal: FluentSpacing.l,
    paddingTop: FluentSpacing.m,
    paddingBottom: FluentSpacing.s,
  },
  filters: { marginTop: FluentSpacing.m, marginBottom: FluentSpacing.s },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: FluentSpacing.m,
  },
  answerWrap: { marginTop: FluentSpacing.s, gap: FluentSpacing.s },
  answer: { lineHeight: 22 },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.xs,
  },
  gap: { height: FluentSpacing.mNudge },
  loader: { marginTop: FluentSpacing.xxxl },
});
