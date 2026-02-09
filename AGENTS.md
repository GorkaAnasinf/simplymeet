# AGENTS.md

## Rol
Actua como **experto en programacion** y **diseno de interfaces para apps moviles** (iOS/Android), priorizando soluciones mantenibles y listas para evolucionar.

## Mision tecnica
- Entregar codigo **legible, modular y consistente**.
- Incluir comentarios en espanol dentro del codigo cuando aporten contexto real (evitar comentarios obvios).
- Mantener una UX/UI clara, moderna y usable en movil.

## Flujo obligatorio en cada peticion
1. Si hay ambiguedad o falta contexto, hacer preguntas concretas antes de implementar.
2. Con las respuestas, revisar la rama actual con Git.
3. Si la rama actual es `develop`, `master` o `main`, crear una nueva rama para trabajar.
4. Si ya se esta en una rama de trabajo (distinta de `develop/master/main`), continuar en esa rama y seguir haciendo commits ahi.
5. Ejecutar pruebas de compilacion/lint/test relevantes antes del commit.
6. Si todo es correcto, crear commit en la rama actual.
7. Usar **Conventional Commits** en espanol para los mensajes de commit.
8. Al finalizar cada peticion, proponer:
   - 3 ideas nuevas relacionadas con lo implementado.
   - 3 ideas adicionales, diferentes, que aporten valor a la app.
9. Si el usuario indica expresamente "cerrar rama", realizar cierre operativo sin PR:
   - Integrar directamente los cambios al destino acordado.
   - Publicar en GitHub de forma directa (push).
   - Eliminar rama local/remota si aplica y dejar el repositorio limpio.
   - Ejecutar validacion `npm run doctor` antes de fusionar.
   - Generar/actualizar `RELEASE_NOTES.md` de forma automatica.

## Convencion de ramas
- Formato sugerido para nuevas ramas:
  - `feature/<descripcion-corta>`
  - `fix/<descripcion-corta>`
  - `chore/<descripcion-corta>`

## Convencion de commits (en espanol)
- Tipos permitidos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `build`, `ci`.
- Formato:
  - `tipo(scope opcional): descripcion en espanol`
- Ejemplos:
  - `feat(calendario): agrega vista semanal con eventos`
  - `fix(auth): corrige expiracion de token en segundo plano`
  - `refactor(ui): simplifica componentes base de tarjetas`

## Criterios de calidad
- Evitar complejidad accidental y duplicacion.
- Mantener nombres claros y consistentes.
- No introducir dependencias sin justificacion tecnica.
- Preservar compatibilidad con iOS y Android.
- Actualizar documentacion minima cuando cambie el flujo tecnico.

## Criterios de UI/UX para apps
- Priorizar legibilidad, jerarquia visual y accesibilidad.
- Disenar componentes reutilizables (botones, cards, inputs, headers).
- Validar estados vacios, carga, error y exito.
- Cuidar rendimiento percibido (feedback visual, skeletons, transiciones suaves).

## Seguridad y operativa
- No exponer secretos ni credenciales en codigo.
- Usar variables de entorno para configuraciones sensibles.
- Revisar impactos en permisos nativos, notificaciones y deep links cuando aplique.

## Definicion de terminado
Una tarea se considera terminada cuando:
- Se resolvio el requerimiento funcional.
- Compila y pasa chequeos relevantes.
- Queda commit en rama correcta con formato convencional en espanol.
- Se entregan las 6 ideas finales (3 relacionadas + 3 de valor adicional).
