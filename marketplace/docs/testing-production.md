# Testing y producción

## Capas

- **Unit/action:** Vitest importa `createAd` y `updateAdTitle` como funciones. Auth, Prisma y revalidación se mockean; Zod permanece real. Esto prueba decisiones y efectos llamados, no cookies ni una base real.
- **Componente:** Testing Library ejecuta `SearchAdForm` en `jsdom`. Las aserciones usan roles, labels, `FormData` y el contrato GET público.
- **E2E:** Playwright usa Chromium, el servidor de desarrollo y la sesión A/B local. El fixture A se resuelve por datos sembrados y el título se restaura en `finally`.

No se duplica cada aserción en todas las capas. Cada test cubre la frontera que puede observar.

## Flujo local

```bash
npm run db:migrate
npm run db:seed
npm run test:run
npm run lint
npm run typecheck
npm run build
npm run test:smoke
npm run test:e2e
```

El E2E debe ejecutarse dos veces antes de una clase o demo. Las dos pasadas deben terminar con el título original del fixture A.

## CI

El workflow separa calidad rápida y navegador:

1. Instala con `npm ci` y usa una base PostgreSQL de servicio.
2. Aplica migraciones con `npm run db:migrate:deploy`.
3. Ejecuta unit/component tests, lint, typecheck y build.
4. Si la calidad pasa, construye la app y ejecuta el smoke público contra `next start`.
5. Siembra una base aislada, instala Chromium y ejecuta E2E contra desarrollo.
6. Conserva `playwright-report` y `test-results` solo como artefactos de diagnóstico.

Los secretos se inyectan como variables de entorno del entorno CI. No se imprimen ni se exponen mediante `NEXT_PUBLIC_`.

## Producción

- Pasar la suite no demuestra que el build, la migración o el despliegue funcionen.
- CI no bloquea un merge o deploy sin reglas de rama y checks requeridos configurados en GitHub.
- El E2E A/B es de laboratorio y no es un smoke de producción; el selector está bloqueado con `NODE_ENV=production`.
- El smoke incluido usa una ruta pública y acepta `SMOKE_BASE_URL` para comprobar un preview o despliegue real sin el selector A/B.
- Los límites serverless dependen de proveedor, plan, región, runtime y configuración vigentes.
- Un background job es un patrón para aceptar, encolar, procesar, persistir estado, reintentar y observar; no es una implementación requerida por Marketplace.
- `output: "standalone"` empaqueta un servidor Node mínimo, pero no crea red, proceso, secretos, base de datos, storage, observabilidad ni rollback.
- `output: "export"` no es compatible con esta app mientras use Server Actions y renderizado dinámico.

Antes de desplegar se deben definir variables, migraciones, smoke check, observabilidad y rollback.
