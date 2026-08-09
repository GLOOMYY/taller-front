import "server-only";

import { api } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth";
import type { components } from "@/lib/api/schema";
import type { Cliente, ModeloOpcion, Proveedor, Repuesto } from "@/components/gestion/types";

type PaginaClientes = components["schemas"]["PaginaClientesSalida"];
type PaginaProveedores = components["schemas"]["PaginaProveedoresSalida"];
type PaginaRepuestos = components["schemas"]["PaginaRepuestosSalida"];

const ruta = (tallerId: string, recurso: string) =>
  `/api/v1/talleres/${encodeURIComponent(tallerId)}/${recurso}?limite=100`;

export async function obtenerClientesGestion(tallerId: string): Promise<{ clientes: Cliente[]; modelos: ModeloOpcion[] } | undefined> {
  if (!(await getAccessToken()) || tallerId === "demo") return undefined;
  const base = `/api/v1/talleres/${encodeURIComponent(tallerId)}`;
  const [pagina, modelos, marcas, tipos] = await Promise.all([
    api.get<PaginaClientes>(ruta(tallerId, "clientes")),
    api.get<components["schemas"]["PaginaModeloSalida"]>(`${base}/modelos-dispositivo?limite=100`),
    api.get<components["schemas"]["PaginaCatalogoSalida"]>(`${base}/marcas-dispositivo?limite=100`),
    api.get<components["schemas"]["PaginaCatalogoSalida"]>(`${base}/tipos-dispositivo?limite=100`),
  ]);
  const marcaPorId = new Map(marcas.items.map((item) => [item.id, item.nombre]));
  const tipoPorId = new Map(tipos.items.map((item) => [item.id, item.nombre]));
  const modelosDisponibles: ModeloOpcion[] = modelos.items.filter((item) => item.activo).map((item) => ({ id: item.id, nombre: item.nombre, marca: marcaPorId.get(item.marca_id) ?? "", tipo: tipoPorId.get(item.tipo_id) ?? "" }));
  const clientes = await Promise.all(pagina.items.map(async (item) => {
    const dispositivos = await api.get<components["schemas"]["PaginaDispositivosSalida"]>(`${base}/clientes/${encodeURIComponent(item.id)}/dispositivos?limite=100`);
    return {
    id: item.id,
    nombre: item.nombre,
    telefono: item.telefono ?? "",
    correo: item.correo ?? undefined,
    activo: true,
    equipos: dispositivos.items.map((equipo) => {
      const modelo = modelos.items.find((item) => item.id === equipo.modelo_id);
      return { id: equipo.id, modeloId: equipo.modelo_id, tipo: tipoPorId.get(modelo?.tipo_id ?? "") ?? "", marca: marcaPorId.get(modelo?.marca_id ?? "") ?? "", modelo: modelo?.nombre ?? "Modelo", serie: equipo.identificador ?? "", alias: equipo.notas ?? "" };
    }),
    ordenes: 0,
    };
  }));
  return { clientes, modelos: modelosDisponibles };
}

export async function obtenerProveedoresGestion(tallerId: string): Promise<Proveedor[] | undefined> {
  if (!(await getAccessToken()) || tallerId === "demo") return undefined;
  const pagina = await api.get<PaginaProveedores>(ruta(tallerId, "proveedores"));
  return pagina.items.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    contacto: item.contacto ?? undefined,
    activo: item.activo,
    repuestos: 0,
  }));
}

export async function obtenerRepuestosGestion(tallerId: string): Promise<Repuesto[] | undefined> {
  if (!(await getAccessToken()) || tallerId === "demo") return undefined;
  const pagina = await api.get<PaginaRepuestos>(ruta(tallerId, "repuestos"));
  return pagina.items.map((item) => ({
    id: item.id,
    sku: item.codigo ?? "",
    nombre: item.nombre,
    categoria: "",
    existencia: item.existencia,
    minimo: 0,
    unidad: "unidad",
    activo: item.activo,
  }));
}

export async function obtenerMovimientosGestion(
  tallerId: string,
  repuestos: Repuesto[] | undefined,
): Promise<import("@/components/gestion/types").MovimientoInventario[] | undefined> {
  if (!(await getAccessToken()) || tallerId === "demo") return undefined;
  if (!repuestos?.length) return [];
  const paginas = await Promise.all(
    repuestos.map((repuesto) =>
      api.get<components["schemas"]["PaginaMovimientosSalida"]>(
        `${ruta(tallerId, `repuestos/${encodeURIComponent(repuesto.id)}/movimientos`)}`,
      ),
    ),
  );
  return paginas
    .flatMap((pagina, index) => pagina.items.map((item) => ({
      id: item.id,
      fecha: item.creado_en,
      repuesto: repuestos[index].nombre,
      tipo: item.tipo === "entrada" ? "entrada" : item.tipo === "salida" ? "salida" : "ajuste",
      cantidad: item.cantidad,
      referencia: item.nota ?? item.motivo ?? item.orden_id ?? "—",
      responsable: "Sesión actual",
    } satisfies import("@/components/gestion/types").MovimientoInventario)))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}
