# Testes Unitários e de Integração

## Stack

| Ferramenta | Versão | Papel |
|---|---|---|
| Jest | via `@react-native/jest-preset` | Runner e assertions |
| React Testing Library (RTNL) | 13.x | Queries e eventos de UI |
| `@testing-library/jest-native` | — | Matchers como `toBeOnTheScreen`, `toHaveProp` |

---

## Como rodar

```bash
# Todos os testes
yarn test

# Com relatório de cobertura
yarn test:coverage

# Arquivo específico
yarn test src/components/Button/__tests__/Button.test.tsx

# Watch mode (re-executa ao salvar)
yarn test --watch
```

---

## Estrutura

Os testes ficam em pastas `__tests__/` ao lado do código que testam:

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── __tests__/
│   │       └── Button.test.tsx
│   └── ObservationListItem/
│       ├── ObservationListItem.tsx
│       └── __tests__/
│           └── ObservationListItem.test.tsx
└── scenes/
    └── ObservationsScreen/
        ├── ObservationsScreen.tsx   ← view
        ├── index.tsx                ← container
        └── __tests__/
            ├── ObservationsScreen.view.test.tsx
            └── ObservationsScreen.container.test.tsx
```

---

## Padrão adotado: MVVM com hooks

Cada tela segue a separação em três arquivos:

- **View** (`ObservationsScreen.tsx`) — recebe props, sem side-effects. Testado com props estáticos — verifica renderização, acessibilidade e callbacks.
- **ViewModel** (`useObservationsViewModel.ts`) — hook com toda a lógica de negócio. Testado com `renderHook` do RTNL — sem renderizar nenhum componente, sem mocks da View.
- **Conector** (`index.tsx`) — linha única que chama o ViewModel e passa o resultado para a View. Não tem lógica própria.

```tsx
// view test — simples, rápido, sem Redux ou React Query
renderWithProviders(
  <ObservationsScreen isLoading observations={[]} ... />
);
expect(screen.getByText('Skeleton')).toBeOnTheScreen();

// ViewModel test — exercita a lógica de negócio via renderHook
const { result, store } = renderViewModel();
act(() => { result.current.onDeleteObservation('obs-2'); });
expect(store.getState().observations.pendingDeletedObservation?.id).toBe('obs-2');
```

---

## Cobertura

A cobertura é coletada dos arquivos mais críticos (configurado em `jest.config.js` via `collectCoverageFrom`):

```
All files  | 97.67% Stmts | 95% Branch | 96.34% Funcs | 97.59% Lines
```

O relatório é gerado em `coverage/` e postado automaticamente como comentário em Pull Requests via CI (veja [`CICD.md`](./CICD.md)).

---

## Mocks globais

Definidos em `jest.setup.js`. Os principais:

| Módulo | Mock | Motivo |
|---|---|---|
| `react-native-paper` | Componentes simples com `Pressable`/`Text` | Evitar dependências nativas do Paper |
| `react-native-reanimated` | Views estáticas | Animações não rodam em jsdom |
| `@gorhom/bottom-sheet` | Modal simplificado com `testID="bottom-sheet-dismiss"` | Native módulo não disponível em teste |
| `react-native-mmkv` | `jest.fn()` no `set`/`getString` | Storage nativo |
| `@react-native-firebase/*` | Funções vazias | SDK nativo não disponível em CI |
| `axios` | `jest.fn()` no `get`/`post`/`patch`/`delete` | Sem chamadas reais de rede |

---

## `renderWithProviders`

Helper em `src/components/__tests__/testUtils.tsx` que envolve qualquer componente com:
- Redux store real (com `rootReducer`)
- `SafeAreaProvider`
- `PaperProvider`
- `ThemeProvider`

```tsx
export function renderWithProviders(component: React.ReactElement) {
  return render(component, {wrapper: TestProviders});
}
```
