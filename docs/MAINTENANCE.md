# 📚 Guía de Mantenimiento de Documentación

## 🎯 Principios

1. **La documentación es código** - Debe ser tratada con el mismo rigor
2. **Sincronización obligatoria** - Actualiza docs al mismo tiempo que el código
3. **Elimina lo obsoleto** - No dejes docs antiguos confundiendo a futuros desarrolladores
4. **Un solo lugar, una sola verdad** - Evita duplicaciones

---

## 📁 Estructura de Documentación

### Archivos Raíz
- **README.md** - Entrada principal, overview general del proyecto
- **CHANGELOG.md** - Historial cronológico de todos los cambios

### Carpeta docs/

| Archivo | Propósito | Cuándo actualizar |
|---------|-----------|-------------------|
| **SETUP.md** | Guía de configuración inicial | Al cambiar proceso de setup |
| **SUPABASE_GUIDE.md** | Guía maestra de Supabase (Auth, RLS, Storage) | Al modificar tablas, políticas o storage |
| **ARCHITECTURE.md** | Patrones de arquitectura y decisiones técnicas | Al cambiar estructura o patrones |
| **DATABASE.md** | Schema completo, tablas, tipos, migraciones | Al agregar/modificar tablas o campos |
| **API.md** | Servicios, hooks, endpoints | Al crear/modificar servicios o hooks |
| **COMPONENTS.md** | Catálogo de componentes UI | Al crear/modificar componentes reutilizables |
| **CODE_CONVENTIONS.md** | Estándares de código y mejores prácticas | Al adoptar nuevas convenciones |
| **STYLES.md** | Sistema de diseño (colores, tipografías, espaciados) | Al cambiar paleta, fuentes o espaciado |
| **ROADMAP.md** | Sprints completados y próximos pasos | Al completar sprints o planear nuevos |

---

## ✅ Checklist por Tipo de Cambio

### Al agregar una nueva feature

- [ ] Código implementado y testeado
- [ ] Actualizar `COMPONENTS.md` si es componente reutilizable
- [ ] Actualizar `API.md` si agrega servicios/hooks
- [ ] Actualizar `DATABASE.md` si modifica schema
- [ ] Agregar entrada en `CHANGELOG.md`
- [ ] Actualizar `README.md` features si es feature mayor
- [ ] Commit: `feat(scope): description` + `docs: update X with Y`

### Al modificar el schema de DB

- [ ] Ejecutar migration en Supabase
- [ ] Actualizar tipos TypeScript en código
- [ ] Documentar cambios en `DATABASE.md`
  - Agregar/modificar tabla
  - Actualizar diagrama ER si es necesario
  - Documentar nuevas RLS policies
- [ ] Actualizar `SUPABASE_GUIDE.md` si afecta setup
- [ ] Commit: `feat(db): add X table` + `docs: update DATABASE schema`

### Al crear/modificar componentes

- [ ] Componente implementado y responsive
- [ ] Props documentadas con TypeScript
- [ ] Agregar sección en `COMPONENTS.md`:
  - Ubicación del archivo
  - Props interface
  - Ejemplo de uso
  - Screenshots si es visual
- [ ] Agregar a changelog si es componente mayor
- [ ] Commit: `feat(ui): add X component` + `docs: add X to COMPONENTS`

### Al cambiar arquitectura

- [ ] Implementar cambio en código
- [ ] Actualizar `ARCHITECTURE.md` con nueva estructura
- [ ] Actualizar diagramas si existen
- [ ] Explicar el "por qué" del cambio
- [ ] Commit: `refactor: restructure X` + `docs: update architecture`

### Al completar un sprint

- [ ] Marcar tasks completadas en `ROADMAP.md`
- [ ] Agregar entrada detallada en `CHANGELOG.md`
- [ ] Actualizar features en `README.md`
- [ ] Revisar y actualizar cualquier doc afectado
- [ ] Tag de git: `git tag -a v0.X.0 -m "Sprint X completed"`
- [ ] Commit: `docs: update ROADMAP and CHANGELOG for Sprint X`

---

## 🚫 Qué NO hacer

❌ **Crear archivos temporales sin eliminarlos**
- `TEMP_NOTES.md`, `OLD_PLAN.md`, etc.
- Si necesitas notas temporales, usa comentarios en el código

❌ **Duplicar información**
- No copies el mismo SQL en 3 archivos diferentes
- Referencia con links: "Ver SQL en [DATABASE.md](DATABASE.md)"

❌ **Dejar docs obsoletos**
- Si algo ya no aplica, ELIMÍNALO
- No comentes, no renombres a "OLD_*", ELIMÍNALO

❌ **Documentar implementaciones temporales**
- Si algo es provisional, márcalo como TODO en el código
- No lo documentes como si fuera permanente

❌ **Olvidar actualizar README**
- El README es la puerta de entrada
- Debe reflejar el estado actual, no el del mes pasado

---

## 🔄 Proceso de Revisión (cada 2 sprints)

1. **Auditoría de archivos**
   ```bash
   ls -lh docs/
   ```
   - ¿Hay archivos sin actualizar en meses?
   - ¿Hay archivos que ya no aplican?

2. **Revisar TODO en docs**
   ```bash
   grep -r "TODO\|PENDIENTE\|⏳" docs/
   ```
   - Actualizar o eliminar TODOs antiguos

3. **Verificar links rotos**
   - Revisar que todos los links internos funcionen
   - Actualizar referencias a archivos eliminados

4. **Consolidar si es necesario**
   - Si varios archivos cubren el mismo tema, considera consolidar

5. **Actualizar diagramas**
   - Si el schema o arquitectura cambió, actualiza los diagramas

---

## 📝 Plantilla de Commit

Cuando actualices documentación, usa este formato:

```bash
docs: update COMPONENTS with new RecipeCard props

- Added favorite button documentation
- Updated props interface with loading states
- Added screenshot of new design
- Removed obsolete CardV1 documentation
```

---

## 💡 Tips

1. **Escribe para el futuro tú** - En 6 meses no recordarás por qué algo se hizo
2. **Ejemplos > Texto** - Un snippet de código vale más que 3 párrafos
3. **Mantén la simplicidad** - Si algo es complicado de documentar, tal vez sea complicado de usar
4. **Links, no duplicación** - Usa referencias en vez de copiar
5. **Fecha las decisiones** - "A partir del 15/11/2025, usamos React Query en vez de Redux"

---

**Última revisión:** 17 nov 2025  
**Próxima revisión:** Sprint 6 (Jan 2026)
