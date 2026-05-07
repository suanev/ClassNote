export const TabRoutes = {
  CLASSES: 'Classes',
  OBSERVATIONS: 'Observations',
  SETTINGS: 'Settings',
} as const;

export const Routes = {
  CLASSES_HOME: 'ClassesHome',
  OBSERVATIONS_HOME: 'ObservationsHome',
} as const;

export type RouteName    = (typeof Routes)[keyof typeof Routes];
export type TabRouteName = (typeof TabRoutes)[keyof typeof TabRoutes];
