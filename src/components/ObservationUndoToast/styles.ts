import styled from 'styled-components/native';

export const ToastContainer = styled.View`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 110px;
  z-index: ${({theme}) => theme.zIndex.toast};
`;

export const ToastCard = styled.View`
  min-height: 56px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({theme}) => theme.spacing[3]}px;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  border-radius: 6px;
  background-color: #1C1815;
  ${({theme}) => theme.shadows.xl};
`;

export const Message = styled.Text`
  flex: 1;
  color: #FAF8F2;
  font-size: ${({theme}) => theme.typography.size.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: 500;
`;

export const ActionButton = styled.Pressable`
  min-width: 72px;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding-horizontal: 12px;
`;

export const ActionLabel = styled.Text`
  color: #7DA3D4;
  font-size: ${({theme}) => theme.typography.size.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: 600;
`;
