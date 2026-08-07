import { AuthShell } from "@/components/auth/auth-shell";
import { registrarPerfil } from "@/app/actions";

export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  return <AuthShell eyebrow="Primer paso" title="Hagamos que el portal sea tuyo" description="Cuéntanos cómo quieres aparecer ante tu equipo. Podrás cambiarlo después."><form action={registrarPerfil} className="auth-form"><label className="field-label">Nombre completo<input className="field" name="nombre" autoComplete="name" required minLength={2} placeholder="Ej. Mariana López" /></label><label className="field-label">Nombre de usuario<input className="field" name="nombre_usuario" autoComplete="username" required minLength={3} pattern="[a-zA-Z0-9._-]+" placeholder="mariana" /></label><button className="button button-primary" type="submit">Continuar</button></form></AuthShell>;
}
