# Testes E2E com Maestro

## O que é

[Maestro](https://maestro.mobile.dev) é um framework de testes E2E mobile que usa arquivos YAML para descrever fluxos de usuário. É mais simples de configurar que Detox e não requer compilação especial do app.

---

## Instalação do Maestro CLI

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

Verifique:
```bash
maestro --version
```

---

## Pré-requisitos para rodar os testes

1. App instalado no emulador/dispositivo com `yarn android` ou `yarn ios`
2. API rodando com `yarn api`
3. Emulador/dispositivo conectado e visível em `adb devices` (Android)

---

## Como rodar

```bash
# Todos os flows da pasta .maestro/
yarn e2e:maestro

# Flow específico
yarn e2e:maestro:observations
```

---

## Estrutura dos flows

```
.maestro/
└── observations-smoke.yaml   ← smoke test da tela principal
```

### `observations-smoke.yaml`

```yaml
appId: com.teacherobservations
---
- launchApp:
    clearState: true
- assertVisible: "Observações"
```

Este flow:
1. Abre o app com estado limpo (`clearState: true`)
2. Verifica que a tela de Observações está visível

---

## Como criar novos flows

Crie um arquivo `.yaml` em `.maestro/` seguindo o padrão:

```yaml
appId: com.teacherobservations
---
# Navegação
- tapOn: "Nova observação"

# Preenchimento de formulário
- tapOn:
    id: "student-input"
- inputText: "Ana Silva"

# Assertions
- assertVisible: "Ana Silva"
- assertNotVisible: "Erro"

# Scroll
- scrollUntilVisible:
    element: "Apagar"
    direction: DOWN
```

Referência completa: [maestro.mobile.dev/reference](https://maestro.mobile.dev/reference/tap-on-element)

---

## Por que Maestro?

| | Maestro | Detox |
|---|---|---|
| Configuração | Zero — só YAML | Requer build especial |
| Velocidade de escrita | Alta | Média |
| Debug | `maestro studio` (UI visual) | Logs de texto |
| CI | Suportado | Suportado |
| Maturidade | Recente | Consolidado |

Para o contexto deste projeto (challenge), Maestro foi escolhido pela velocidade de setup e pela leitura clara dos flows em YAML.

---

## Debug visual

```bash
maestro studio
```

Abre uma interface web que permite inspecionar a tela atual e gravar flows interativamente.
