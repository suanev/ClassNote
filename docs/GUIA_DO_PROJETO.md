# Guia do Projeto

Resumo rápido para entender o app sem ler o código inteiro.

## Objetivo

O ClassNote ajuda professores a:

- registrar observações rapidamente
- continuar trabalhando offline
- sincronizar dados quando a conexão volta

## Organização do código

### UI

- `src/components/`: peças reutilizáveis
- `src/scenes/`: telas

### Lógica

- `use...ViewModel.ts`: lógica da tela
- `src/hooks/`: lógica compartilhada

### Dados

- `src/services/`: API e integrações
- `src/store/`: estado global e sagas
- `src/storage/`: persistência local

## Tecnologias por papel

- `React Query`: cache e estado de servidor
- `Redux Toolkit`: estado global de UI
- `Redux Saga`: efeitos assíncronos globais
- `MMKV`: persistência local rápida
- `NetInfo`: estado de conexão

## Fluxo offline-first

1. o usuário cria ou altera algo
2. online: a ação vai para a API
3. offline: a ação fica salva localmente
4. ao reconectar: a fila sincroniza

## Telas principais

- `ObservationsHome`
- `ObservationForm`
- `Settings`

## Docs relacionadas

- API: [docs/JSON_SERVER.md](./JSON_SERVER.md)
- testes: [docs/TESTES_UNITARIOS.md](./TESTES_UNITARIOS.md)
- E2E: [docs/E2E_MAESTRO.md](./E2E_MAESTRO.md)
- pipeline: [docs/CICD.md](./CICD.md)
