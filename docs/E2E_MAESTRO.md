# E2E com Maestro

O projeto usa [Maestro](https://maestro.mobile.dev/) para validar fluxos reais do app.

## Pré-requisitos

- app instalado no simulador ou emulador
- Metro rodando
- API rodando
- Maestro CLI instalado

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
maestro --version
```

## Como rodar

```bash
yarn e2e:maestro
```

Os flows ficam em:

```text
.maestro/flows
```

## Boas práticas neste projeto

- preferir `testID` em vez de texto frágil
- usar texto só quando o conteúdo exibido é a própria validação
- flows de rede dependem da API disponível
- alguns cenários são mais estáveis no Android

## Debug

```bash
maestro studio
```

## O que testar aqui

- navegação principal
- criação e edição de observações
- filtros
- ajustes usados pelo usuário

## O que não testar aqui

- tooling interno de desenvolvimento, como Design System
