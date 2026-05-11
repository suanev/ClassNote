# Deep Linking

Config principal:

- `src/navigation/linking.ts`

## Prefixos

- `teacherobs://`
- `https://teacherobs.app`

## Rotas públicas

| URL | Tela |
|---|---|
| `teacherobs://observations` | lista principal |
| `teacherobs://observations/form?mode=create` | criar observação |
| `teacherobs://observations/form?mode=edit&observationId=<id>` | editar observação |
| `teacherobs://settings` | ajustes |

## Arquivos envolvidos

- `src/navigation/linking.ts`
- `src/navigation/types.ts`
- `android/app/src/main/AndroidManifest.xml`
- `ios/TeacherObservations/Info.plist`

## Como testar

### Android

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "teacherobs://observations" com.teacherobservations
```

### iOS

```bash
xcrun simctl openurl booted "teacherobs://observations"
```

## Observações

- `DesignSystem` não faz parte do deep linking público
- o fluxo de edição exige `observationId` válido
