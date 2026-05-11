# ClassNote

Aplicativo mobile em React Native para registrar observações de alunos, com foco em uso offline, filtros rápidos e sincronização posterior.

## Demo

- [Assistir vídeo de demonstração](docs/assets/classnote-demo.mov)

## Stack

### Core
- [React Native](https://reactnative.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)

### Estado e dados
- [TanStack React Query](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Saga](https://redux-saga.js.org/)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [Axios](https://axios-http.com/)

### UI
- [React Navigation](https://reactnavigation.org/)
- [styled-components](https://styled-components.com/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [@gorhom/bottom-sheet](https://gorhom.dev/react-native-bottom-sheet/)

### Testes e DX
- [Jest](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Maestro](https://maestro.mobile.dev/)
- [Storybook for React Native](https://storybook.js.org/docs/get-started/frameworks/react-native)
- [json-server](https://github.com/typicode/json-server)
- [Firebase Analytics](https://rnfirebase.io/analytics/usage)
- [Firebase Crashlytics](https://rnfirebase.io/crashlytics/usage)

## O que o app faz

- criar, editar, favoritar e excluir observações
- filtrar por turma, turno e favoritas
- salvar alterações localmente quando estiver offline
- sincronizar a fila local quando a conexão volta
- gerenciar turmas, aparência e ícone do app

## Como rodar

### Pré-requisitos

- Node.js `22+`
- Yarn `1.x`
- JDK `17`
- Android Studio
- Xcode + CocoaPods para iOS

Guia oficial:
- [React Native - Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)

### Instalação

```bash
yarn install
bundle install
bundle exec pod install --project-directory=ios
```

### Desenvolvimento local

Use 3 terminais:

```bash
# terminal 1
yarn api

# terminal 2
yarn start

# terminal 3
yarn android
# ou
yarn ios
```

Ao abrir o app, a lista usa o cache local imediato e já refaz a sincronização com a API automaticamente.

### API local vs cloud

- desenvolvimento local: o app usa fallback automático para `3001`
- builds e CI/CD: o app usa `https://classnotes-json-api-production.up.railway.app`

Arquivos:

```env
# .env
API_BASE_URL=

# .env.production
API_BASE_URL=https://classnotes-json-api-production.up.railway.app
```

## Scripts principais

```bash
yarn start
yarn android
yarn ios
yarn api
yarn lint
yarn test
yarn test:coverage
yarn e2e:maestro
yarn android:apk
yarn android:aab
```

## Estrutura

```text
src/
├── components/
├── scenes/
├── hooks/
├── navigation/
├── services/
├── storage/
├── store/
└── theme/
```

## Arquitetura

As telas seguem uma separação simples:

- `Screen.tsx`: interface
- `useScreenViewModel.ts`: lógica da tela
- `index.tsx`: conector

Camadas principais:

- `components/` e `scenes/`: UI
- `hooks/`, `services/` e `store/`: lógica e dados
- `storage/`: persistência local

## Testes

- unitários e integração com Jest
- E2E com Maestro
- documentação visual com Storybook on-device

## CI/CD

Workflow:

- `.github/workflows/cicd.yml`

Resumo:

- PR em `main`: lint, typecheck e testes com coverage
- push em `main`: tudo acima + build Android e iOS

## Docs

- [docs/JSON_SERVER.md](docs/JSON_SERVER.md)
- [docs/TESTES_UNITARIOS.md](docs/TESTES_UNITARIOS.md)
- [docs/E2E_MAESTRO.md](docs/E2E_MAESTRO.md)
- [docs/STORYBOOK.md](docs/STORYBOOK.md)
- [docs/CICD.md](docs/CICD.md)
- [docs/DEEP_LINKING.md](docs/DEEP_LINKING.md)
- [docs/GUIA_DO_PROJETO.md](docs/GUIA_DO_PROJETO.md)
- [docs/DESIGN_PROMPT.md](docs/DESIGN_PROMPT.md)
