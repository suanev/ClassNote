import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ClassesScreen} from '@shared/components/ClassesScreen';

const Stack = createStackNavigator();

export function ClassesStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClassesHome"
        component={ClassesScreen}
        options={{title: 'Turmas'}}
      />
    </Stack.Navigator>
  );
}
