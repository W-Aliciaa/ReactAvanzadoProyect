# Marketplace

Marketplace es la baseline de React Avanzado Web20. La rama `clase-6-preparacion`
añade testing unitario, tests de componentes, E2E y gates de CI sobre la entrega
de la clase 5.

## Desarrollo

Arranca el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Antes de usar el laboratorio local, configura `.env` y `.env.local` a partir de
`.env.example`, aplica las migraciones y siembra los fixtures:

```bash
npm install
npm run db:migrate
npm run db:seed
```

El selector A/B de `/login` solo está habilitado en desarrollo y no representa
autenticación de producción.

## Testing

```bash
npm run test:run       # unit y component tests
npm run test:coverage  # unit/component con cobertura V8
npm run test:e2e       # Chromium contra npm run dev
npm run test:smoke     # ruta pública contra next start
npm run lint
npm run typecheck
npm run build
```

El E2E usa el fixture A de Ana, renombra su proyecto y lo restaura desde un
teardown directo aunque falle una aserción. Consulta `docs/testing-production.md`
para las fronteras de cada capa y el flujo de CI/deploy.

Para comprobar un despliegue real sin arrancar el servidor local:

```bash
SMOKE_BASE_URL=https://preview.example.com npm run test:smoke
```

## Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Vitest Documentation](https://vitest.dev/guide/)
