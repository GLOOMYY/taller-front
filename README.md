# Taller Front

Portal web de las fases 1 y 2 de Taller, construido con Next.js 16, React 19 y Tailwind 4. Incluye el portal privado para dueños y técnicos y el seguimiento público de cada reparación.

## Inicio local

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Para probar registro y login reales, inicia antes el backend en
`../taller-back`: copia su `.env`, levanta Docker Compose y ejecuta
`uvicorn app.main:app --reload`. El frontend local usa
`API_URL=http://127.0.0.1:8000`; el modo demo sigue funcionando sin backend.
Antes de crear el primer taller, ejecuta `curl http://127.0.0.1:8000/health/ready`
para sincronizar países, monedas e índices en MongoDB.

Sin variables adicionales el proyecto inicia en modo demostración local. El botón **Explorar demo** abre un taller de muestra y `/seguimiento/demo` muestra el seguimiento público. El login real usa JWT propios emitidos por FastAPI; el token se guarda únicamente en una cookie HttpOnly del frontend.

El frontend nunca entrega el JWT a JavaScript: la sesión se guarda en una cookie HttpOnly y el cliente API server-only añade `Authorization` a FastAPI. Todas las lecturas de tenant usan `cache: "no-store"`.

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

Playwright cubre escritorio claro y móvil oscuro. Las pruebas ordinarias usan el modo demostración y no dependen de un proveedor externo ni de una red externa.
