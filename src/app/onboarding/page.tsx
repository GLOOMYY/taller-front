import { AuthShell } from "@/components/auth/auth-shell";
import { registrarCuenta } from "@/app/actions";

export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  return <AuthShell eyebrow="Crear cuenta" title="Hagamos que el portal sea tuyo" description="Crea tu acceso y luego configuraremos tu primer taller."><form action={registrarCuenta} className="auth-form"><label className="field-label">Nombre completo<input className="field" name="nombre" autoComplete="name" required minLength={2} placeholder="Ej. Isabella López" /></label><label className="field-label">Nombre de usuario<input className="field" name="nombre_usuario" autoComplete="username" required minLength={3} pattern="[a-zA-Z0-9._-]+" placeholder="Isabella" /></label><label className="field-label">Contraseña<input className="field" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="Mínimo 8 caracteres" /></label><button className="button button-primary" type="submit">Crear cuenta</button></form></AuthShell>;
}
