import {Platform} from 'react-native';

export const shadowsLight = {
  none: {},
  sm: {},  // Notebook direction: cards use borders, not shadows
  md: {},
  lg: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: -10},
      shadowOpacity: 0.2,
      shadowRadius: 40,
    },
    android: {elevation: 8},
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.2,
      shadowRadius: 24,
    },
    android: {elevation: 12},
  }),
  // FAB shadow
  fab: Platform.select({
    ios: {
      shadowColor: '#1F3A5F',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.35,
      shadowRadius: 24,
    },
    android: {elevation: 8},
  }),
  focus: {
    shadowColor: '#C0D4EC',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 0,
  },
} as const;

export const shadowsDark = {
  none: {},
  sm: {},
  md: {},
  lg: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: -10},
      shadowOpacity: 0.35,
      shadowRadius: 40,
    },
    android: {elevation: 8},
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.35,
      shadowRadius: 24,
    },
    android: {elevation: 12},
  }),
  fab: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.5,
      shadowRadius: 24,
    },
    android: {elevation: 8},
  }),
  focus: {
    shadowColor: '#2D4A6E',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 0,
  },
} as const;

export const shadows = shadowsLight;
