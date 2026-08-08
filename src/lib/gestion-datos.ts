import "server-only";

import { api } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth";
import type { components } from "@/lib/api/schema";
import type { Cliente, Proveedor, Repuesto } from "@/components/gestion/types";

type PaginaClientes = components["schemas"]["PaginaClientesSalida"];
type PaginaProveedores = components["schemas"]["PaginaProveedoresSalida"];
type PaginaRepuestos = components["schemas"]["PaginaRepuestosSalida"];

const ruta = (tallerId: string, recurso: string) =>
  `/api/v1/talleres/${encodeURIComponent(tallerId)}/${recurso}?limite=100`;

export async function obtenerClientesGestion(tallerId: string): Promise<Cliente[] | undefined> {
  if (!(await getAccessToken()) || tallerId === "demo") return undefined;
  const pagina = await api.get<PaginaClientes>(ruta(tallerId, "clientes"));
  return pagina.items.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    telefono: item.telefono ?? "",
    correo: item.correo ?? undefined,
    activo: true,
    equipos: [],
    ordenes: 0,
  }));
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
