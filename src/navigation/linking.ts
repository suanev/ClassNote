import {LinkingOptions} from '@react-navigation/native';

import {RootTabParamList} from './types';

export const linking: LinkingOptions<RootTabParamList> = {
  prefixes: ['teacherobs://'],
  config: {
    screens: {
      ClassesTab: {
        screens: {
          ClassesList:       'classes',
        },
      },
      FavoritesTab: 'favorites',
      SettingsTab:  'settings',
    },
  },
};
