import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

import {FabButton, FabContainer} from './styles';

interface FABProps {
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
  right?: number;
  bottom?: number;
  accessibilityLabel?: string;
  testID?: string;
}

export const FAB = ({
  icon = 'plus',
  onPress,
  disabled = false,
  right = 24,
  bottom = 28,
  accessibilityLabel = 'Criar observação',
  testID = 'floating-action-button',
}: FABProps) => {
  const theme = useTheme();

  return (
    <FabContainer $right={right} $bottom={bottom}>
      <FabButton
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={({pressed}) => [
          theme.shadows.fab,
          {opacity: disabled ? 0.5 : pressed ? 0.85 : 1},
        ]}>
        <Feather name={icon} size={26} color={theme.colors.onPrimary} />
      </FabButton>
    </FabContainer>
  );
};
