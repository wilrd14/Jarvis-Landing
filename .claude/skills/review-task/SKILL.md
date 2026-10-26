---
name: review-task
description: Revisa el trabajo de un subagente sobre una tarea de docs/PROJECT-TASKS.md antes de aprobarla. Úsala cuando una tarea esté en estado "En revisión", cuando un subagente reporte que terminó, o cuando el usuario pida revisar la tarea T-XXX. Verifica con evidencia propia (diff, comandos, criterios) en vez de fiarse del reporte.
---

# Revisar una tarea de subagente

El reporte del subagente describe lo que *cree* haber hecho; tu trabajo es comprobar lo que *realmente* quedó. Por eso verificas tú mismo, no copias sus resultados.

## Pasos
1. **Leer la tarea** completa en `docs/PROJECT-TASKS.md`: criterios de aceptación, zonas permitidas, comandos de verificación y el reporte.
2. **Ver qué cambió de verdad.** Con git: `git status` y `git diff` (o `git diff --stat` y luego por archivo). Sin git: revisa los archivos que lista el reporte y busca modificaciones no declaradas en las carpetas de código.
3. **Alcance.** ¿Se tocó algo fuera de las zonas permitidas? ¿Se modificó `CHANGELOG.md`, `memory.md` u otra tarea? Cualquiera de esas cosas es motivo de rechazo.
4. **Ejecutar la verificación tú mismo:** los comandos de la tarea más `npm run test`, `npm run lint`, `npm run check` y `npm run build`. Compara con lo que reportó el subagente.
5. **Criterios de aceptación**, uno por uno, con evidencia (salida de comando, archivo y línea, comportamiento observado).
6. **Reglas y arquitectura.** Contrasta con `docs/DEVELOPER-RULES.md` (§4 arquitectura, §6 seguridad, §10 prohibido) y `docs/SYSTEM-ARCHITECTURE.md`. Busca: secretos en código, dependencias no justificadas, código muerto, depuración olvidada, capas saltadas.
7. **Calidad de pruebas.** ¿Prueban comportamiento real o solo están para subir cobertura? ¿Cubren casos límite relevantes?

## Decisión
**Aprobar** solo si todos los criterios se cumplen y no hay incumplimientos de reglas:
- Escribe en el bloque de la tarea, en *Revisión del orquestador*: fecha, veredicto y evidencia breve.
- Estado → `Aprobada`.
- Ejecuta la skill `log-change`.
- Actualiza `.claude/memory.md` (última tarea aprobada, siguiente tarea, decisiones o convenciones nuevas).

**Rechazar** si algo falla:
- Estado → `Cambios solicitados`; suma 1 a *Intentos de revisión*.
- En *Revisión del orquestador* lista los problemas numerados, cada uno con: qué falla, dónde (archivo/línea) y qué se espera. Notas accionables, sin vaguedades como "mejorar calidad".
- Si *Intentos de revisión* llega a 3, no reenvíes: expón el problema al usuario y propón alternativas (dividir la tarea, cambiar de enfoque, aclarar el requisito).

## Formato de la revisión
```
Revisión · <fecha> · <Aprobada | Cambios solicitados> (intento N)
Verificado: <comandos ejecutados y resultado>
Criterios: <cumplidos/total>
Hallazgos:
1. <problema> — <archivo:línea> — <qué se espera>
```
