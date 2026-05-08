import { LinkingOptions } from '@react-navigation/native';

import { RootTabParamList } from './types';

/**
 * Deep linking configuration
 *
 * Scheme registrado nos arquivos nativos (feito uma única vez):
 *   Android : android/app/src/main/AndroidManifest.xml  (intent-filter)
 *   iOS     : ios/TeacherObservations/Info.plist         (CFBundleURLSchemes)
 *
 * Rotas disponíveis:
 *
 *   teacherobs://observations
 *   teacherobs://observations/form?mode=create
 *   teacherobs://observations/form?mode=edit&observationId=<id>
 *   teacherobs://classes
 *   teacherobs://classes/<classId>?className=<nome>
 *   teacherobs://settings
 */
export const linking: LinkingOptions<RootTabParamList> = {
  prefixes: ['teacherobs://', 'https://teacherobs.app'],
  config: {
    screens: {
      Observations: {
        screens: {
          ObservationsHome: 'observations',
          /*
           * ObservationForm usa um tipo discriminado: {mode:'create'} | {mode:'edit'; observationId:string}
           * O React Navigation não resolve discriminadores via segmentos de path — a forma correta é
           * usar a tela como path fixo e deixar mode + observationId chegarem como query params.
           *
           * teacherobs://observations/form?mode=create
           * teacherobs://observations/form?mode=edit&observationId=abc-123
           */
          ObservationForm: 'observations/form',
        },
      },
      Classes: {
        screens: {
          ClassesHome: 'classes',
          /*
           * classId é segmento de path; className chega como query param (necessário para o filtro).
           *
           * teacherobs://classes/class-1?className=5%C2%BA%20Ano%20A
           */
          ClassDetail: 'classes/:classId',
        },
      },
      Settings: 'settings',
    },
  },
};
