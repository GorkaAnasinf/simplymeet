# SimplyMeet Mobile

Proyecto base para app universal (iOS/Android) con Expo + React Native + TypeScript.

## Stack

- Expo SDK 54
- React Native 0.81
- TypeScript estricto
- React Navigation (native stack)

## Estructura

```text
src/
  app/
    AppNavigator.tsx
    AppProviders.tsx
  features/
    calendar/
      components/
        AgendaPreview.tsx
      screens/
        CalendarScreen.tsx
      types.ts
  shared/
    theme/
      colors.ts
      spacing.ts
    ui/
      Screen.tsx
```

## Comandos

- `npm run start`: iniciar Metro/Expo
- `npm run android`: abrir en Android
- `npm run web`: abrir en web
- `npm run typecheck`: validacion TypeScript
- `npm run doctor`: chequeo de entorno Expo

## Siguientes pasos recomendados

1. Agregar estado global (TanStack Query + Zustand).
2. Crear autenticacion (OAuth Google/Microsoft).
3. Implementar sincronizacion con calendarios externos.
