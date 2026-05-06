import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ObservationsScreen} from '@shared/components/ObservationsScreen';

const Stack = createStackNavigator();

export function ObservationsStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ObservationsHome"
        component={ObservationsScreen}
        options={{title: 'Observacoes'}}
      />
    </Stack.Navigator>
  );
}
