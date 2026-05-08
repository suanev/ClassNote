import styled from 'styled-components/native';

export const ToastWrapper = styled.View<{safeTop: number}>`
  position: absolute;
  left: ${({theme}) => theme.spacing[5]}px;
  right: ${({theme}) => theme.spacing[5]}px;
  top: ${({safeTop, theme}) => safeTop + theme.spacing[3]}px;
  z-index: ${({theme}) => theme.zIndex.toast};
`;

export const ToastRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing[2]}px;
  padding-horizontal: ${({theme}) => theme.spacing[4]}px;
  padding-vertical: ${({theme}) => theme.spacing[3]}px;
  border-radius: ${({theme}) => theme.radii.pill}px;
  background-color: ${({theme}) => theme.colors.danger};
  ${({theme}) => theme.shadows.lg};
`;

export const ToastLabel = styled.Text`
  flex: 1;
  color: #ffffff;
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;
