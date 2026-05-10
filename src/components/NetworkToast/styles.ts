import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

interface ToastRowProps {
  status: 'offline' | 'restored';
}

interface ToastWrapperProps {
  safeTop: number;
}

export const ToastWrapper = styled(Animated.View)<ToastWrapperProps>`
  position: absolute;
  left: 20px;
  right: 20px;
  top: ${({ safeTop }) => safeTop + 12}px;
  z-index: ${({ theme }) => theme.zIndex.toast};
`;

export const ToastRow = styled.View<ToastRowProps>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]}px;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  border-radius: 6px;
  background-color: ${({ theme, status }) =>
    status === 'restored' ? theme.colors.success : theme.colors.danger};
  ${({ theme }) => theme.shadows.xl};
`;

export const ToastLabel = styled.Text`
  flex: 1;
  color: ${({theme}) => theme.colors.onPrimaryMuted};
  font-size: ${({ theme }) => theme.typography.size.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.ui};
  font-weight: 600;
`;
