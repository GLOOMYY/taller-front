# Taller Front

Portal web de las fases 1 y 2 de Taller, construido con Next.js 16, React 19 y Tailwind 4. Incluye el portal privado para dueños y técnicos y el seguimiento público de cada reparación.

## Inicio local

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Sin variables de Auth0 el proyecto inicia en modo demostración local. El botón **Explorar demo** abre un taller de muestra y `/seguimiento/demo` muestra el seguimiento público. En un entorno conectado configura una aplicación Auth0 de tipo Regular Web App, usa `http://localhost:3000/auth/callback` como callback y establece el audience de FastAPI en `AUTH0_AUDIENCE`.

El frontend nunca entrega el access token al navegador: el SDK mantiene la sesión cifrada en cookie HttpOnly y el cliente API server-only añade `Authorization` a FastAPI. Todas las lecturas de tenant usan `cache: "no-store"`.

## Contrato

`openapi/taller-api.json` es la instantánea versionada de FastAPI y `src/lib/api/schema.d.ts` contiene los tipos generados.

```bash
pnpm openapi:generate
pnpm openapi:check
```

Si cambia el backend, exporta primero su instantánea y copia el resultado a `openapi/taller-api.json`. CI falla cuando el tipo generado deriva de la instantánea.

## Calidad

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Playwright cubre escritorio claro y móvil oscuro. Las pruebas ordinarias usan el modo demostración y no dependen de Auth0 ni de una red externa.
