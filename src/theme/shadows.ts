import {Platform} from 'react-native';

export const shadowsLight = {
  none: {},
  sm: Platform.select({
    ios: {
      shadowColor: '#222a23',
      shadowOffset:  {width: 0, height: 1},
      shadowOpacity: 0.06,
      shadowRadius:  2,
    },
    android: {elevation: 2},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#222a23',
      shadowOffset:  {width: 0, height: 4},
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: {elevation: 4},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#222a23',
      shadowOffset: {width: 0, height: 12},
      shadowOpacity: 0.12,
      shadowRadius: 32,
    },
    android: {elevation: 8},
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#222a23',
      shadowOffset: {width: 0, height: 24},
      shadowOpacity: 0.16,
      shadowRadius: 56,
    },
    android: {elevation: 12},
  }),
  focus: {
    shadowColor: '#c8d2c6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 0,
  },
} as const;

export const shadowsDark = {
  none: {},
  sm: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
    android: {elevation: 2},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.45,
      shadowRadius: 12,
    },
    android: {elevation: 4},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 12},
      shadowOpacity: 0.5,
      shadowRadius: 32,
    },
    android: {elevation: 8},
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 24},
      shadowOpacity: 0.55,
      shadowRadius: 56,
    },
    android: {elevation: 12},
  }),
  focus: {
    shadowColor: '#445244',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 0,
  },
} as const;

export const shadows = shadowsLight;
