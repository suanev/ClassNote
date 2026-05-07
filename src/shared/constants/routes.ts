// ─── Nomes de tab ─────────────────────────────────────────────────────────────
export const TabRoutes = {
  CLASSES_TAB:   'ClassesTab',
  FAVORITES_TAB: 'FavoritesTab',
  SETTINGS_TAB:  'SettingsTab',
} as const;

// ─── Nomes de screen dentro dos stacks ───────────────────────────────────────
export const Routes = {
  // Classes
  CLASSES_LIST:     'ClassesList',
  CLASS_DETAIL:     'ClassDetail',
  // Observations (acessadas a partir do ClassesStack)
  OBSERVATIONS_LIST: 'ObservationsList',
  OBSERVATION_DETAIL: 'ObservationDetail',
  OBSERVATION_FORM:   'ObservationForm',
} as const;

export type RouteName    = (typeof Routes)[keyof typeof Routes];
export type TabRouteName = (typeof TabRoutes)[keyof typeof TabRoutes];
