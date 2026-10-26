---
name: log-change
description: Registra en docs/CHANGELOG.md un cambio de desarrollo ya aprobado. Úsala justo después de aprobar una tarea con review-task, o cuando el usuario pida registrar un cambio de código en el changelog. No la uses para cambios de documentación, planificación ni memoria.
---

# Registrar un cambio en el CHANGELOG

`docs/CHANGELOG.md` es la historia fiable de lo que cambió en el desarrollo. Pierde valor si se mezcla con ruido, así que solo entran cambios aprobados.

## Qué se registra
- Funcionalidades nuevas, correcciones de errores y refactors con efecto observable.
- Dependencias añadidas, actualizadas o eliminadas.
- Cambios de configuración de build, entorno o despliegue.
- Cambios de seguridad.

## Qué NO se registra
- Ediciones de `docs/` (PRD, Brief, Arquitectura, Reglas), cambios en `PROJECT-TASKS.md` o `memory.md`.
- Trabajo en revisión o rechazado.
- Formato o renombrados sin efecto funcional.

## Pasos
1. Obtén la fecha real: `date +%F`.
2. Elige la sección bajo `## [Sin publicar]`: **Añadido** (nuevo), **Cambiado** (modificado), **Corregido** (bug), **Eliminado**, **Seguridad**.
3. Añade una línea por cambio, escrita para una persona que no vio la tarea:
   `- <qué cambió y su efecto> (T-012, <agente>, <fecha>)`
4. No dupliques entradas ni cambies las anteriores.
5. Solo cuando el usuario pida publicar una versión: renombra `[Sin publicar]` a `[X.Y.Z] - <fecha>` según versionado semántico y crea una nueva sección `[Sin publicar]` vacía arriba.

## Ejemplos
- `- Pantalla de inicio de sesión con validación de campos y mensajes de error (T-014, frontend-dev, 2026-10-21)`
- `- Corregido el cálculo del total cuando hay descuentos acumulados (T-027, backend-dev, 2026-10-22)`
