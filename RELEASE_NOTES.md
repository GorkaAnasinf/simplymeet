# Release Notes

## 2026-02-11 - cierre de rama `feature/odoo-integracion-calendario`
Base: `main`
- feat(ui): aplica paleta corporativa Odoo en toda la app\n\nReemplaza los colores cyan/azul eléctrico por la identidad visual\nde Odoo: ciruela (#714B67) como acento primario, teal (#00A09D)\npara éxitos, y degradados oscuros en tonos plum.\n\nArchivos actualizados:\n- splashColors.ts: nueva paleta dark con tokens reutilizables\n- colors.ts: tema claro con tonos Odoo\n- LogoGlow, ProgressBar, FloatingParticles: heredan automáticamente\n- DayScheduleCard, EmployeeSelectorCard, UserMenu: rgba actualizados\n- CalendarPickerModal, DayNavigator: coherencia visual completa"
- fix(calendario): usa paleta de app y abre modal al pulsar reunion
- feat(calendario): mejora timeline diaria y detalle enriquecido de reuniones
- fix(calendario): evita bloqueo de carga y agrega timeout a Odoo
- feat(calendario): extiende chips por franjas y anade selector mensual
- feat(calendario): mejora franjas ocupadas en vista diaria
- fix(calendario): agrupa reuniones por hora de inicio en vista diaria
- feat(calendar): mejora carga por dia y pinta tramos ocupados continuos
- feat(calendar): cachea agenda por dia y agrupa reuniones largas
- fix(odoo): envia rango diario en formato datetime compatible
- chore(vscode): depura android con cache limpia y cierre de metro
- feat(odoo): integra conexion real, seleccion de empleado y agenda diaria

# Release Notes

## 2026-02-10 - cierre de rama `feature/home-dia-coherencia-ui`
Base: `main`
- feat(calendar): crea home diaria con navegador y horas ocupadas

# Release Notes

## 2026-02-09 - cierre de rama `feature/splash-screen`
Base: `main`
- fix(tasks): corrige tarea AVD para PowerShell 5.1\n\n- Elimina invocación anidada de powershell que destruía comillas\n- Usa Join-Path encadenado compatible con PS 5.1 (no soporta 3 args)\n- Configura shell explícito en options para evitar doble evaluación"
- fix(vscode): corrige argumentos al iniciar avd en powershell
- fix(vscode): detecta sdk android con fallback al iniciar avd
- feat(splash): agrega splash screen animada con comprobaciones de arranque simuladas\n\n- Diseño 'Dark Cosmos' con gradiente oscuro y partículas flotantes\n- Logo 'S' con anillo luminoso pulsante\n- Barra de progreso con degradado y efecto glow\n- Lista de 4 pasos de verificación con animaciones de entrada\n- Duración total ~6 segundos con transición fade-out\n- Integración en App.tsx como pantalla inicial"

# Release Notes

## 2026-02-09 - cierre de rama `chore/automatiza-cierre-rama`
Base: `main`
- feat(workflow): automatiza cierre de rama con release notes y doctor

## 2026-02-09 - cierre de rama `chore/automatiza-cierre-rama`
Base: `main`
- Sin commits nuevos respecto a la rama base.




