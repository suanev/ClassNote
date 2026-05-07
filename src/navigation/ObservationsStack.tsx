import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

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
    </Stack.Navigator>
  );
}
