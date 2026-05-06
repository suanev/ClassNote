import React from 'react';
import {StatusBar} from 'react-native';

import {AppProviders} from '@app/providers';
import {RootNavigator} from '@navigation/RootNavigator';

function App(): React.JSX.Element {
  return (
    <AppProviders>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <RootNavigator />
    </AppProviders>
  );
}

export default App;
