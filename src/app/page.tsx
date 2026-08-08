import { ArrowRight, CheckCircle2, ClipboardCheck, PackageCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { getAccessToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (await getAccessToken()) redirect("/seleccionar-taller");

  return (
    <main className="landing-shell">
      <nav className="landing-nav" aria-label="Navegación principal">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeSwitcher compact />
          <a className="button button-secondary hidden sm:inline-flex" href="/auth/login">Ingresar</a>
        </div>
      </nav>
      <section className="landing-hero">
        <div className="max-w-2xl">
          <span className="eyebrow"><span className="status-dot" /> Operación simple para talleres ágiles</span>
          <h1>Tu taller, en orden.<br /><span>Tu equipo, en movimiento.</span></h1>
          <p>Controla cada orden, repuesto y pago sin perder el hilo. Tus técnicos avanzan; tus clientes saben qué está pasando.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="button button-primary" href="/auth/login?screen_hint=signup">Crear mi taller <ArrowRight size={17} /></a>
            <Link className="button button-secondary" href="/t/demo/inicio">Explorar demo</Link>
          </div>
          <div className="landing-trust"><ShieldCheck size={16} /> Sesión segura · datos separados por taller · sin tarjetas para empezar</div>
        </div>
        <div className="hero-board" aria-label="Vista previa del portal">
          <div className="hero-board-head"><div><span>Hoy en el taller</span><strong>Todo bajo control</strong></div><span className="badge badge-success">En línea</span></div>
          <div className="hero-metrics">
            <div><ClipboardCheck /><small>Órdenes activas</small><strong>12</strong><span>3 listas para recoger</span></div>
            <div><PackageCheck /><small>Stock por revisar</small><strong>4</strong><span>Repuestos bajo mínimo</span></div>
          </div>
          <div className="hero-list">
            {[
              ["OT-0248", "iPhone 13 · Cambio de pantalla", "En reparación"],
              ["OT-0247", "Lenovo ThinkPad · No enciende", "Diagnóstico"],
              ["OT-0245", "Samsung A54 · Puerto de carga", "Listo"],
            ].map(([code, label, status], index) => (
              <div key={code}><span className="hero-index">{index + 1}</span><span><strong>{code}</strong><small>{label}</small></span><em>{status}</em></div>
            ))}
          </div>
          <div className="hero-progress"><span><CheckCircle2 size={15} /> 8 de 12 órdenes avanzaron hoy</span><b><i /></b></div>
        </div>
      </section>
      <section className="landing-features" aria-label="Beneficios">
        <article><span>01</span><h2>Una orden, toda la historia</h2><p>Diagnóstico, servicios, repuestos, pagos y comunicación sin saltar entre herramientas.</p></article>
        <article><span>02</span><h2>Decisiones con datos reales</h2><p>Saldo, carga operativa y movimiento del día calculados por tu sistema, no por hojas sueltas.</p></article>
        <article><span>03</span><h2>Clientes bien informados</h2><p>Seguimiento público seguro, con la información justa y comprobante al finalizar.</p></article>
      </section>
    </main>
  );
}
