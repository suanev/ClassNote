# CI/CD

Workflow:

- `.github/workflows/cicd.yml`

## Quando roda

- `pull_request` para `main`
- `push` para `main`
- `workflow_dispatch`

## O que roda

### CI / Quality

- `yarn install --frozen-lockfile`
- `yarn lint`
- `npx tsc --noEmit`
- `yarn test:coverage --forceExit`
- upload de `coverage/` como artifact

### CD / Android

- `./gradlew assembleRelease bundleRelease`
- publica:
  - `app-release.apk`
  - `app-release.aab`

### CD / iOS

- build de simulador sem assinatura
- publica o `.app` como artifact

## Como validar antes do PR

```bash
yarn lint
npx tsc --noEmit
yarn test:coverage
```

## Como explicar

- `CI` valida qualidade do código
- `CD` gera artefatos prontos para download
- não publica em loja, mas já entrega binários para distribuição interna
