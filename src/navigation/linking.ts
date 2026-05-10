import {LinkingOptions} from '@react-navigation/native';

import {RootStackParamList} from './types';

/**
 * Deep linking configuration
 *
 * Scheme registrado nos arquivos nativos:
 *   Android: android/app/src/main/AndroidManifest.xml  (intent-filter)
 *   iOS:     ios/TeacherObservations/Info.plist         (CFBundleURLSchemes)
 *
 * Rotas disponíveis:
 *   teacherobs://observations
 *   teacherobs://observations/form?mode=create
 *   teacherobs://observations/form?mode=edit&observationId=<id>
 *   teacherobs://settings
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['teacherobs://', 'https://teacherobs.app'],
  config: {
    screens: {
      ObservationsHome: 'observations',
      ObservationForm: 'observations/form',
      Settings: 'settings',
    },
  },
};
