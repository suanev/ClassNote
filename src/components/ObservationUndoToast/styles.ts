import styled from 'styled-components/native';

export const ToastContainer = styled.View`
  position: absolute;
  left: ${({theme}) => theme.spacing[5]}px;
  right: ${({theme}) => theme.spacing[5]}px;
  bottom: 108px;
  z-index: ${({theme}) => theme.zIndex.toast};
`;

export const ToastCard = styled.View`
  min-height: 56px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({theme}) => theme.spacing[3]}px;
  padding-horizontal: ${({theme}) => theme.spacing[4]}px;
  padding-vertical: ${({theme}) => theme.spacing[3]}px;
  border-radius: ${({theme}) => theme.radii.xl}px;
  background-color: ${({theme}) => theme.colors.text};
  ${({theme}) => theme.shadows.lg};
`;

export const Message = styled.Text`
  flex: 1;
  color: ${({theme}) => theme.colors.surface};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.medium};
`;

export const ActionButton = styled.Pressable`
  min-width: 72px;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: ${({theme}) => theme.radii.pill}px;
  background-color: ${({theme}) => theme.colors.primarySubtle};
  padding-horizontal: ${({theme}) => theme.spacing[3]}px;
`;

export const ActionLabel = styled.Text`
  color: ${({theme}) => theme.colors.primaryActive};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;
