import React from 'react';
import {Pressable, Text, StyleSheet, View} from 'react-native';
import {useTheme} from 'styled-components/native';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  variant?: 'default' | 'dashed';
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: 'radio' | 'checkbox' | 'button';
  accessibilityState?: {selected?: boolean; checked?: boolean};
}

export const Chip = ({
  label,
  active = false,
  onPress,
  variant = 'default',
  testID,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
}: ChipProps) => {
  const theme = useTheme();
  const isDashed = variant === 'dashed';

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState ?? (accessibilityRole === 'radio' ? {selected: active} : undefined)}
      style={({pressed}) => [
        styles.chip,
        {
          backgroundColor: active ? theme.colors.primary : 'transparent',
          borderColor: isDashed
            ? theme.colors.borderStrong
            : active
            ? theme.colors.primary
            : theme.colors.border,
          borderStyle: isDashed ? 'dashed' : 'solid',
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      {isDashed && (
        <Text style={[styles.plusIcon, {color: theme.colors.textMuted}]}>+</Text>
      )}
      <Text
        style={[
          styles.label,
          {
            color: active ? '#FFFFFF' : theme.colors.text,
            fontFamily: theme.typography.fonts?.uiMedium ?? theme.typography.fontFamily.ui,
          },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
  plusIcon: {
    fontSize: 16,
    lineHeight: 20,
    marginRight: 2,
  },
});
