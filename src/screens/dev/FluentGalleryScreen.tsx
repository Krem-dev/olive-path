/**
 * FluentGalleryScreen — every Fluent component the app has available,
 * on one scrollable page.
 *
 * This is a review surface, not a product screen. Point a navigator at it to
 * check the Fluent look on a real device before converting real screens.
 */

import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  FAB,
  Text,
  Link,
  Input,
  Checkbox,
  Switch,
  Avatar,
  Divider,
  Spinner,
  Separator,
  FluentCard,
  FluentDialog,
  FluentSlider,
  FluentListItem,
  useFluentColors,
  FluentSpacing,
} from '../../components/fluent';
import {
  Play24Filled,
  Pause24Filled,
  BookOpen24Regular,
  Heart24Regular,
  ArrowDownload24Regular,
} from '../../components/fluent/icons';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useFluentColors();
  return (
    <View style={styles.section}>
      <Text variant="subtitle2" color={colors.neutralForeground1 as string}>
        {title}
      </Text>
      <Divider />
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export default function FluentGalleryScreen() {
  const colors = useFluentColors();

  const [text, setText] = useState('');
  const [checked, setChecked] = useState(true);
  const [switched, setSwitched] = useState(false);
  const [progress, setProgress] = useState(96);
  const [playing, setPlaying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.neutralBackground3 as string }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="title1">Fluent UI — Olive Path</Text>
        <Text variant="body2" color={colors.neutralForeground2 as string}>
          Stock Fluent brand ramp (#0F6CBD). Every control below is Microsoft's
          Fluent, except Card / Dialog / Slider / ListItem, which are built on
          Fluent tokens.
        </Text>

        <Section title="Buttons">
          <View style={styles.row}>
            <Button appearance="primary" onClick={() => {}}>
              Primary
            </Button>
            <Button appearance="outline" onClick={() => {}}>
              Outline
            </Button>
            <Button appearance="subtle" onClick={() => {}}>
              Subtle
            </Button>
          </View>
          <View style={styles.row}>
            <Button appearance="primary" size="small" onClick={() => {}}>
              Small
            </Button>
            <Button appearance="primary" size="large" onClick={() => {}}>
              Large
            </Button>
            <Button appearance="primary" disabled onClick={() => {}}>
              Disabled
            </Button>
          </View>
          <View style={styles.row}>
            <Button appearance="primary" loading onClick={() => {}}>
              Loading
            </Button>
            <Button appearance="outline" shape="circular" onClick={() => {}}>
              Circular
            </Button>
          </View>
          {/* CompoundButton is deliberately absent: Fluent's mobile
              implementation returns null and warns. See README gotcha #6. */}
          <View style={styles.row}>
            <FAB appearance="primary" onClick={() => {}}>
              Listen
            </FAB>
          </View>
        </Section>

        <Section title="Fields">
          <Input
            label="Email address"
            placeholder="you@example.com"
            value={text}
            onChange={setText}
            assistiveText="We'll never share this."
          />
          <Input
            label="Password"
            placeholder="Enter password"
            error="Password must be at least 8 characters"
            secureTextEntry
          />
          <Checkbox
            label="Remember me on this device"
            checked={checked}
            onChange={(_e: unknown, v: boolean) => setChecked(v)}
          />
          <Switch
            label="Download over Wi-Fi only"
            checked={switched}
            onChange={(_e: unknown, v?: boolean) => setSwitched(!!v)}
          />
        </Section>

        <Section title="Cards">
          <FluentCard appearance="filled" size="large" onPress={() => {}}>
            <Text variant="body1Strong">Featured Series</Text>
            <Text variant="body2" color={colors.neutralForeground2 as string}>
              Walking in Faith — a six-part teaching series.
            </Text>
          </FluentCard>
          <FluentCard appearance="outline" size="large">
            <Text variant="body1Strong">Outline card</Text>
            <Text variant="body2" color={colors.neutralForeground2 as string}>
              Uses neutralStroke1 for its border.
            </Text>
          </FluentCard>
          <FluentCard appearance="filled-alternative" size="large" horizontal>
            <BookOpen24Regular color={colors.brandForeground1 as string} />
            <View style={styles.flex}>
              <Text variant="body1Strong">Horizontal card</Text>
              <Text variant="caption1" color={colors.neutralForeground2 as string}>
                Leading icon plus content.
              </Text>
            </View>
          </FluentCard>
        </Section>

        <Section title="Audio scrubber (Slider)">
          <FluentCard appearance="filled" size="large">
            <FluentSlider
              value={progress}
              maximumValue={2340}
              onValueChange={setProgress}
              showTimeLabels
            />
            <View style={styles.playerRow}>
              <Button
                appearance="primary"
                shape="circular"
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? 'Pause' : 'Play'}
              </Button>
              {playing ? (
                <Pause24Filled color={colors.brandForeground1 as string} />
              ) : (
                <Play24Filled color={colors.brandForeground1 as string} />
              )}
              <Heart24Regular color={colors.neutralForeground2 as string} />
              <ArrowDownload24Regular color={colors.neutralForeground2 as string} />
            </View>
          </FluentCard>
        </Section>

        <Section title="List rows">
          <FluentCard appearance="filled" size="small" style={styles.noPad}>
            <FluentListItem
              title="The Weight of Grace"
              subtitle="Rev. Ing. Eric Ofori Broni"
              caption="39 min · Romans 5:1–11"
              leading={<BookOpen24Regular color={colors.brandForeground1 as string} />}
              showChevron
              divider
              onPress={() => {}}
            />
            <FluentListItem
              title="Standing Firm"
              subtitle="Rev. Ing. Eric Ofori Broni"
              caption="27 min · Ephesians 6:10–18"
              leading={<BookOpen24Regular color={colors.brandForeground1 as string} />}
              showChevron
              divider
              onPress={() => {}}
            />
            <FluentListItem
              title="A Living Hope"
              subtitle="Rev. Ing. Eric Ofori Broni"
              caption="44 min · 1 Peter 1:3–9"
              leading={<BookOpen24Regular color={colors.brandForeground1 as string} />}
              showChevron
              selected
              onPress={() => {}}
            />
          </FluentCard>
        </Section>

        <Section title="Dialog">
          <Button appearance="outline" onClick={() => setDialogOpen(true)}>
            Open dialog
          </Button>
          <FluentDialog
            visible={dialogOpen}
            title="Remove download?"
            message="This sermon will no longer be available offline. You can download it again at any time."
            onDismiss={() => setDialogOpen(false)}
            actions={[
              { label: 'Cancel', onPress: () => setDialogOpen(false) },
              {
                label: 'Remove',
                appearance: 'primary',
                onPress: () => setDialogOpen(false),
              },
            ]}
          />
        </Section>

        <Section title="People & status">
          <View style={styles.row}>
            <Avatar size={48} name="Eric Ofori Broni" />
            <Avatar size={40} name="Olive Path" />
            <Spinner />
          </View>
          <Separator />
          <Link onPress={() => {}}>A Fluent link</Link>
        </Section>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    padding: FluentSpacing.l,
    gap: FluentSpacing.s,
  },
  section: {
    marginTop: FluentSpacing.xl,
    gap: FluentSpacing.s,
  },
  sectionBody: {
    gap: FluentSpacing.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: FluentSpacing.s,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.l,
    marginTop: FluentSpacing.s,
  },
  flex: { flex: 1 },
  noPad: { padding: 0, overflow: 'hidden' },
  footer: { height: FluentSpacing.xxxl },
});
