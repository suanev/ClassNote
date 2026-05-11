# Testes Unitários

Stack de testes:

- [Jest](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- `@testing-library/jest-native`

## Como rodar

```bash
yarn test
yarn test:coverage
```

Arquivo específico:

```bash
yarn test src/components/Button/__tests__/Button.test.tsx
```

## Onde ficam

- `src/components/**/__tests__/`
- `src/scenes/**/__tests__/`
- `src/store/**/__tests__/`
- `src/__tests__/`

## Estratégia do projeto

- componentes: render, acessibilidade, interação e estados visuais
- telas: view e lógica testadas separadamente
- hooks de view model: testados isoladamente

## Coverage

```bash
yarn test:coverage
```

Relatório:

```text
coverage/
```

No CI, essa pasta sobe como artifact.

## Mocks compartilhados

- `jest.setup.js`

Cobrem integrações nativas como Reanimated, Bottom Sheet, MMKV e Firebase.
