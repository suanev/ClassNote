import { NavigatorScreenParams } from '@react-navigation/native';

export type ClassesStackParamList = {
  ClassesHome: undefined;
  ClassDetail: { classId: string; className: string };
};

export type ObservationsStackParamList = {
  ObservationsHome: undefined;
  ObservationForm: { mode: 'create' } | { mode: 'edit'; observationId: string };
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  DesignSystem: undefined;
};

export type RootTabParamList = {
  Classes: NavigatorScreenParams<ClassesStackParamList>;
  Observations: NavigatorScreenParams<ObservationsStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
