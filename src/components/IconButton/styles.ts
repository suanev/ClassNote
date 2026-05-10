import styled from 'styled-components/native';

export const IconButtonRoot = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: ${({theme}) => theme.radii.md}px;
  align-items: center;
  justify-content: center;
`;

export const IconButtonBadge = styled.View`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const IconButtonBadgeText = styled.Text`
  color: ${({theme}) => theme.colors.surface};
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
`;
