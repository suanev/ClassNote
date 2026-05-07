import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ObservationsScreen} from '@shared/components/ObservationsScreen';

const Stack = createStackNavigator();

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
