import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  padding: 24px;
  background-color: ${({theme}) => theme.colors.surface};
`;

const Title = styled(Text)`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.lg}px;
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  margin-bottom: ${({theme}) => theme.spacing.sm}px;
`;

const Description = styled(Text)`
  color: ${({theme}) => theme.colors.mutedText};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  line-height: 22px;
`;

export function ObservationsScreen(): React.JSX.Element {
  return (
    <Container>
      <Title>Observacoes</Title>
      <Description>
        Navegacao, tema e providers iniciais configurados para evoluir a feature.
      </Description>
    </Container>
  );
}
