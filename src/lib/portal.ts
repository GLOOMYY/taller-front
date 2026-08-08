import "server-only";

import { api } from "@/lib/api/client";
import type { Pagina, Taller, Usuario } from "@/lib/api/contracts";
import { getAccessToken } from "@/lib/auth";

export const demoTaller: Taller = {
  id: "demo",
  nombre: "Taller Norte",
  pais_codigo: "CO",
  moneda_codigo: "COP",
  rol_actual: "dueno",
};

export async function requirePortalSession() {
  const token = await getAccessToken();
  if (!token) return { user: { name: "Mariana López", email: "mariana@tallernorte.co" } };
  return { user: { name: "Usuario Taller", email: "" } };
}

export async function getTaller(tallerId: string): Promise<Taller> {
  await requirePortalSession();
  if (!(await getAccessToken()) || tallerId === "demo") return { ...demoTaller, id: tallerId };
  return api.get<Taller>(`/api/v1/talleres/${encodeURIComponent(tallerId)}`);
}

export async function getTalleres(): Promise<Taller[]> {
  await requirePortalSession();
  if (!(await getAccessToken())) return [demoTaller, { ...demoTaller, id: "centro", nombre: "Taller Centro", rol_actual: "tecnico" }];
  const response = await api.get<Pagina<Taller> & { elementos?: Taller[] }>("/api/v1/talleres?limite=100");
  return response.items ?? response.elementos ?? [];
}

export async function getUsuario(): Promise<Usuario | null> {
  await requirePortalSession();
  if (!(await getAccessToken())) return { id: "demo-user", nombre: "Mariana López", nombre_usuario: "mariana" };
  try { return await api.get<Usuario>("/api/v1/usuarios/me"); } catch { return null; }
}
