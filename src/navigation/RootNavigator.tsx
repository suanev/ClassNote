import React, {useCallback, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationState} from '@react-navigation/native';

import {isDev} from '@constants/environment';
import {monitoring} from '@services/monitoring';
import {useThemeContext} from '@theme/ThemeContext';
import ObservationFormScreen from '@scenes/ObservationFormScreen';
import {ObservationsScreen} from '@scenes/ObservationsScreen';
import SettingsScreenContainer from '@scenes/SettingsScreen';
import {RootStackParamList} from './types';

function getActiveRouteName(state: NavigationState | undefined): string {
  if (!state) {return '';}
  const route = state.routes[state.index];
  if (route.state) {return getActiveRouteName(route.state as NavigationState);}
  return route.name;
}

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const {theme} = useThemeContext();
  const routeNameRef = useRef<string>('');

  const onStateChange = useCallback((state: NavigationState | undefined) => {
    const currentRoute = getActiveRouteName(state);
    if (currentRoute !== routeNameRef.current) {
      monitoring.logScreen(currentRoute);
      routeNameRef.current = currentRoute;
    }
  }, []);

  return (
    <Stack.Navigator
      screenListeners={{
        state: e => onStateChange((e.data as {state: NavigationState}).state),
      }}
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: theme.colors.bg},
      }}>
      <Stack.Screen name="ObservationsHome" component={ObservationsScreen} />
      <Stack.Screen name="ObservationForm" component={ObservationFormScreen} />
      <Stack.Screen name="Settings" component={SettingsScreenContainer} />
      {isDev ? (
        <Stack.Screen
          name="DesignSystem"
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          getComponent={() => require('@scenes/DesignSystemScreen').default}
          options={{
            headerShown: true,
            headerTitle: 'Design System',
            headerBackTitle: 'Ajustes',
            headerStyle: {backgroundColor: theme.colors.surface},
            headerTintColor: theme.colors.text,
          }}
        />
      ) : null}
    </Stack.Navigator>
  );
};
