# API

O projeto usa [json-server](https://github.com/typicode/json-server) localmente e um backend cloud para builds.

## Local

Suba a API com:

```bash
yarn api
```

Comando real:

```bash
json-server --watch db.json --host 0.0.0.0 --port 3001
```

## URL usada pelo app

### Desenvolvimento local

Deixe `API_BASE_URL` vazio no `.env`:

```env
API_BASE_URL=
```

Fallback automático:

- Android Emulator: `http://10.0.2.2:3001`
- iOS Simulator: `http://localhost:3001`

### Build e CI/CD

`.env.production`:

```env
API_BASE_URL=https://classnotes-json-api-production.up.railway.app
```

## Endpoints principais

| Método | Endpoint |
|---|---|
| `GET` | `/observations` |
| `POST` | `/observations` |
| `PATCH` | `/observations/:id` |
| `DELETE` | `/observations/:id` |
| `GET` | `/classes` |
| `POST` | `/classes` |
| `DELETE` | `/classes/:id` |
