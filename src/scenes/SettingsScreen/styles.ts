import {Button, Text} from 'react-native-paper';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const Section = styled.View`
  margin-top: ${({theme}) => theme.spacing.lg}px;
  margin-horizontal: ${({theme}) => theme.spacing.md}px;
`;

export const SectionLabel = styled(Text)`
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: ${({theme}) => theme.spacing.sm}px;
  opacity: 0.55;
`;

export const Card = styled.View`
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
`;

export const ClearButton = styled(Button)`
  margin-top: 12px;
  border-color: #fecaca;
`;

export const SectionsList = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 40,
  },
})``;
