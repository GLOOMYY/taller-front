"use server";

import { api } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

const base = (tallerId: string, recurso: string) =>
  `/api/v1/talleres/${encodeURIComponent(tallerId)}/${recurso}`;

export async function crearClienteReal(tallerId: string, datos: components["schemas"]["ClienteCrearEntrada"]) {
  return api.post<components["schemas"]["ClienteSalida"]>(base(tallerId, "clientes"), datos);
}
export async function crearDispositivoReal(tallerId: string, clienteId: string, datos: components["schemas"]["DispositivoCrearEntrada"]) {
  return api.post<components["schemas"]["DispositivoSalida"]>(`${base(tallerId, `clientes/${encodeURIComponent(clienteId)}/dispositivos`)}`, datos);
}
export async function editarDispositivoReal(tallerId: string, dispositivoId: string, datos: components["schemas"]["DispositivoEditarEntrada"]) {
  return api.patch<components["schemas"]["DispositivoSalida"]>(`${base(tallerId, `dispositivos/${encodeURIComponent(dispositivoId)}`)}`, datos);
}
export async function crearProveedorReal(tallerId: string, datos: components["schemas"]["EntradaProveedor"]) {
  return api.post<components["schemas"]["ProveedorSalida"]>(base(tallerId, "proveedores"), datos);
}
export async function desactivarProveedorReal(tallerId: string, id: string) {
  return api.delete<void>(`${base(tallerId, "proveedores")}/${encodeURIComponent(id)}`);
}
export async function actualizarProveedorReal(
  tallerId: string,
  id: string,
  datos: components["schemas"]["CambioProveedor"],
) {
  return api.patch<components["schemas"]["ProveedorSalida"]>(
    `${base(tallerId, "proveedores")}/${encodeURIComponent(id)}`,
    datos,
  );
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

const catalogoPath: Record<string, string> = {
  tipos: "tipos-dispositivo",
  marcas: "marcas-dispositivo",
  modelos: "modelos-dispositivo",
  servicios: "tipos-servicio",
};

export async function crearCatalogoReal(tallerId: string, tipo: string, datos: Record<string, unknown>) {
  const path = catalogoPath[tipo];
  if (!path) throw new Error("Catálogo no válido");
  return api.post<unknown>(base(tallerId, path), datos);
}
export async function actualizarCatalogoReal(tallerId: string, tipo: string, id: string, datos: Record<string, unknown>) {
  const path = catalogoPath[tipo];
  if (!path) throw new Error("Catálogo no válido");
  return api.patch<unknown>(`${base(tallerId, path)}/${encodeURIComponent(id)}`, datos);
}
export async function desactivarCatalogoReal(tallerId: string, tipo: string, id: string) {
  const path = catalogoPath[tipo];
  if (!path) throw new Error("Catálogo no válido");
  return api.delete<void>(`${base(tallerId, path)}/${encodeURIComponent(id)}`);
}
export async function crearMetodoPagoReal(tallerId: string, nombre: string) {
  return api.post<components["schemas"]["MetodoPagoSalida"]>(base(tallerId, "metodos-pago"), { nombre });
}
export async function actualizarMetodoPagoReal(tallerId: string, id: string, datos: components["schemas"]["CambioMetodo"]) {
  return api.patch<components["schemas"]["MetodoPagoSalida"]>(`${base(tallerId, "metodos-pago")}/${encodeURIComponent(id)}`, datos);
}
export async function agregarMiembroReal(tallerId: string, datos: components["schemas"]["CrearMembresiaRequest"]) {
  return api.post<components["schemas"]["MembresiaResponse"]>(base(tallerId, "miembros"), datos);
}
export async function cambiarRolMiembroReal(tallerId: string, usuarioId: string, rol: components["schemas"]["RolMembresia"]) {
  return api.patch<components["schemas"]["MembresiaResponse"]>(`${base(tallerId, "miembros")}/${encodeURIComponent(usuarioId)}`, { rol });
}
export async function retirarMiembroReal(tallerId: string, usuarioId: string) {
  return api.delete<void>(`${base(tallerId, "miembros")}/${encodeURIComponent(usuarioId)}`);
}
export async function actualizarTallerReal(tallerId: string, datos: components["schemas"]["TallerCambio"]) {
  return api.patch<components["schemas"]["TallerSalida"]>(`/api/v1/talleres/${encodeURIComponent(tallerId)}`, datos);
}
