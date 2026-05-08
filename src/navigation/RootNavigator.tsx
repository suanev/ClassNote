import React, {useCallback, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationState} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import {SyncStatusIcon} from '@components/SyncStatusIcon';
import {monitoring} from '@services/monitoring';
import {useThemeContext} from '@theme/ThemeContext';
import {ClassesStack} from './ClassesStack';
import {ObservationsStack} from './ObservationsStack';
import {SettingsStack} from './SettingsStack';
import {RootTabParamList} from './types';

function getActiveRouteName(state: NavigationState | undefined): string {
  if (!state) return '';
  const route = state.routes[state.index];
  if (route.state) return getActiveRouteName(route.state as NavigationState);
  return route.name;
}

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Classes: 'users',
  Observations: 'edit-3',
  Settings: 'settings',
};

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
    <Tab.Navigator
      screenListeners={{
        state: e => onStateChange((e.data as {state: NavigationState}).state),
      }}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 84,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSizes.sm,
          fontFamily: theme.typography.fontFamily.ui,
          fontWeight: '600',
        },
        tabBarIcon: ({color, size}) => (
          <Icon name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}>
      <Tab.Screen
        name="Observations"
        component={ObservationsStack}
        options={{title: 'Observações'}}
      />
      <Tab.Screen name="Classes" component={ClassesStack} options={{title: 'Turmas'}} />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          title: 'Ajustes',
          headerShown: true,
          headerTitle: 'Ajustes',
          headerStyle: {backgroundColor: theme.colors.surface},
          headerTintColor: theme.colors.text,
          headerRight: () => <SyncStatusIcon />,
          headerRightContainerStyle: {paddingRight: 16},
        }}
      />
    </Tab.Navigator>
  );
}
