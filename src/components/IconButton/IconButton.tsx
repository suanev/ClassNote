import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components/native';

import {
  IconButtonBadge,
  IconButtonBadgeText,
  IconButtonRoot,
} from './styles';

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
    <IconButtonRoot
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{disabled}}
      hitSlop={8}
      style={({pressed}) => ({opacity: pressed ? 0.7 : 1})}>
      {iconNode}
      {showBadge && (
        <IconButtonBadge>
          <IconButtonBadgeText>{badgeCount! > 9 ? '9+' : badgeCount}</IconButtonBadgeText>
        </IconButtonBadge>
      )}
    </IconButtonRoot>
  );
};
