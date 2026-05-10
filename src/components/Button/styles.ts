import styled from 'styled-components/native';

interface ButtonContainerProps {
  $backgroundColor: string;
  $borderColor: string;
  $borderWidth: number;
  $borderRadius: number;
  $isIconOnly: boolean;
  $minWidth?: number;
}

export const ButtonContainer = styled.Pressable<ButtonContainerProps>`
  height: 48px;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  background-color: ${({$backgroundColor}) => $backgroundColor};
  border-color: ${({$borderColor}) => $borderColor};
  border-width: ${({$borderWidth}) => $borderWidth}px;
  border-radius: ${({$borderRadius}) => $borderRadius}px;
  width: ${({$isIconOnly}) => ($isIconOnly ? '48px' : 'auto')};
  min-width: ${({$minWidth}) => ($minWidth ? `${$minWidth}px` : 'auto')};
  padding-horizontal: ${({$isIconOnly}) => ($isIconOnly ? '0px' : '20px')};
`;

export const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

interface ButtonLabelProps {
  $color: string;
}

export const ButtonLabel = styled.Text<ButtonLabelProps>`
  font-size: 15px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: ${({$color}) => $color};
  font-family: ${({theme}) =>
    theme.typography.fonts?.uiMedium ?? theme.typography.fontFamily.ui};
`;

export const ButtonIconWrapper = styled.View`
  margin-top: 1px;
`;
