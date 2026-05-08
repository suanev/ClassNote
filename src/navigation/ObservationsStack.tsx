import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ObservationFormScreen from '@scenes/ObservationFormScreen';
import {ObservationsScreen} from '@scenes/ObservationsScreen';
import {ObservationsStackParamList} from './types';

const Stack = createStackNavigator<ObservationsStackParamList>();

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
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
