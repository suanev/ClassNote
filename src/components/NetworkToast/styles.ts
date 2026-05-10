import styled from 'styled-components/native';

export const ToastWrapper = styled.View<{safeTop: number}>`
  position: absolute;
  left: 20px;
  right: 20px;
  top: ${({safeTop}) => safeTop + 12}px;
  z-index: ${({theme}) => theme.zIndex.toast};
`;

export const ToastRow = styled.View<{status: 'offline' | 'restored'}>`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing[2]}px;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  border-radius: 6px;
  background-color: ${({theme, status}) =>
    status === 'restored' ? theme.colors.success : theme.colors.danger};
  ${({theme}) => theme.shadows.xl};
`;

export const ToastLabel = styled.Text`
  flex: 1;
  color: #FAF8F2;
  font-size: ${({theme}) => theme.typography.size.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: 600;
`;
