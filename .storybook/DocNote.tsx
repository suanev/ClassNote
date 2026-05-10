/* eslint-disable react/prop-types */
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTheme} from 'styled-components/native';

interface Prop {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

interface DocNoteProps {
  title: string;
  description: string;
  props?: Prop[];
  notes?: string[];
}

export const DocNote = ({title, description, props, notes}: DocNoteProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const hasNotes = Boolean(notes?.length);
  const hasProps = Boolean(props?.length);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scroll}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {hasNotes ? (
        <View style={styles.section}>
          {notes?.map((note, index) => (
            <View key={`${note}-${index}`} style={styles.noteRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {hasProps ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PROPS</Text>
          {props?.map(prop => (
            <View key={prop.name} style={styles.propRow}>
              <View style={styles.propHeader}>
                <Text style={styles.propName}>{prop.name}</Text>
                {prop.required ? <Text style={styles.required}>obrigatório</Text> : null}
                <Text style={styles.propType}>{prop.type}</Text>
              </View>
              <Text style={styles.propDesc}>{prop.description}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
};

const createStyles = (theme: ReactNativeTheme) =>
  StyleSheet.create({
    scroll: {
      backgroundColor: theme.colors.bg,
    },
    container: {
      padding: 20,
      gap: 12,
    },
    title: {
      fontSize: theme.typography.size.xl,
      fontFamily: theme.typography.fonts.displayMedium,
      color: theme.colors.text,
      marginBottom: 4,
    },
    description: {
      fontSize: theme.typography.size.md,
      lineHeight: 22,
      color: theme.colors.textMutedStrong,
      fontFamily: theme.typography.fontFamily.ui,
    },
    section: {
      marginTop: 8,
      gap: 10,
    },
    sectionLabel: {
      fontSize: theme.typography.size.xs,
      fontFamily: theme.typography.fonts.uiMedium,
      letterSpacing: 1.1,
      color: theme.colors.textMuted,
      marginBottom: 4,
    },
    noteRow: {
      flexDirection: 'row',
      gap: 8,
    },
    bullet: {
      fontSize: theme.typography.size.md,
      color: theme.colors.textMuted,
      lineHeight: 22,
    },
    noteText: {
      flex: 1,
      fontSize: theme.typography.size.sm,
      lineHeight: 21,
      color: theme.colors.textMutedStrong,
      fontFamily: theme.typography.fontFamily.ui,
    },
    propRow: {
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.border,
      paddingLeft: 12,
      gap: 3,
    },
    propHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    propName: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.mono,
    },
    propType: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.mono,
    },
    required: {
      fontSize: 11,
      color: theme.colors.danger,
      fontFamily: theme.typography.fonts.uiMedium,
      letterSpacing: 0.3,
    },
    propDesc: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.colors.textMutedStrong,
      fontFamily: theme.typography.fontFamily.ui,
    },
  });

type ReactNativeTheme = ReturnType<typeof useTheme>;
