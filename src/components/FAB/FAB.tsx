import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

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
    <View style={[styles.container, {right, bottom}]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={({pressed}) => [
          styles.fab,
          {backgroundColor: theme.colors.primary},
          theme.shadows.fab,
          {opacity: disabled ? 0.5 : pressed ? 0.85 : 1},
        ]}>
        <Feather name={icon} size={26} color={theme.colors.onPrimary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
