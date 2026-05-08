import React from 'react';
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
}: InputProps) => {
  const theme = useTheme();

  return (
    <InputWrapper marginTop={marginTop} multiline={multiline}>
      {icon ? <Feather name={icon} size={18} color={theme.colors.textSubtle} /> : null}
      <InputField
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSubtle}
        value={value}
        onChangeText={onChangeText}
      />
    </InputWrapper>
  );
};
