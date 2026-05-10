import React from 'react';
import {Pressable, View, Text, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components/native';

type IconLibrary = 'feather' | 'material-community';

interface IconButtonProps {
  icon: string;
  iconLibrary?: IconLibrary;
  onPress?: () => void;
  badgeCount?: number;
  testID?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
}

export const IconButton = ({
  icon,
  iconLibrary = 'feather',
  onPress,
  badgeCount,
  testID,
  accessibilityLabel,
  disabled = false,
}: IconButtonProps) => {
  const theme = useTheme();
  const showBadge = badgeCount !== undefined && badgeCount > 0;
  const iconColor = theme.colors.textMutedStrong;

  const iconNode =
    iconLibrary === 'material-community' ? (
      <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
    ) : (
      <Feather name={icon} size={22} color={iconColor} />
    );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{disabled}}
      hitSlop={8}
      style={({pressed}) => [styles.btn, {opacity: pressed ? 0.7 : 1}]}>
      {iconNode}
      {showBadge && (
        <View style={[styles.badge, {backgroundColor: theme.colors.primary}]}>
          <Text style={styles.badgeText}>{badgeCount! > 9 ? '9+' : badgeCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
  },
});
