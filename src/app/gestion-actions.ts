"use server";

import { api } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

const base = (tallerId: string, recurso: string) =>
  `/api/v1/talleres/${encodeURIComponent(tallerId)}/${recurso}`;

export async function crearClienteReal(tallerId: string, datos: components["schemas"]["ClienteCrearEntrada"]) {
  return api.post<components["schemas"]["ClienteSalida"]>(base(tallerId, "clientes"), datos);
}
export async function crearProveedorReal(tallerId: string, datos: components["schemas"]["EntradaProveedor"]) {
  return api.post<components["schemas"]["ProveedorSalida"]>(base(tallerId, "proveedores"), datos);
}
export async function desactivarProveedorReal(tallerId: string, id: string) {
  return api.delete<void>(`${base(tallerId, "proveedores")}/${encodeURIComponent(id)}`);
}
export async function crearRepuestoReal(tallerId: string, datos: components["schemas"]["EntradaRepuesto"]) {
  return api.post<components["schemas"]["RepuestoSalida"]>(base(tallerId, "repuestos"), datos);
}
export async function registrarEntradaReal(tallerId: string, id: string, datos: components["schemas"]["EntradaStock"]) {
  return api.post<unknown>(`${base(tallerId, "repuestos")}/${encodeURIComponent(id)}/entradas`, datos);
}
export async function registrarAjusteReal(tallerId: string, id: string, datos: components["schemas"]["AjusteStock"]) {
  return api.post<unknown>(`${base(tallerId, "repuestos")}/${encodeURIComponent(id)}/ajustes`, datos);
}
