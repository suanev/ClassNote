# Storybook

O projeto usa [Storybook for React Native](https://storybook.js.org/docs/get-started/frameworks/react-native) para documentar componentes e validar estados visuais.

## Onde roda

Dentro do app, em desenvolvimento:

- `Ajustes` -> `Design System`

## Arquivos principais

- `.storybook/main.ts`
- `.storybook/preview.tsx`
- `src/components/**/*.stories.tsx`
- `src/scenes/DesignSystemScreen/index.tsx`

## Addons usados

- `@storybook/addon-ondevice-controls`
- `@storybook/addon-ondevice-actions`
- `@storybook/addon-ondevice-backgrounds`

## Como acessar

```bash
yarn api
yarn start
yarn android
```

Depois abra `Ajustes` e toque em `Design System`.

## Regras neste projeto

- usar os mesmos tokens de tema do app
- cobrir estados reais: loading, disabled, erro, vazio e destructive
- evitar cores hardcoded
- usar stories para comportamento visual real, não só para listar props

## Regenerar stories

```bash
yarn storybook:generate
```
