import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.bg};
`;

export const Section = styled.View`
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  margin-bottom: 8px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.size.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: 600;
  letter-spacing: 1.1px;
`;

export const ChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const SheetBody = styled.View`
  padding-top: 8px;
  padding-bottom: 24px;
`;

export const SheetDescription = styled.Text`
  color: ${({theme}) => theme.colors.textMutedStrong};
  font-size: ${({theme}) => theme.typography.size.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 22px;
  margin-bottom: 20px;
`;

export const SheetActions = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const DeleteButtonContainer = styled.View`
  width: 48px;
`;

export const PrimaryButtonContainer = styled.View`
  flex: 1;
`;

export const DialogButtonContainer = styled.View`
  flex: 1;
`;

export const formScrollStyle = {
  paddingHorizontal: 20,
  paddingTop: 12,
  paddingBottom: 100,
} as const;
