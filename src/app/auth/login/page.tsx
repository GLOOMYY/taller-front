import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { iniciarSesion } from "@/app/actions";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <AuthShell eyebrow="Acceso seguro" title="Vuelve a tu taller" description="Inicia sesión para consultar tus órdenes, clientes e inventario."><form action={iniciarSesion} className="auth-form"><label className="field-label">Nombre de usuario<input className="field" name="nombre_usuario" autoComplete="username" required minLength={3} placeholder="Isabella" /></label><label className="field-label">Contraseña<input className="field" name="password" type="password" autoComplete="current-password" required minLength={8} placeholder="Tu contraseña" /></label><button className="button button-primary" type="submit">Ingresar</button><Link className="button button-secondary" href="/onboarding">Crear una cuenta</Link><Link className="text-center text-xs font-semibold text-[var(--brand)]" href="/t/demo/inicio">Explorar demo sin iniciar sesión</Link></form></AuthShell>;
}
