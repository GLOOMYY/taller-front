import "server-only";

import { api } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth";
import type { components } from "@/lib/api/schema";
import type { Catalogo, MetodoGestion } from "@/components/gestion/configuracion-panel";

export async function obtenerConfiguracionGestion(tallerId: string): Promise<{ catalogos?: Catalogo[]; metodos?: MetodoGestion[] }> {
  if (!(await getAccessToken()) || tallerId === "demo") return {};
  const base = `/api/v1/talleres/${encodeURIComponent(tallerId)}`;
  const [tipos, marcas, servicios, metodos] = await Promise.all([
    api.get<components["schemas"]["PaginaCatalogoSalida"]>(`${base}/tipos-dispositivo?limite=100`),
    api.get<components["schemas"]["PaginaCatalogoSalida"]>(`${base}/marcas-dispositivo?limite=100`),
    api.get<components["schemas"]["PaginaTipoServicioSalida"]>(`${base}/tipos-servicio?limite=100`),
    api.get<components["schemas"]["PaginaMetodosSalida"]>(`${base}/metodos-pago?limite=100`),
  ]);
  return {
    catalogos: [
      { titulo: "Tipos de equipo", descripcion: "Clasifica los dispositivos que recibes.", valores: tipos.items.map((item) => item.nombre) },
      { titulo: "Marcas", descripcion: "Marcas disponibles al registrar un equipo.", valores: marcas.items.map((item) => item.nombre) },
      { titulo: "Tipos de servicio", descripcion: "Servicios reutilizables al cotizar una orden.", valores: servicios.items.map((item) => item.nombre) },
    ],
    metodos: metodos.items.map((item) => ({ id: item.id, nombre: item.nombre, activo: item.activo })),
  };
}
