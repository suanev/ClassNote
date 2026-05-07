import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View} from 'react-native';
import styled from 'styled-components/native';

import {ObservationsScreen} from '@scenes/ObservationsScreen';
import {ObservationsStackParamList} from './types';

const Stack = createStackNavigator<ObservationsStackParamList>();

const PlaceholderContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.bg};
`;

const PlaceholderText = styled.Text`
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
`;

const ObservationFormScreen = () => (
  <PlaceholderContainer>
    <PlaceholderText>Formulário de observação em construção.</PlaceholderText>
  </PlaceholderContainer>
);

export const ObservationsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ObservationsHome"
        component={ObservationsScreen}
        options={{title: 'Observacoes'}}
      />
      <Stack.Screen
        name="ObservationForm"
        component={ObservationFormScreen}
        options={{title: 'Nova observação', headerShown: true}}
      />
    </Stack.Navigator>
  );
}
