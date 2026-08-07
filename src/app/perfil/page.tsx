import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { actualizarPerfil } from "@/app/actions";
import { getUsuario } from "@/lib/portal";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const usuario = await getUsuario();
  return <AuthShell eyebrow="Cuenta" title="Tu perfil" description="Esta información se muestra dentro de los talleres a los que perteneces."><form action={actualizarPerfil} className="auth-form"><label className="field-label">Nombre completo<input className="field" name="nombre" defaultValue={usuario?.nombre ?? ""} required /></label><label className="field-label">Nombre de usuario<input className="field" name="nombre_usuario" defaultValue={usuario?.nombre_usuario ?? ""} required /></label><button className="button button-primary" type="submit">Guardar cambios</button><Link className="button button-secondary" href="/seleccionar-taller"><ArrowLeft size={16} /> Volver a mis talleres</Link></form></AuthShell>;
}
