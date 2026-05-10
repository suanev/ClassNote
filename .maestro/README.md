# Maestro E2E

Flows de ponta a ponta do app ficam nesta pasta, organizados por tela atual do produto.
O que é exclusivamente ferramenta de desenvolvimento, como o Design System/Storybook embutido, fica fora da suíte E2E.

## Estrutura

```text
.maestro/
├── config.yaml
├── README.md
└── flows/
    ├── observations-home/
    ├── observation-form/
    └── settings/
```

## Scripts

- `npm run e2e:maestro`
- `npm run e2e:maestro:observations-home`
- `npm run e2e:maestro:observation-form`
- `npm run e2e:maestro:settings`

Esses scripts:
- sobem o `json-server` automaticamente se a API local nao estiver ativa
- passam um `E2E_RUN_ID` para criar dados únicos por execução
- executam o Maestro apontando para a suite correta
- mantem a organizacao em subpastas via `config.yaml`
- instalam a build `release` do Android antes da execução principal

## Configuração da workspace

O script principal `npm run e2e:maestro` aponta para a raiz `.maestro/`.
Como os flows ficam organizados em subpastas, a workspace usa um `config.yaml`
com o pattern `flows/**/*.yaml` para que o Maestro descubra todos os cenários
recursivamente.

## Telas cobertas

### ObservationsHome
- sucesso de carregamento da lista
- filtros por turno, turma e favoritas
- ordenação
- empty state por turma sem observações
- paginação local
- erro de carregamento quando a API está indisponível

### ObservationForm
- criação com sucesso
- validação de campos obrigatórios
- edição
- exclusão com undo
- criação de turma a partir do formulário

### Settings
- aparência e troca de ícone
- gerenciamento de turmas
- caso bloqueado de exclusão de turma com observações vinculadas

## Fora da suíte

- Design System / Storybook dentro do app

Essas rotas são voltadas ao desenvolvimento e não fazem parte dos fluxos funcionais que o usuário final executa. Por isso não entram no E2E do Maestro.

## Observações

- Os flows usam textos visíveis e `testID` estáveis para reduzir flakiness.
- Como o Android usa `activity-alias` para troca de ícone, os flows abrem o app por deep link (`openLink`) em vez de depender de `launchApp`.
- O estado do app continua reprodutível porque cada flow executa `clearState` antes de abrir o deep link inicial.
- Cenários que criam dados usam `E2E_RUN_ID` para evitar colisão entre execuções.
- O runner principal instala a variante `release` para evitar dependência de Metro e reduzir red screens em E2E.
