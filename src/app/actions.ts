"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api } from "@/lib/api/client";
import type { Taller, Usuario } from "@/lib/api/contracts";
import { auth0Configured } from "@/lib/auth0";
import { requirePortalSession } from "@/lib/portal";

const perfilSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(100),
  nombre_usuario: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/, "Usa letras, números, puntos o guiones"),
});

const tallerSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  pais_codigo: z.string().length(2),
  moneda_codigo: z.string().min(3).max(3),
});

export async function registrarPerfil(formData: FormData) {
  await requirePortalSession();
  const parsed = perfilSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Datos inválidos");
  if (auth0Configured) await api.post<Usuario>("/api/v1/usuarios/me", parsed.data);
  redirect("/seleccionar-taller");
}

export async function crearTaller(formData: FormData) {
  await requirePortalSession();
  const parsed = tallerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Datos inválidos");
  const taller = auth0Configured ? await api.post<Taller>("/api/v1/talleres", parsed.data) : { id: "demo" };
  redirect(`/t/${taller.id}/inicio`);
}

export async function actualizarPerfil(formData: FormData) {
  await requirePortalSession();
  const parsed = perfilSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Datos inválidos");
  if (auth0Configured) await api.patch<Usuario>("/api/v1/usuarios/me", parsed.data);
  revalidatePath("/perfil");
}
