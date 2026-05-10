import styled from 'styled-components/native';

export const ShiftSection = styled.View`
  margin-top: 16px;
`;

export const SectionLabel = styled.Text`
  margin-bottom: 10px;
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

export const ButtonContainer = styled.View`
  flex: 1;
`;

export const FooterRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 24px;
`;
