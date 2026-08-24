import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import {
  FluentDialog,
  Text,
  Badge,
  useFluentColors,
  FluentSpacing,
} from '../fluent';
import {
  Calendar24Regular,
  Clock24Regular,
  Location24Regular,
} from '../fluent/icons';
import { programsApi } from '../../api/programs';
import { Program } from '../../types/content';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DISMISSED_KEY = 'program_popup_dismissed';

export default function ProgramPopup() {
  const [program, setProgram] = useState<Program | null>(null);
  const [visible, setVisible] = useState(false);
  const colors = useFluentColors();

  useEffect(() => {
    (async () => {
      try {
        const programs = await programsApi.upcoming();
        if (!programs || programs.length === 0) return;

        const next = programs[0];
        const eventDate = new Date(next.date);
        if (eventDate < new Date()) return; // event passed

        const dismissed = await AsyncStorage.getItem(DISMISSED_KEY);
        if (dismissed === String(next.id)) return; // already dismissed this one

        setProgram(next);
        setVisible(true);
      } catch {}
    })();
  }, []);

  const dismiss = async () => {
    setVisible(false);
    if (program) {
      await AsyncStorage.setItem(DISMISSED_KEY, String(program.id));
    }
  };

  if (!program) return null;

  const d = new Date(program.date);
  const dateStr = d.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const rows = [
    { icon: Calendar24Regular, text: dateStr },
    { icon: Clock24Regular, text: program.time },
    { icon: Location24Regular, text: program.location },
  ];

  return (
    <FluentDialog
      visible={visible}
      title={program.title}
      onDismiss={dismiss}
      actions={[{ label: 'Got it', appearance: 'primary', onPress: dismiss }]}
    >
      <View style={s.badgeRow}>
        <Badge appearance="tint" badgeColor="warning" size="medium">
          UPCOMING
        </Badge>
      </View>

      <View style={s.details}>
        {rows.map(({ icon: Icon, text }) => (
          <View key={text} style={s.detailRow}>
            <Icon color={colors.brandForeground1 as string} />
            <Text variant="body2" color={colors.neutralForeground2 as string} style={s.flex}>
              {text}
            </Text>
          </View>
        ))}
      </View>

      <Text
        variant="body2"
        color={colors.neutralForeground2 as string}
        numberOfLines={3}
      >
        {program.description}
      </Text>
    </FluentDialog>
  );
}

const s = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    marginBottom: FluentSpacing.xs,
  },
  details: {
    gap: FluentSpacing.s,
    marginVertical: FluentSpacing.s,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FluentSpacing.s,
  },
  flex: { flex: 1 },
});
