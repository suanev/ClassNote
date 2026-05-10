# TeacherObservations

Aplicativo mobile para professores gerenciarem observações sobre seus alunos. Desenvolvido como desafio técnico para a **AgendaEdu**.

> 📹 _Vídeo de demonstração — em breve_

---

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Rodando o projeto](#rodando-o-projeto)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Arquitetura](#arquitetura)
- [Stack técnica](#stack-técnica)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Monitoramento](#monitoramento)
- [Deep Linking](#deep-linking)
- [Design System](#design-system)
- [Decisões técnicas](#decisões-técnicas)

---

## Visão Geral

O TeacherObservations resolve um problema real de professores: registrar, organizar e acessar rapidamente observações sobre o comportamento e desempenho de alunos durante as aulas. O app funciona **offline-first** — as observações são salvas localmente e sincronizadas com o servidor quando a conexão é restaurada.

> 📸 _Screenshots da interface — em breve_

---

## Funcionalidades

### Observações (CRUD completo)
- ✅ Criar, editar, excluir e visualizar observações
- ✅ Favoritar observações para acesso rápido
- ✅ Desfazer exclusão com toast de undo (4 segundos)
- ✅ Swipe para deletar com animação
- ✅ Paginação local (12 itens por página, lazy loading)

### Filtros e ordenação
- ✅ Filtrar por turma
- ✅ Filtrar somente favoritas
- ✅ Ordenar por mais recentes, mais antigas ou favoritas primeiro
- ✅ Reset de filtros com um toque

### Turmas
- ✅ Visão geral de turmas com resumo de atividade (Hoje / Semana)
- ✅ Detalhe da turma com lista de observações
- ✅ Badges de atividade no período selecionado

### UX e feedback visual
- ✅ Skeleton loading durante carregamento inicial
- ✅ Empty states contextualizados (por filtro, por turma, por erro)
- ✅ Estado de erro com botão de retry
- ✅ Toast de feedback para todas as ações (criar, editar, deletar, favoritar, sincronizar)
- ✅ Toast de rede (4s ao ficar offline)
- ✅ Tooltip de status de sincronização

### Offline-first
- ✅ Cache local com MMKV
- ✅ Fila de sincronização persistida (operações offline enfileiradas e sincronizadas ao reconectar)
- ✅ Indicador de status de sincronização no header

### Acessibilidade
- ✅ `accessibilityRole` em todos os elementos interativos
- ✅ `accessibilityLabel` descritivo em botões e ações
- ✅ `accessibilityState` (selected, checked, disabled) em chips e toggles

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 22.x |
| Yarn | 1.x |
| Ruby | 3.x (para CocoaPods no iOS) |
| Xcode | 16+ (iOS) |
| Android Studio | Ladybug+ (Android) |
| JDK | 17 |

Siga o guia oficial de ambiente: [reactnative.dev/docs/set-up-your-environment](https://reactnative.dev/docs/set-up-your-environment)

---

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/TeacherObservations.git
cd TeacherObservations

# 2. Instale as dependências JS
yarn install

# 3. iOS — instale as dependências nativas
bundle install
bundle exec pod install --project-directory=ios
```

### Firebase (Monitoramento)

O app usa Firebase Analytics e Crashlytics. Para rodar localmente você precisa:

1. Criar um projeto no [Firebase Console](https://console.firebase.google.com)
2. Adicionar um app Android e um app iOS ao projeto
3. Baixar os arquivos de configuração e colocá-los nos lugares corretos:

```
android/app/google-services.json      ← arquivo do Firebase para Android
ios/GoogleService-Info.plist          ← arquivo do Firebase para iOS
```

> Os arquivos placeholder já existem no repositório com valores `REPLACE_WITH_YOUR_*`. Substitua pelos reais. Eles estão no `.gitignore` e não são commitados.

---

## Rodando o projeto

Abra **três terminais** e execute em ordem:

```bash
# Terminal 1 — API simulada (json-server na porta 3001)
yarn api

# Terminal 2 — Metro bundler
yarn start

# Terminal 3 — App no emulador/dispositivo
yarn android
# ou
yarn ios
```

📖 Detalhes sobre a API simulada: [docs/JSON_SERVER.md](./docs/JSON_SERVER.md)

---

## Variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme seu ambiente:

```bash
cp .env.example .env
```

| Variável | Descrição | Padrão |
|---|---|---|
| `API_BASE_URL` | URL da API json-server | `http://10.0.2.2:3001` |

> `10.0.2.2` é o alias do `localhost` da máquina host para o emulador Android.
> Para iOS use `http://localhost:3001`.
> Para dispositivo físico use o IP da sua máquina na rede local.

---

## Arquitetura

O app segue uma arquitetura em camadas com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────┐
│                    UI Layer                  │
│  Scenes (View + Container) │ Components      │
└──────────────┬──────────────────────────────┘
               │ props / hooks
┌──────────────▼──────────────────────────────┐
│               State Layer                    │
│  Redux (UI state) │ React Query (server state)│
└──────────────┬──────────────────────────────┘
               │ actions / selectors / queries
┌──────────────▼──────────────────────────────┐
│              Services Layer                  │
│  API (axios) │ SyncQueue (MMKV) │ Monitoring │
└─────────────────────────────────────────────┘
```

### Padrão MVVM com hooks

Cada tela é dividida em três arquivos:

- **`NomeTela.tsx`** (View) — componente puro que recebe props e renderiza a UI. Zero side-effects. Facilita testes de renderização.
- **`useNomeTelaViewModel.ts`** (ViewModel) — hook que concentra toda a lógica de negócio: Redux, React Query, navegação, callbacks. Não sabe quem o consome — testável com `renderHook` de forma totalmente isolada.
- **`index.tsx`** (Conector) — linha única que chama o ViewModel e passa o resultado para a View: `const vm = useViewModel(); return <View {...vm} />`.

**Por que MVVM com hooks em vez de MVP com Container?**
No padrão MVP, o Container conhece a interface da View e passa props diretamente — tornando-se o "meio" entre lógica e UI. No MVVM com hooks, o ViewModel não sabe quem o consome. A View chama o hook; o conector só conecta. Isso torna o ViewModel testável com `renderHook` sem renderizar nenhum componente, e a View testável com props estáticos sem nenhum mock de Redux ou React Query.

### Fluxo offline-first

```
Ação do usuário
    │
    ├── Online  → Mutação React Query → API → Atualiza cache
    │
    └── Offline → Mutação salva na SyncQueue (MMKV)
                        │
                        └── Ao reconectar → Redux Saga (flushSyncQueue)
                                                → Drena a fila → API
                                                → Atualiza React Query cache
```

---

## Stack técnica

### Core

| Lib | Versão | Por quê |
|---|---|---|
| React Native CLI | 0.85.3 | Framework mobile, contexto mais próximo do projeto AgendaEdu |
| TypeScript | 5.x | Tipagem estática, autocompletar, refactor seguro |

### Estado

| Lib | Por quê |
|---|---|
| **Redux Toolkit + Redux Saga** | Redux para estado de UI (filtros, toasts, fila de sync). Sagas para efeitos colaterais assíncronos com controle preciso (`race`, `delay`, `takeLatest`) — ex: auto-dismiss de toast e flush da fila offline |
| **React Query v5** | Estado de servidor (cache, refetch, invalidação, optimistic updates). Complementa Redux em vez de substituí-lo — cada um no que é melhor |

### Persistência e sync

| Lib | Por quê |
|---|---|
| **react-native-mmkv** | Storage key-value nativo (C++), ~30x mais rápido que AsyncStorage. Usado para persistir a fila de sincronização offline |

### UI

| Lib | Por quê |
|---|---|
| **React Native Paper** | Design system Material 3 com Portal, Button, Surface — consistência visual sem construir tudo do zero |
| **styled-components/native** | CSS-in-JS com suporte a tema tipado. Separa estilos do JSX e acessa o tema via props de forma type-safe |
| **react-native-reanimated** | Animações de entrada/saída dos toasts e skeleton com Worklets rodando na thread de UI |
| **@gorhom/bottom-sheet** | BottomSheet performático com gestos nativos — filtros e confirmação de exclusão |

### Navegação

| Lib | Por quê |
|---|---|
| **React Navigation 7** | Stack + Tab navigators. Deep linking configurado para URLs `teacherobservations://` |

### Rede e monitoramento

| Lib | Por quê |
|---|---|
| **axios** | Cliente HTTP com interceptors para tratamento centralizado de erros |
| **@react-native-community/netinfo** | Detecção de status de rede para o fluxo offline-first |
| **@react-native-firebase/analytics** | Rastreamento de eventos de uso (create, edit, delete, favorite, sync) |
| **@react-native-firebase/crashlytics** | Crash reporting com custom keys de contexto e non-fatal errors |

### Testes

| Lib | Por quê |
|---|---|
| **Jest** | Runner padrão do ecossistema React Native |
| **React Testing Library Native** | Testa componentes como o usuário os vê — queries por texto, label e role |

---

## Estrutura de pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Badge/
│   ├── BottomSheet/
│   ├── Button/
│   ├── Card/
│   ├── EmptyState/
│   ├── ErrorBoundary/   # Captura erros de render → Crashlytics
│   ├── FAB/
│   ├── FilterBottomSheet/
│   ├── Input/
│   ├── NetworkToast/
│   ├── ObservationListItem/
│   ├── ObservationSkeleton/
│   ├── ObservationUndoToast/
│   ├── ScreenContainer/
│   ├── Skeleton/
│   ├── SwipeableObservationItem/
│   └── SyncStatusIcon/
│
├── hooks/               # Hooks customizados
│   ├── useMonitoringContext.ts  # Mantém Crashlytics atualizado com estado do app
│   ├── useNetworkStatus.ts
│   ├── useObservations.ts
│   ├── useClasses.ts
│   └── usePagination.ts
│
├── navigation/          # React Navigation
│   ├── RootNavigator.tsx        # Tab + log de tela no Analytics
│   ├── ObservationsStack.tsx
│   ├── ClassesStack.tsx
│   └── types.ts
│
├── providers/           # Context providers (tema, Paper, Redux)
│
├── scenes/              # Telas — padrão MVVM (View + ViewModel + Conector)
│   ├── ObservationsScreen/
│   │   ├── ObservationsScreen.tsx          ← View (pura, recebe props)
│   │   ├── useObservationsViewModel.ts     ← ViewModel (hook com toda lógica)
│   │   └── index.tsx                       ← Conector (chama VM, passa props)
│   ├── ObservationFormScreen/
│   ├── ClassesScreen/
│   ├── ClassDetailScreen/
│   └── SettingsScreen/
│
├── services/            # Camada de dados externa
│   ├── api.ts           # Cliente axios
│   ├── observations.ts  # Funções de API
│   ├── classes.ts
│   ├── syncQueue.ts     # Fila MMKV para operações offline
│   └── monitoring/      # Firebase wrapper (analytics + crashlytics)
│
├── store/               # Redux
│   ├── observations/    # Slice + Saga (toasts, fila, sync)
│   ├── network/         # Slice (isOffline, isSyncing)
│   ├── classes/
│   ├── favorites/
│   ├── rootReducer.ts
│   └── rootSaga.ts
│
├── theme/               # Tokens de design (cores, tipografia, espaçamento)
├── types/               # Types compartilhados
└── utils/               # Funções puras (date, sort, network)
```

---

## Testes

📖 Guia completo: [docs/TESTES_UNITARIOS.md](./docs/TESTES_UNITARIOS.md)

```bash
# Rodar todos os testes
yarn test

# Com cobertura
yarn test:coverage

# Ver relatório HTML de cobertura
open coverage/lcov-report/index.html
```

**Cobertura atual:** 97.67% statements · 95% branches · 96.34% functions · 97.59% lines

**89 testes** em 17 suites cobrindo:
- Componentes isolados (Button, FAB, EmptyState, BottomSheet, ObservationListItem, SwipeableObservationItem, FilterBottomSheet, ObservationSkeleton, ObservationUndoToast, SyncStatusIcon)
- Telas view (ObservationsScreen, ObservationFormScreen, ClassesScreen, ClassDetailScreen)
- Container com lógica de negócio (ObservationsScreen)
- Redux slice (observations)
- App shell (App.tsx)

📖 Testes E2E com Maestro: [docs/E2E_MAESTRO.md](./docs/E2E_MAESTRO.md)

```bash
# Instalar Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Rodar smoke test
yarn e2e:maestro:observations
```

---

## CI/CD

📖 Guia completo: [docs/CICD.md](./docs/CICD.md)

Pipeline no GitHub Actions ativado em push e PRs:

| Job | Ambiente | O que faz |
|---|---|---|
| `lint-and-test` | ubuntu-latest | ESLint + Jest + comentário de cobertura no PR |
| `build-android` | ubuntu-latest | Compila APK debug (artifact de 7 dias) |
| `build-ios` | macos-15 | Compila para simulador sem assinatura |

---

## Monitoramento

O app usa Firebase Analytics e Crashlytics integrados via `src/services/monitoring/index.ts`.

### Eventos Analytics

| Evento | Quando |
|---|---|
| `observation_created` | Nova observação salva |
| `observation_edited` | Observação atualizada |
| `observation_deleted` | Observação excluída |
| `observation_favorited` | Estrela adicionada/removida |
| `undo_delete` | Exclusão desfeita |
| `filter_applied` | Filtro aplicado |
| `sort_changed` | Ordenação alterada |
| `sync_completed` / `sync_failed` | Resultado da sincronização offline |

### Crashlytics

- **Custom keys** em tempo real: `network_status`, `observations_count`, `pending_sync_count`
- **Non-fatal errors** em todos os `onError` de mutações com contexto da ação
- **Breadcrumbs** antes de cada mutação para reconstruir o caminho até o crash
- **ErrorBoundary** React captura erros de render com `componentStack`
- **Erros JS globais** via `ErrorUtils.setGlobalHandler`

---

## Deep Linking

📖 Guia completo com rotas, comandos de teste e perguntas de entrevista: [docs/DEEP_LINKING.md](./docs/DEEP_LINKING.md)

| URL | Tela |
|---|---|
| `teacherobs://observations` | Lista de observações |
| `teacherobs://observations/form?mode=create` | Formulário (criar) |
| `teacherobs://observations/form?mode=edit&observationId=<id>` | Formulário (editar) |
| `teacherobs://classes` | Lista de turmas |
| `teacherobs://classes/<classId>?className=<nome>` | Detalhe da turma |
| `teacherobs://settings` | Ajustes |

A config de rotas (`src/navigation/linking.ts`) é **100% JavaScript** — os arquivos nativos já estão configurados e não precisam ser alterados.

---

## Design System

📖 Guia completo com como escrever stories e perguntas de entrevista: [docs/STORYBOOK.md](./docs/STORYBOOK.md)

O Storybook está integrado **dentro do próprio app**. Em modo de desenvolvimento, acesse via **Ajustes → Design System**.

| Componente | Stories |
|---|---|
| Button | Fill, Outline, Danger, WithIcon, IconOnly, Loading, Disabled |
| FAB | Default, Disabled, EditIcon, Large |
| EmptyState | WithAction, WithoutAction, ErrorState, ClassFilter |
| Badge | Default, Success, Neutral, AllVariants |
| Card | Default, Dark, WithCustomPadding |
| Input | Default, WithIcon, Multiline, WithValue |

Em produção o código do Storybook **nunca é incluído no bundle** — o guard `__DEV__` garante tree-shaking completo pelo Metro.

---

## Decisões técnicas

**Por que Redux Saga em vez de só React Query?**
React Query resolve o estado de servidor perfeitamente. Saga foi usado para lógica que não é "fetch de dados": o auto-dismiss cronometrado do toast com possibilidade de cancelamento (`race` + `delay`), e o drain controlado da fila de sync offline. Essa separação mantém cada camada com responsabilidade clara.

**Por que MMKV em vez de AsyncStorage?**
A fila de sincronização é lida e escrita em toda mutação — inclusive offline. MMKV é síncrono e ~30x mais rápido, eliminando a complexidade de gerenciar Promises em pontos críticos do fluxo de dados.

**Por que o padrão View + Container?**
Isola a renderização da lógica de negócio. A View é um componente puro testável com props estáticos — sem mocks de Redux ou React Query. O Container é testado com a integração real. Esse padrão evita mocks excessivos e produz testes mais confiáveis.

**Por que Maestro para E2E?**
Zero configuração de build especial. Os flows em YAML são legíveis sem conhecer código. Para o contexto deste challenge, a velocidade de setup supera a maturidade do Detox.
