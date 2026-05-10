# CI/CD com GitHub Actions

## Visão geral

O pipeline roda em `.github/workflows/cicd.yml` e é ativado em **push para `main`** e em **Pull Requests**.

```
Push / PR
    └── lint-and-test (ubuntu-latest)
            ├── ESLint
            ├── Jest + cobertura
            └── Comentário de cobertura no PR  ← só em PRs
                    ├── build-android (ubuntu-latest)
                    └── build-ios (macos-15)
```

---

## Jobs

### `lint-and-test`

| Passo | Comando | O que valida |
|---|---|---|
| Lint | `yarn lint` | ESLint em todo o código TypeScript |
| Testes | `yarn test:coverage --runInBand` | 89 testes, relatório de cobertura |
| Coverage PR | `ArtiomTr/jest-coverage-report-action@v2` | Posta diff de cobertura no PR |

### `build-android`

Compila o APK de debug em Ubuntu com JDK 17, SDK Android e Gradle com cache. O APK fica disponível como artifact por 7 dias.

### `build-ios`

Compila o app para simulador em macOS 15 sem assinatura de código (`CODE_SIGNING_ALLOWED=NO`). Usa cache de CocoaPods.

---

## Coverage Report no PR

Quando um PR é aberto, o CI posta automaticamente um comentário com a cobertura atual:

```
| | Coverage |
|---|---|
| Statements | 97.67% |
| Branches   | 95.00% |
| Functions  | 96.34% |
| Lines      | 97.59% |
```

Isso exige as permissões `pull-requests: write` e `checks: write` configuradas no workflow.

---

## Formato dos relatórios

A cobertura é gerada em três formatos via `jest.config.js`:

```js
coverageReporters: ['text', 'lcov', 'json-summary']
```

- `text` — exibido no terminal do CI
- `lcov` — compatível com outras ferramentas (SonarQube, Codecov)
- `json-summary` — lido pelo `jest-coverage-report-action` para postar no PR

---

## Rodando o CI localmente

```bash
# Simular lint
yarn lint

# Simular testes com cobertura
yarn test:coverage --runInBand

# Ver relatório HTML de cobertura
open coverage/lcov-report/index.html
```
