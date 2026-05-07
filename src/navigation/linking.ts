import {LinkingOptions} from '@react-navigation/native';

import {RootTabParamList} from './types';

export const linking: LinkingOptions<RootTabParamList> = {
  prefixes: ['teacherobs://'],
  config: {
    screens: {
      Classes: {
        screens: {
          ClassesHome: 'classes',
        },
      },
      Observations: {
        screens: {
          ObservationsHome: 'observations',
        },
      },
      Settings: 'settings',
    },
  },
};
