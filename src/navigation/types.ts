import {NavigatorScreenParams} from '@react-navigation/native';

// ─── Classes stack (inclui todo o fluxo classes → observações) ───────────────

export type ClassesStackParamList = {
  ClassesList: undefined;
  ClassDetail: {classId: string; className: string};
  ObservationsList: {classId: string; className: string};
  ObservationDetail: {observationId: string};
  ObservationForm: {classId: string; observationId?: string}; // opcional = edição
};

// ─── Root tabs ────────────────────────────────────────────────────────────────

export type RootTabParamList = {
  ClassesTab:  NavigatorScreenParams<ClassesStackParamList>;
  FavoritesTab: undefined;
  SettingsTab:  undefined;
};

// ─── Tipagem global do useNavigation ─────────────────────────────────────────

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
