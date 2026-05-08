import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

interface FABProps {
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  right?: number;
  bottom?: number;
  accessibilityLabel?: string;
  testID?: string;
}

export const FAB = ({
  icon = 'plus',
  onPress,
  disabled = false,
  size = 64,
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
        style={({pressed}) => ({
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: pressed ? theme.colors.primaryHover : theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 4,
        })}>
        <Feather
          name={icon}
          size={Math.round(size * 0.38)}
          color={theme.colors.onPrimary}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
