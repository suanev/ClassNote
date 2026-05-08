import React from 'react';
import {ButtonVariant, ButtonComponent} from './styles';

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

export const Button = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  icon,
  minWidth,
  variant = 'fill',
  accessibilityLabel,
  testID,
}: ButtonProps) => {
  return (
    <ButtonComponent
      minWidth={minWidth}
      variant={variant}
      icon={icon}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      compact={!children}
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      {children}
    </ButtonComponent>
  );
};
