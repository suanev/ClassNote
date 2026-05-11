import React, {useState} from 'react';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

import {InputField, InputWrapper} from './styles';

interface InputProps {
  icon?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  marginTop?: number;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  testID?: string;
  accessibilityLabel?: string;
  withinBottomSheet?: boolean;
}

export const Input = ({
  icon,
  placeholder,
  value,
  onChangeText,
  marginTop,
  multiline = false,
  numberOfLines,
  autoCapitalize = 'sentences',
  testID,
  accessibilityLabel,
  withinBottomSheet = false,
}: InputProps) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <InputWrapper marginTop={marginTop} multiline={multiline} focused={focused}>
      {icon ? <Feather name={icon} size={18} color={theme.colors.textMuted} /> : null}
      <InputField
        as={withinBottomSheet ? BottomSheetTextInput : undefined}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
      />
    </InputWrapper>
  );
};
