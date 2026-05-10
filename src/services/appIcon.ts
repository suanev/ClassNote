import { NativeModules } from 'react-native';

export type AppIconVariant = 'default' | 'second_option';

const getModule = () => NativeModules.ChangeAppIcon;

export const appIconService = {
  setAppIcon: async (icon: AppIconVariant): Promise<AppIconVariant> => {
    const module = getModule();
    if (!module) throw new Error('ChangeAppIcon native module unavailable');
    return module.setAppIcon(icon);
  },

  getCurrentAppIcon: async (): Promise<AppIconVariant> => {
    const module = getModule();
    if (!module) throw new Error('ChangeAppIcon native module unavailable');
    return module.getCurrentAppIcon();
  },
};
