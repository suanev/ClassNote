import React from 'react';
import {StatusBar} from 'react-native';

import {RootNavigator} from '@navigation/RootNavigator';
import {useThemeContext} from '@providers/ThemeContext';
import AppProviders from './providers';

const AppShell = () => {
  const {resolved} = useThemeContext();

  return (
    <>
      <StatusBar
        barStyle={resolved === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <RootNavigator />
    </>
  );
};

const App = () => {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
};

export default App;
