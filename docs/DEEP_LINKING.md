# Deep Linking

## Como funciona

O React Navigation processa deep links **100% em JavaScript** — o arquivo `src/navigation/linking.ts` é tudo que precisa ser alterado para adicionar ou modificar rotas. Os arquivos nativos (Android e iOS) registram o scheme `teacherobs://` no sistema operacional uma única vez e nunca precisam ser tocados novamente.

```
URL recebida pelo OS
    │
    └── OS abre o app (nativo — feito uma vez)
            │
            └── React Navigation lê a URL
                    │
                    └── Mapeia para tela + params via linking.ts (JS puro)
```

---

## Rotas disponíveis

| URL | Tela | Params resolvidos |
|---|---|---|
| `teacherobs://observations` | Lista de observações | — |
| `teacherobs://observations/form?mode=create` | Formulário (criar) | `mode: 'create'` |
| `teacherobs://observations/form?mode=edit&observationId=<id>` | Formulário (editar) | `mode: 'edit'`, `observationId` |
| `teacherobs://classes` | Lista de turmas | — |
| `teacherobs://classes/<classId>?className=<nome>` | Detalhe da turma | `classId`, `className` |
| `teacherobs://settings` | Ajustes | — |

> **Por que `ObservationForm` usa query params em vez de segmentos de path?**
> O tipo da rota é um discriminated union — `{mode:'create'} | {mode:'edit'; observationId:string}`. O React Navigation não consegue resolver um discriminador via segmentos de path sem código customizado complicado. Query params são automaticamente convertidos em params de rota pelo React Navigation, resolvendo o problema de forma limpa.

---

## Arquivos nativos (já configurados — não mexa)

### Android — `android/app/src/main/AndroidManifest.xml`

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="teacherobs" />
</intent-filter>
```

### iOS — `ios/TeacherObservations/Info.plist`

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>com.teacherobservations.deeplink</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>teacherobs</string>
    </array>
  </dict>
</array>
```

---

## Como testar

### Pré-requisito

O app precisa estar instalado e rodando no emulador/dispositivo:

```bash
yarn api    # Terminal 1 — API
yarn start  # Terminal 2 — Metro
yarn android # ou yarn ios — Terminal 3
```

---

### Android (emulador ou dispositivo físico via ADB)

```bash
# Lista de observações
adb shell am start -W -a android.intent.action.VIEW \
  -d "teacherobs://observations" com.teacherobservations

# Formulário — criar nova observação
adb shell am start -W -a android.intent.action.VIEW \
  -d "teacherobs://observations/form?mode=create" com.teacherobservations

# Formulário — editar observação existente (substitua <id> pelo ID real)
adb shell am start -W -a android.intent.action.VIEW \
  -d "teacherobs://observations/form?mode=edit&observationId=<id>" com.teacherobservations

# Lista de turmas
adb shell am start -W -a android.intent.action.VIEW \
  -d "teacherobs://classes" com.teacherobservations

# Detalhe de turma (substitua <classId> e encode o nome da turma)
adb shell am start -W -a android.intent.action.VIEW \
  -d "teacherobs://classes/<classId>?className=5%C2%BA%20Ano%20A" com.teacherobservations

# Ajustes
adb shell am start -W -a android.intent.action.VIEW \
  -d "teacherobs://settings" com.teacherobservations
```

> **Como descobrir o ID real?** Rode `yarn api` e acesse `http://localhost:3001/observations` no browser. Os `id`s aparecem no JSON.

---

### iOS (simulador)

```bash
# Lista de observações
xcrun simctl openurl booted "teacherobs://observations"

# Formulário — criar nova observação
xcrun simctl openurl booted "teacherobs://observations/form?mode=create"

# Formulário — editar observação existente
xcrun simctl openurl booted "teacherobs://observations/form?mode=edit&observationId=<id>"

# Lista de turmas
xcrun simctl openurl booted "teacherobs://classes"

# Detalhe de turma
xcrun simctl openurl booted "teacherobs://classes/<classId>?className=5%C2%BA%20Ano%20A"

# Ajustes
xcrun simctl openurl booted "teacherobs://settings"
```

---

### Dispositivo físico iOS

No dispositivo físico, use o Safari para abrir a URL diretamente:

1. Abra o Safari no iPhone
2. Na barra de endereços, digite a URL: `teacherobs://observations`
3. O iOS vai perguntar se deseja abrir o app — confirme

---

### Script de smoke test (todas as rotas — Android)

```bash
#!/bin/bash
PKG="com.teacherobservations"
URLS=(
  "teacherobs://observations"
  "teacherobs://observations/form?mode=create"
  "teacherobs://classes"
  "teacherobs://settings"
)

for URL in "${URLS[@]}"; do
  echo "Testando: $URL"
  adb shell am start -W -a android.intent.action.VIEW -d "$URL" $PKG
  sleep 2
done
echo "Smoke test concluído."
```

---

## O que verificar em cada rota

| Rota | O que esperar |
|---|---|
| `observations` | Tela principal com lista (ou skeleton se carregando) |
| `observations/form?mode=create` | Formulário vazio com título "Nova observação" |
| `observations/form?mode=edit&observationId=<id>` | Formulário preenchido com dados da observação |
| `classes` | Lista de turmas com resumo Hoje/Semana |
| `classes/<classId>?className=<nome>` | Detalhe da turma com lista de observações |
| `settings` | Tela de ajustes |

---

## Perguntas que podem surgir em entrevista

**"Como você testaria deep links sem um dispositivo físico?"**
> Com `adb shell am start` no emulador Android ou `xcrun simctl openurl` no simulador iOS. Ambos simulam exatamente o comportamento de um link externo abrindo o app.

**"Por que a config de linking é só JavaScript?"**
> O React Navigation usa as APIs nativas `Linking` (iOS/Android) para receber a URL já depois que o OS abriu o app. O mapeamento URL → tela é processado em JS pelo `NavigationContainer`. Os arquivos nativos só precisam dizer ao OS "quando receber uma URL com scheme `teacherobs://`, abra este app".

**"O que acontece se o app estiver fechado?"**
> O OS abre o app, o React Navigation lê a URL via `Linking.getInitialURL()` (chamada automática pelo `NavigationContainer`) e navega para a tela correta. Se o app já estiver aberto em background, o `Linking` listener (`addEventListener('url', ...)`) é acionado.

**"Como você adicionaria suporte a Universal Links (https://)?"**
> No prefixes do linking config já tem `https://teacherobs.app`. O que faltaria é configuração nativa adicional: Associated Domains no Xcode (iOS) e um arquivo `assetlinks.json` no servidor (Android App Links). O código JS não muda.

**"Como você testaria que os params chegam corretamente na tela?"**
> Com `renderHook` ou renderizando a tela dentro de um `NavigationContainer` com `initialState` no teste unitário, ou com um teste E2E no Maestro usando `openLink`.
