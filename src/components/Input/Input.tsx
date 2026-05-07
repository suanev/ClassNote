import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

import {InputField, InputWrapper} from './styles';

interface InputProps {
  icon?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  mt?: number;
}

export const Input = ({
  icon,
  placeholder,
  value,
  onChangeText,
  mt,
}: InputProps) => {
  const theme = useTheme();

  return (
    <InputWrapper $mt={mt}>
      {icon ? <Feather name={icon} size={18} color={theme.colors.textSubtle} /> : null}
      <InputField
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSubtle}
        value={value}
        onChangeText={onChangeText}
      />
    </InputWrapper>
  );
};
