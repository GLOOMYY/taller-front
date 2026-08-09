import "server-only";

import { api } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth";
import type { components } from "@/lib/api/schema";
import type { Catalogo, MetodoGestion, MiembroGestion } from "@/components/gestion/configuracion-panel";

export async function obtenerConfiguracionGestion(tallerId: string): Promise<{ catalogos?: Catalogo[]; metodos?: MetodoGestion[]; miembros?: MiembroGestion[] }> {
  if (!(await getAccessToken()) || tallerId === "demo") return {};
  const base = `/api/v1/talleres/${encodeURIComponent(tallerId)}`;
  const [tipos, marcas, modelos, servicios, metodos, miembros] = await Promise.all([
    api.get<components["schemas"]["PaginaCatalogoSalida"]>(`${base}/tipos-dispositivo?limite=100`),
    api.get<components["schemas"]["PaginaCatalogoSalida"]>(`${base}/marcas-dispositivo?limite=100`),
    api.get<components["schemas"]["PaginaModeloSalida"]>(`${base}/modelos-dispositivo?limite=100`),
    api.get<components["schemas"]["PaginaTipoServicioSalida"]>(`${base}/tipos-servicio?limite=100`),
    api.get<components["schemas"]["PaginaMetodosSalida"]>(`${base}/metodos-pago?limite=100`),
    api.get<components["schemas"]["ListaMembresiasResponse"]>(`${base}/miembros?limite=100`),
  ]);
  return {
    catalogos: [
      { clave: "tipos", titulo: "Tipos de equipo", descripcion: "Clasifica los dispositivos que recibes.", valores: tipos.items.map((item) => item.nombre), items: tipos.items },
      { clave: "marcas", titulo: "Marcas", descripcion: "Marcas disponibles al registrar un equipo.", valores: marcas.items.map((item) => item.nombre), items: marcas.items },
      { clave: "modelos", titulo: "Modelos", descripcion: "Modelos asociados a un tipo y una marca.", valores: modelos.items.map((item) => item.nombre), items: modelos.items },
      { clave: "servicios", titulo: "Tipos de servicio", descripcion: "Servicios reutilizables al cotizar una orden.", valores: servicios.items.map((item) => item.nombre), items: servicios.items },
    ],
    metodos: metodos.items.map((item) => ({ id: item.id, nombre: item.nombre, activo: item.activo })),
    miembros: miembros.items.map((item) => ({ id: item.usuario_id, usuarioId: item.usuario_id, rol: item.rol })),
  };
}
