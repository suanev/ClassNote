import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ClassesScreen} from '@scenes/ClassesScreen';
import {ClassDetailScreen} from '@scenes/ClassDetailScreen';
import {ClassesStackParamList} from './types';

const Stack = createStackNavigator<ClassesStackParamList>();

export const ClassesStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ClassesHome" component={ClassesScreen} />
      <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
    </Stack.Navigator>
  );
};
