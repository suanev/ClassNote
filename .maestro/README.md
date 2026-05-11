# Maestro E2E

Flows de ponta a ponta do app ficam nesta pasta.

## Como rodar

```bash
yarn e2e:maestro
```

O comando executa a suíte em:

```text
.maestro/flows
```

## Estrutura

```text
.maestro/
├── config.yaml
├── README.md
└── flows/
    ├── observation-form/
    ├── observations-home/
    └── settings/
```

## O que a suíte cobre

### ObservationsHome

- carregamento da lista
- filtros
- ordenação
- empty states
- paginação

### ObservationForm

- criação
- edição
- exclusão com undo
- criação de turma pelo formulário
- persistência local offline após `killApp` + `launchApp` no Android

### Settings

- aparência
- troca de ícone
- gerenciamento de turmas

## Regras deste projeto

- preferir `testID` para ações
- usar texto visível só quando ele for a própria validação
- evitar flows de tooling interno, como Design System
- usar `clearState` para reprodutibilidade
