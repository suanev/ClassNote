export type RootStackParamList = {
  ObservationsHome: undefined;
  ObservationForm: {mode: 'create'} | {mode: 'edit'; observationId: string};
  Settings: undefined;
  DesignSystem: undefined;
};

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-object-type */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-object-type */
