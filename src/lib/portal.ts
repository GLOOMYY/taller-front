import "server-only";

import { redirect } from "next/navigation";
import { api } from "@/lib/api/client";
import type { Pagina, Taller, Usuario } from "@/lib/api/contracts";
import { auth0, auth0Configured } from "@/lib/auth0";

export const demoTaller: Taller = {
  id: "demo",
  nombre: "Taller Norte",
  pais_codigo: "CO",
  moneda_codigo: "COP",
  rol_actual: "dueno",
};

export async function requirePortalSession() {
  if (!auth0Configured) return { user: { name: "Mariana López", email: "mariana@tallernorte.co" } };
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");
  return session;
}

export async function getTaller(tallerId: string): Promise<Taller> {
  await requirePortalSession();
  if (!auth0Configured || tallerId === "demo") return { ...demoTaller, id: tallerId };
  return api.get<Taller>(`/api/v1/talleres/${encodeURIComponent(tallerId)}`);
}

export async function getTalleres(): Promise<Taller[]> {
  await requirePortalSession();
  if (!auth0Configured) return [demoTaller, { ...demoTaller, id: "centro", nombre: "Taller Centro", rol_actual: "tecnico" }];
  const response = await api.get<Pagina<Taller> & { elementos?: Taller[] }>("/api/v1/talleres?limite=100");
  return response.items ?? response.elementos ?? [];
}

export async function getUsuario(): Promise<Usuario | null> {
  await requirePortalSession();
  if (!auth0Configured) return { id: "demo-user", nombre: "Mariana López", nombre_usuario: "mariana" };
  try { return await api.get<Usuario>("/api/v1/usuarios/me"); } catch { return null; }
}
