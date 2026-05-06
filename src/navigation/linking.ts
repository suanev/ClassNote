import {LinkingOptions} from '@react-navigation/native';

import {RootStackParamList} from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['teacherobservations://'],
  config: {
    screens: {
      Classes: 'classes',
      Observations: 'observations',
      Settings: 'settings',
    },
  },
};
