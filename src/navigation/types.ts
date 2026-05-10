export type RootStackParamList = {
  ObservationsHome: undefined;
  ObservationForm: {mode: 'create'} | {mode: 'edit'; observationId: string};
  Settings: undefined;
  DesignSystem: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
