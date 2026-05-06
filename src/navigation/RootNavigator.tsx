import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import {ClassesStack} from './ClassesStack';
import {ObservationsStack} from './ObservationsStack';
import {SettingsScreen} from '@features/settings/screens/SettingsScreen';
import {RootStackParamList} from './types';
import {useThemeContext} from '@app/providers/ThemeContext';

const Tab = createBottomTabNavigator<RootStackParamList>();

const TAB_ICONS: Record<keyof RootStackParamList, string> = {
  Classes: 'users',
  Observations: 'file-text',
  Settings: 'settings',
};

export function RootNavigator(): React.JSX.Element {
  const {theme} = useThemeContext();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarIcon: ({color, size}) => (
          <Icon name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}>
      <Tab.Screen name="Classes" component={ClassesStack} options={{title: 'Turmas'}} />
      <Tab.Screen
        name="Observations"
        component={ObservationsStack}
        options={{title: 'Observações'}}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{title: 'Ajustes', headerShown: true, headerTitle: 'Ajustes', headerStyle: {backgroundColor: theme.colors.surface}, headerTintColor: theme.colors.text}} />
    </Tab.Navigator>
  );
}
