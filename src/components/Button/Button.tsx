import React from 'react';
import {ActivityIndicator} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

import {
  ButtonContainer,
  ButtonContent,
  ButtonIconWrapper,
  ButtonLabel,
} from './styles';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'dangerSolid'
  | 'dangerStrong'
  | 'fill'
  | 'outline'
  | 'text';

interface ButtonProps {
  children?: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  minWidth?: number;
  variant?: ButtonVariant;
  accessibilityLabel?: string;
  testID?: string;
}

const resolveVariant = (
  v: ButtonVariant,
): 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerSolid' | 'dangerStrong' => {
  if (v === 'fill') return 'primary';
  if (v === 'outline') return 'secondary';
  if (v === 'text') return 'ghost';
  return v;
};

export const Button = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  icon,
  minWidth,
  variant = 'primary',
  accessibilityLabel,
  testID,
}: ButtonProps) => {
  const theme = useTheme();
  const resolved = resolveVariant(variant);
  const isIconOnly = Boolean(icon) && !children;

  const bg = {
    primary: theme.colors.primary,
    secondary: 'transparent',
    ghost: 'transparent',
    danger: 'transparent',
    dangerSolid: theme.colors.danger,
    dangerStrong: theme.colors.errorSubtle,
  }[resolved];

  const borderColor = {
    primary: 'transparent',
    secondary: theme.colors.borderStrong,
    ghost: 'transparent',
    danger: theme.colors.danger,
    dangerSolid: 'transparent',
    dangerStrong: 'transparent',
  }[resolved];

  const textColor = {
    primary: theme.colors.surface,
    secondary: theme.colors.text,
    ghost: theme.colors.text,
    danger: theme.colors.danger,
    dangerSolid: theme.colors.surface,
    dangerStrong: theme.colors.surface,
  }[resolved];

  const spinnerColor =
    resolved === 'primary' || resolved === 'dangerSolid' || resolved === 'dangerStrong'
      ? theme.colors.surface
      : theme.colors.primary;

  return (
    <ButtonContainer
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      $backgroundColor={bg}
      $borderColor={borderColor}
      $borderWidth={borderColor === 'transparent' ? 0 : 1}
      $borderRadius={theme.radii.control}
      $isIconOnly={isIconOnly}
      $minWidth={minWidth}
      $disabled={disabled || loading}
      style={({pressed}) => ({opacity: disabled ? 0.5 : pressed ? 0.75 : 1})}>
      <ButtonContent>
        {loading ? (
          <>
            <ActivityIndicator size="small" color={spinnerColor} />
            {children && !isIconOnly ? <ButtonLabel $color={textColor}>{children}</ButtonLabel> : null}
          </>
        ) : (
          <>
            {icon ? (
              <ButtonIconWrapper>
                <Feather name={icon} size={18} color={textColor} />
              </ButtonIconWrapper>
            ) : null}
            {children ? <ButtonLabel $color={textColor}>{children}</ButtonLabel> : null}
          </>
        )}
      </ButtonContent>
    </ButtonContainer>
  );
};
