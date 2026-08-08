import "server-only";

import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { Pagina, Taller, Usuario } from "@/lib/api/contracts";
import { clearAccessToken, getAccessToken } from "@/lib/auth";
import { redirect } from "next/navigation";

async function redirigirSesionInvalida(error: unknown): Promise<never> {
  if (error instanceof ApiError && error.status === 401) {
    await clearAccessToken();
    redirect("/auth/login?error=session");
  }
  throw error;
}

export const demoTaller: Taller = {
  id: "demo",
  nombre: "Taller Norte",
  pais_codigo: "CO",
  moneda_codigo: "COP",
  rol_actual: "dueno",
};

export async function requirePortalSession() {
  const token = await getAccessToken();
  if (!token) return { user: { name: "Isabella López", email: "Isabella@tallernorte.co" } };
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
  try {
    const response = await api.get<Pagina<Taller> & { elementos?: Taller[] }>("/api/v1/talleres?limite=100");
    return response.items ?? response.elementos ?? [];
  } catch (error) {
    return redirigirSesionInvalida(error);
  }
}

export async function getUsuario(): Promise<Usuario | null> {
  await requirePortalSession();
  if (!(await getAccessToken())) return { id: "demo-user", nombre: "Isabella López", nombre_usuario: "Isabella" };
  try {
    return await api.get<Usuario>("/api/v1/usuarios/me");
  } catch (error) {
    return redirigirSesionInvalida(error);
  }
}
