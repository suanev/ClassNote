import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  padding: 24px;
  background-color: ${({theme}) => theme.colors.background};
`;

const Title = styled(Text)`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.xl}px;
  font-weight: ${({theme}) => theme.typography.fontWeights.bold};
  margin-bottom: ${({theme}) => theme.spacing.sm}px;
`;

const Description = styled(Text)`
  color: ${({theme}) => theme.colors.mutedText};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  line-height: 22px;
`;

export function ClassesScreen(): React.JSX.Element {
  return (
    <Container>
      <Title>Teacher Observations</Title>
      <Description>
        Estrutura inicial pronta para a feature de turmas.
      </Description>
    </Container>
  );
}
