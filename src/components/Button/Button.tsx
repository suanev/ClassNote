import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'dangerSolid'
  | 'dangerStrong'
  | 'fill'      // legacy alias → primary
  | 'outline'   // legacy alias → secondary
  | 'text';     // legacy alias → ghost

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
    dangerStrong: '#7A1A12',
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
    primary: '#FFFFFF',
    secondary: theme.colors.text,
    ghost: theme.colors.text,
    danger: theme.colors.danger,
    dangerSolid: '#FFFFFF',
    dangerStrong: '#FFFFFF',
  }[resolved];

  const spinnerColor =
    resolved === 'primary' || resolved === 'dangerSolid' || resolved === 'dangerStrong'
      ? '#FFFFFF'
      : theme.colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={({pressed}) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderColor,
          borderWidth: borderColor === 'transparent' ? 0 : 1,
          borderRadius: theme.radii.control,
          width: isIconOnly ? 48 : undefined,
          minWidth: minWidth ?? undefined,
          paddingHorizontal: isIconOnly ? 0 : 20,
          opacity: disabled ? 0.5 : pressed ? 0.75 : 1,
        },
      ]}>
      <View style={styles.content}>
        {loading ? (
          <>
            <ActivityIndicator size="small" color={spinnerColor} />
            {children && !isIconOnly ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: textColor,
                    fontFamily: theme.typography.fonts?.uiMedium ?? theme.typography.fontFamily.ui,
                  },
                ]}>
                {children}
              </Text>
            ) : null}
          </>
        ) : (
          <>
            {icon ? <Feather name={icon} size={18} color={textColor} style={styles.icon} /> : null}
            {children ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: textColor,
                    fontFamily: theme.typography.fonts?.uiMedium ?? theme.typography.fontFamily.ui,
                  },
                ]}>
                {children}
              </Text>
            ) : null}
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 48,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: -0.15,
  },
  icon: {
    marginTop: 1,
  },
});
