import {view} from './storybook.requires';

/**
 * StorybookUIRoot — componente React que renderiza o Storybook in-app.
 *
 * Usado em DesignSystemScreen (acessível em Ajustes em modo __DEV__).
 * Em produção esse import nunca acontece graças ao guard __DEV__ no navigator.
 */
const StorybookUIRoot = view.getStorybookUI({
  // Persiste a story selecionada usando um storage em memória (sem dependência extra).
  // Troque por MMKV ou AsyncStorage se quiser persistência entre reloads.
  storage: {
    getItem: async (_key: string) => null,
    setItem: async (_key: string, _value: string) => {},
  },
});

export default StorybookUIRoot;
