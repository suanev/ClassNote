import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SettingsScreenContainer from '@scenes/SettingsScreen';
import {SettingsStackParamList} from './types';

const Stack = createStackNavigator<SettingsStackParamList>();

export const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SettingsHome" component={SettingsScreenContainer} />

      {/* Rota disponível apenas em desenvolvimento */}
      {__DEV__ ? (
        <Stack.Screen
          name="DesignSystem"
          getComponent={() => require('@scenes/DesignSystemScreen').default}
          options={{
            headerShown: true,
            headerTitle: 'Design System',
            headerBackTitle: 'Ajustes',
          }}
        />
      ) : null}
    </Stack.Navigator>
  );
};
