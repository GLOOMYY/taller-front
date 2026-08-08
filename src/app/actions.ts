"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api } from "@/lib/api/client";
import type { Taller, Usuario } from "@/lib/api/contracts";
import { clearAccessToken, getAccessToken, saveAccessToken } from "@/lib/auth";
import { requirePortalSession } from "@/lib/portal";
import { getApiUrl } from "@/lib/api/config";

const perfilSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(100),
  nombre_usuario: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/, "Usa letras, números, puntos o guiones"),
});

const tallerSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  pais_codigo: z.string().length(2),
  moneda_codigo: z.string().min(3).max(3),
});

const credencialesSchema = z.object({
  nombre_usuario: z.string().trim().min(3),
  password: z.string().min(8).max(200),
});

const registroSchema = credencialesSchema.extend({
  nombre: z.string().trim().min(2).max(100),
});

async function solicitarSesion(path: string, body: unknown) {
  let response: Response;
  try {
    response = await fetch(`${getApiUrl()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new Error("No se pudo conectar con el backend. Revisa API_URL en producción.");
  }
  if (!response.ok) {
    const error = (await response.json().catch(() => undefined)) as
      | { mensaje?: unknown }
      | undefined;
    const mensaje = typeof error?.mensaje === "string" ? error.mensaje : undefined;
    throw new Error(
      mensaje ??
        (path.endsWith("/registro")
          ? "No pudimos crear la cuenta. Revisa los datos."
          : "No pudimos iniciar sesión. Revisa tus datos."),
    );
  }
  const data = (await response.json()) as { access_token: string };
  await saveAccessToken(data.access_token);
}

export async function iniciarSesion(formData: FormData) {
  const parsed = credencialesSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Usuario o contraseña inválidos");
  await solicitarSesion("/api/v1/auth/login", parsed.data);
  redirect("/seleccionar-taller");
}

export async function registrarCuenta(formData: FormData) {
  const parsed = registroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Datos inválidos");
  await solicitarSesion("/api/v1/auth/registro", parsed.data);
  redirect("/seleccionar-taller");
}

export async function cerrarSesion() {
  await clearAccessToken();
  redirect("/");
}

export async function registrarPerfil(formData: FormData) {
  await requirePortalSession();
  const parsed = perfilSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Datos inválidos");
  await api.patch<Usuario>("/api/v1/usuarios/me", parsed.data);
  redirect("/seleccionar-taller");
}

export async function crearTaller(formData: FormData) {
  await requirePortalSession();
  const parsed = tallerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Datos inválidos");
  const taller = await api.post<Taller>("/api/v1/talleres", parsed.data);
  redirect(`/t/${taller.id}/inicio`);
}

export async function actualizarPerfil(formData: FormData) {
  await requirePortalSession();
  const parsed = perfilSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Datos inválidos");
  if (await getAccessToken()) await api.patch<Usuario>("/api/v1/usuarios/me", parsed.data);
  revalidatePath("/perfil");
}
