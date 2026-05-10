# Storybook do App

## O que ele é neste projeto

O Storybook roda **dentro do próprio app** com `@storybook/react-native`. Em desenvolvimento, a tela **Ajustes** expõe o atalho **Design System**. Em produção, essa rota não aparece e o import do Storybook não é carregado.

O objetivo aqui não é só “mostrar componente bonito”. O Storybook precisa ser uma cópia fiel do ambiente real do app:

- mesmos providers do app
- mesmo tema light/dark
- mesmos tokens de cor, tipografia e spacing
- mesmos estados críticos: loading, disabled, erro, vazio, destructive e offline

## Como acessar

```bash
yarn api
yarn start
yarn android
```

Depois:

1. Abra **Ajustes**
2. Vá em **Desenvolvedor**
3. Toque em **Design System**

## Arquitetura atual

```text
.storybook/
├── main.ts
├── preview.tsx
├── storybook.requires.ts
├── index.ts
└── DocNote.tsx

src/components/**/**/*.stories.tsx
src/scenes/DesignSystemScreen/index.tsx
```

### O que cada arquivo faz

- `.storybook/main.ts`: registra stories e addons on-device
- `.storybook/preview.tsx`: injeta os providers globais do app
- `.storybook/storybook.requires.ts`: descoberta automática das stories
- `.storybook/DocNote.tsx`: página de documentação visual leve para componentes
- `.storybook/index.ts`: exporta o `StorybookUIRoot`

## Providers globais

Toda story recebe o mesmo contexto base do app:

- `ReduxProvider`
- `QueryClientProvider`
- `SafeAreaProvider`
- `ThemeContextProvider`
- `ThemeProvider` do `styled-components`
- `PaperProvider`
- `BottomSheetModalProvider`
- `GestureHandlerRootView`

Isso é o principal motivo de o Storybook ficar fiel ao app. Componente que depende de tema, Redux, React Query ou bottom sheet é renderizado no mesmo ecossistema real.

## Tema e dark mode

O preview usa o **mesmo ThemeContext do app**, então as stories acompanham o tema resolvido em runtime. Além disso:

- o container global respeita `theme.colors.bg`
- o `DocNote` usa tokens reais do tema, inclusive no dark mode
- o addon de backgrounds foi configurado com superfícies do app

Backgrounds disponíveis:

- `app-light`
- `app-dark`
- `surface-light`
- `surface-dark`

### Regra prática

Se uma story precisar de wrapper visual, **não use hex hardcoded**. Use `theme.colors.bg`, `theme.colors.surface`, `theme.colors.border` etc. Assim o Storybook continua fiel ao light e ao dark mode.

## Como escrever uma story

As stories usam **CSF3** com `args`, `argTypes` e decorators locais quando necessário.

Exemplo:

```tsx
import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {MeuComponente} from './MeuComponente';

const meta = {
  title: 'Components/MeuComponente',
  component: MeuComponente,
  args: {
    children: 'Texto padrão',
  },
  argTypes: {
    onPress: {action: 'pressed'},
    variant: {
      control: {type: 'select'},
      options: ['primary', 'secondary'],
    },
  },
  decorators: [
    Story => (
      <View style={{padding: 24}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MeuComponente>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

## Checklist de fidelidade

Ao criar ou atualizar uma story, confira:

1. A story usa o componente do app exatamente como a tela usa.
2. O wrapper visual usa tokens do tema, não cores fixas.
3. Estados importantes estão cobertos.
4. Textos longos, loading e disabled foram testados.
5. O dark mode continua legível.
6. A documentação descreve intenção e limites do componente, não só o nome das props.

## Estados mínimos esperados por tipo de componente

- Botões: `primary`, `secondary`, destructive, loading, disabled
- Inputs: vazio, preenchido, foco, erro, multiline se existir
- Headers: home, navegação, ações à direita
- Bottom sheets: aberto, conteúdo longo, CTA principal e secundário
- Toasts: sucesso, erro, offline, ação opcional
- List items: conteúdo curto, conteúdo longo, favorito, data/meta

## Documentação dos componentes

Neste projeto, a documentação on-device é feita por uma story `Docs` com `DocNote`. Ela existe porque o fluxo mobile in-app é mais enxuto do que a experiência web completa de docs do Storybook.

Uma boa `Docs` story deve responder:

- para que o componente existe
- em quais telas ele aparece
- quais props realmente importam
- quais estados e restrições devem ser lembrados

Evite documentação fraca como:

- “botão padrão”
- “recebe um texto”
- “faz render do componente”

Prefira documentação útil, por exemplo:

- qual variante usar em confirmação destrutiva
- se o componente depende de contexto
- se existe comportamento especial em dark mode
- se há acessibilidade obrigatória, como `accessibilityLabel`

## Addons usados

- `@storybook/addon-ondevice-controls`
- `@storybook/addon-ondevice-actions`
- `@storybook/addon-ondevice-backgrounds`

## Descoberta automática de stories

Qualquer arquivo `*.stories.tsx` em `src/` entra no catálogo. Se precisar regenerar o arquivo de descoberta:

```bash
yarn storybook:generate
```

## Limitações conhecidas

- o Storybook mobile não oferece a mesma experiência de docs do Storybook web
- componentes muito acoplados à navegação podem precisar de decorator local
- interações muito dependentes de gesture/native modules devem ser revisadas no app real além da story

## Quando considerar a documentação “boa o suficiente”

A documentação está boa quando alguém novo no projeto consegue:

- entender o papel do componente sem abrir a tela final
- descobrir rapidamente qual variante usar
- testar o componente em light e dark mode
- validar estados críticos sem precisar adivinhar props
