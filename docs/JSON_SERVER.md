# JSON Server — API Simulada

## O que é

[json-server](https://github.com/typicode/json-server) é uma biblioteca que transforma um arquivo `db.json` em uma REST API completa (GET, POST, PATCH, DELETE) sem nenhuma configuração de backend.

---

## Como rodar

```bash
yarn api
```

Isso executa:
```
json-server --watch db.json --host 0.0.0.0 --port 3001
```

A flag `--host 0.0.0.0` é necessária para que dispositivos físicos e emuladores Android consigam acessar a API pelo IP da máquina.

---

## Endpoints disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/observations` | Lista todas as observações |
| `GET` | `/observations/:id` | Busca observação por ID |
| `POST` | `/observations` | Cria nova observação |
| `PATCH` | `/observations/:id` | Atualiza observação parcialmente |
| `DELETE` | `/observations/:id` | Remove observação |
| `GET` | `/classes` | Lista todas as turmas |
| `GET` | `/classes/:id` | Busca turma por ID |

---

## Configuração do endereço no app

O endereço da API é configurado via `react-native-config` em `.env`:

```env
# .env
API_BASE_URL=http://10.0.2.2:3001   # Android Emulator
# API_BASE_URL=http://localhost:3001 # iOS Simulator
# API_BASE_URL=http://SEU_IP:3001    # Dispositivo físico
```

> **Android Emulator**: use `10.0.2.2` — é o alias do `localhost` da máquina host.
> **iOS Simulator**: use `localhost` normalmente.
> **Dispositivo físico**: descubra o IP da máquina com `ifconfig` (macOS/Linux) e use-o.

---

## Estrutura do `db.json`

```json
{
  "observations": [
    {
      "id": "uuid",
      "student": "Nome do Aluno",
      "className": "5º Ano A",
      "text": "Texto da observação...",
      "favorite": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "classes": [
    {
      "id": "uuid",
      "name": "5º Ano A",
      "shift": "Manhã",
      "students": 28
    }
  ]
}
```

---

## Rodando em paralelo com o app

Em terminais separados:

```bash
# Terminal 1 — API
yarn api

# Terminal 2 — Metro bundler
yarn start

# Terminal 3 — App
yarn android
# ou
yarn ios
```

---

## Reset dos dados

Para resetar os dados ao estado inicial, restaure o `db.json` do git:

```bash
git checkout db.json
```
