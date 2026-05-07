import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ClassesScreen} from '@shared/components/ClassesScreen';

const Stack = createStackNavigator();

export const ClassesStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ClassesHome"
        component={ClassesScreen}
        options={{title: 'Turmas'}}
      />
    </Stack.Navigator>
  );
}
