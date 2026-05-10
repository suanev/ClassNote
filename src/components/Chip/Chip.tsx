import React from 'react';
import {useTheme} from 'styled-components/native';

import {ChipButton, ChipLabel, ChipPlusIcon} from './styles';

type ChipVariant = 'default' | 'dashed';
type ChipRole = 'radio' | 'checkbox' | 'button';
type ChipState = { selected?: boolean; checked?: boolean };

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  variant?: ChipVariant;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: ChipRole;
  accessibilityState?: ChipState;
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
    <ChipButton
      onPress={onPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole={accessibilityRole}
      accessibilityState={
        accessibilityState ?? (accessibilityRole === 'radio' ? { selected: active } : undefined)
      }
      $active={active}
      $dashed={isDashed}
      style={({pressed}) => ({opacity: pressed ? 0.7 : 1, borderStyle: isDashed ? 'dashed' : 'solid'})}>
      {isDashed ? <ChipPlusIcon>+</ChipPlusIcon> : null}
      <ChipLabel $active={active}>{label}</ChipLabel>
    </ChipButton>
  );
};
