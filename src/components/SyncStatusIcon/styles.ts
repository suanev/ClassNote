import styled from 'styled-components/native';
import {Surface, Text} from 'react-native-paper';

export const Wrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

export const BackdropPressable = styled.Pressable`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

interface TooltipCardProps {
  $top?: number;
  $right?: number;
}

export const TooltipCard = styled(Surface)<TooltipCardProps>`
  position: absolute;
  padding-horizontal: 12px;
  padding-vertical: 8px;
  border-radius: ${({theme}) => theme.radii.md}px;
  max-width: 220px;
  top: ${({$top}) => ($top !== undefined ? `${$top}px` : '32px')};
  right: ${({$right}) => ($right !== undefined ? `${$right}px` : '0px')};
  background-color: ${({theme}) => theme.colors.surfaceInverse};
`;

export const TooltipLabel = styled(Text)`
  font-size: 13px;
  line-height: 18px;
  color: ${({theme}) => theme.colors.textOnInverse};
`;
