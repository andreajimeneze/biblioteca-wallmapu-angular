## Contexto del Proyecto

Estoy trabajando en un proyecto Angular 21 llamado **Biblioteca Wallmapu**. Es una aplicación de biblioteca digital que aún está en desarrollo.

### Stack Tecnológico
- **Angular 21.1.0** (standalone components, signals, modern features)
- **TypeScript 5.9.2** (strict mode habilitado)
- **Tailwind CSS 4.1.12** con DaisyUI
- **RxJS 7.8.0**
- **Vitest** para testing (configurado pero sin tests aún)

### Arquitectura del Proyecto
```
src/app/
├── core/              # Servicios core, interceptors, guards, helpers
├── features/          # Módulos de features (auth, public/home, public/library, public/news)
├── layouts/           # Layouts (public-layout, admin-layout, user-layout)
├── shared/            # Componentes, modelos, constantes compartidas
└── app.config.ts      # Configuración de la aplicación
```

### Características Principales
- **Autenticación**: Google OAuth 2.0 con Google Identity Services
- **Rutas**: Lazy loading implementado, view transitions habilitadas
- **Estado**: Signals para reactividad moderna, `toSignal()` para Observables
- **Estilos**: Tailwind CSS con DaisyUI, colores personalizados en `@theme`
- **Path Aliases**: `@core/*`, `@shared/*`, `@features/*`, `@layouts/*`, `@environments/*`

### Estado Actual
- ✅ Estructura base implementada
- ✅ Autenticación con Google (parcialmente implementada)
- ✅ Páginas públicas: Home, Library, News
- ⚠️ Layouts Admin y User aún no implementados
- ⚠️ Guards de rutas no implementados
- ⚠️ Servicios usan datos mock (hardcodeados)
- ⚠️ Falta manejo centralizado de errores HTTP

### Convenciones del Proyecto
- **Componentes**: Standalone, sin NgModules
- **Servicios**: `inject()` en lugar de constructor injection
- **Signals**: Para estado reactivo (`signal`, `computed`)
- **Observables**: Convertidos a signals con `toSignal()`
- **Cleanup**: `takeUntilDestroyed()` para suscripciones
- **Imágenes**: `NgOptimizedImage` para optimización
- **Inputs**: `@Input({ required: true })` cuando es obligatorio

### Archivos Clave
- `app.config.ts`: Configuración de providers (router, http, interceptors)
- `app.routes.ts`: Rutas principales con lazy loading
- `core/interceptors/auth-interceptor.ts`: Interceptor para JWT
- `core/services/book-service.ts` y `news-service.ts`: Servicios con datos mock
- `features/auth/services/auth-service.ts`: Servicio de autenticación con Google
- `shared/constants/routes.ts`: Constantes de rutas
- `environments/environment.ts`: Configuración de entorno

### Notas Importantes
- El proyecto usa **mejores prácticas modernas de Angular 21**
- Prefiero **soluciones modernas** sobre legacy patterns
- El código debe ser **type-safe** (evitar `any` cuando sea posible)
- Los componentes deben ser **standalone**
- Usar **signals** para estado reactivo cuando sea apropiado
- El proyecto aún no está en producción, hay espacio para refactorizaciones

### Próximos Pasos Planificados
- Implementar layouts Admin y User (con navbars distintos)
- Conectar servicios con API real (actualmente usan datos mock)
- Implementar guards de autenticación
- Agregar manejo centralizado de errores

---
