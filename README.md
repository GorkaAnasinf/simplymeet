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
        DayNavigator.tsx
        DayScheduleCard.tsx
        EmployeeSelectorCard.tsx
        UserMenu.tsx
      screens/
        CalendarScreen.tsx
    odoo/
      OdooContext.tsx
      odooClient.ts
      odooConfig.ts
      types.ts
    notifications/
      meetingNotifications.ts
  shared/
    theme/
      appTheme.tsx
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
- `npm run release-notes:branch`: genera/actualiza `RELEASE_NOTES.md` para la rama actual
- `npm run close-branch`: valida doctor, fusiona en `main`, hace push y elimina la rama

## Configuracion Odoo

1. Crea `.env` a partir de `.env.example`.
2. Define:
   - `EXPO_PUBLIC_ODOO_URL`
   - `EXPO_PUBLIC_ODOO_DB`
   - `EXPO_PUBLIC_ODOO_USERNAME`
   - `EXPO_PUBLIC_ODOO_PASSWORD`
3. Reinicia Metro con cache limpia: `npx expo start -c`.

## Tema y notificaciones

- La app incluye toggle manual claro/oscuro en la cabecera del calendario.
- Si no hay preferencia guardada, usa `useColorScheme` del dispositivo.
- Los recordatorios de proximas reuniones usan `expo-notifications` (10 y 5 minutos antes).
- En Android se solicita permiso `POST_NOTIFICATIONS`.

## Cierre de rama automatizado

Ejecuta este comando desde una rama de trabajo limpia:

- `npm run close-branch`

El flujo hace automaticamente:
1. Generar `RELEASE_NOTES.md` con los commits de la rama.
2. Crear commit de release notes.
3. Ejecutar `npm run doctor` antes de fusionar.
4. Fusionar por fast-forward en `main`.
5. Publicar `main` en `origin`.
6. Eliminar la rama local y remota (si existe).

## Siguientes pasos recomendados

1. Agregar estado global (TanStack Query + Zustand).
2. Crear autenticacion (OAuth Google/Microsoft).
3. Implementar sincronizacion con calendarios externos.
