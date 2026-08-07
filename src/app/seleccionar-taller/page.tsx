import { ArrowRight, Building2, Plus } from "lucide-react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { crearTaller } from "@/app/actions";
import { getTalleres, getUsuario } from "@/lib/portal";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SeleccionarTallerPage() {
  const [usuario, talleres] = await Promise.all([getUsuario(), getTalleres()]);
  if (!usuario) redirect("/onboarding");
  return <AuthShell eyebrow={`Hola, ${usuario.nombre.split(" ")[0]}`} title={talleres.length ? "¿Dónde trabajamos hoy?" : "Crea tu primer taller"} description={talleres.length ? "Cada espacio mantiene clientes, órdenes e inventario por separado." : "Solo necesitamos tres datos para preparar tu espacio operativo."}>{talleres.length > 0 && <div className="workshop-grid">{talleres.map((taller) => <Link key={taller.id} href={`/t/${taller.id}/inicio`} className="workshop-card"><span><Building2 /></span><span><strong>{taller.nombre}</strong><small>{taller.rol_actual === "dueno" ? "Dueña" : "Técnico"} · {taller.moneda_codigo}</small></span><ArrowRight size={18} /></Link>)}</div>}<details className="create-workshop" open={!talleres.length}><summary><Plus size={16} /> {talleres.length ? "Crear otro taller" : "Datos del taller"}</summary><form action={crearTaller} className="auth-form"><label className="field-label">Nombre<input className="field" name="nombre" required minLength={2} placeholder="Ej. Taller Norte" /></label><div className="grid grid-cols-2 gap-3"><label className="field-label">País<select className="field" name="pais_codigo" defaultValue="CO"><option value="CO">Colombia</option><option value="MX">México</option><option value="ES">España</option></select></label><label className="field-label">Moneda<select className="field" name="moneda_codigo" defaultValue="COP"><option>COP</option><option>MXN</option><option>EUR</option><option>USD</option></select></label></div><button className="button button-primary" type="submit">Crear y entrar</button></form></details></AuthShell>;
}
