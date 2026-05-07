import {NavigatorScreenParams} from '@react-navigation/native';

export type ClassesStackParamList = {
  ClassesHome: undefined;
};

export type ObservationsStackParamList = {
  ObservationsHome: undefined;
};

export type RootTabParamList = {
  Classes: NavigatorScreenParams<ClassesStackParamList>;
  Observations: NavigatorScreenParams<ObservationsStackParamList>;
  Settings: undefined;
};

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-object-type */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
