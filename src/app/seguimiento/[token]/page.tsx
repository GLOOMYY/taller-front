import type { Metadata } from "next";
import { Check, CircleDot, Clock3, Download, MapPin, Package, ShieldCheck, Smartphone, Wrench } from "lucide-react";
import { notFound } from "next/navigation";
import { getApiUrl } from "@/lib/api/config";
import type { OrdenPublica } from "@/lib/api/contracts";
import { apiFetch } from "@/lib/api/client";
import { formatDecimalMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Seguimiento de reparación", robots: { index: false, follow: false } };

const demo: OrdenPublica = {
  taller_nombre: "Taller Norte", numero: "OT-0248", estado: "en_reparacion",
  equipo: { tipo: "Teléfono", marca: "Apple", modelo: "iPhone 13" },
  falla_reportada: "La pantalla no responde al tacto y presenta una línea verde.",
  diagnostico: "Módulo de pantalla dañado. Los demás componentes funcionan correctamente.",
  trabajo_realizado: "Desmontaje y limpieza interna. Repuesto verificado antes de instalar.",
  servicios: [{ nombre: "Diagnóstico técnico", cantidad: "1" }, { nombre: "Cambio de módulo de pantalla", cantidad: "1" }],
  repuestos: [{ nombre: "Módulo de pantalla compatible", cantidad: "1" }],
  historial: [
    { fecha: "2026-08-07T14:10:00Z", descripcion: "Reparación en curso" },
    { fecha: "2026-08-06T18:30:00Z", descripcion: "Presupuesto aprobado" },
    { fecha: "2026-08-06T15:00:00Z", descripcion: "Diagnóstico completado" },
    { fecha: "2026-08-05T20:20:00Z", descripcion: "Equipo recibido" },
  ], total: "420000.00", moneda_codigo: "COP", entregado_en: null,
};

const estadoInfo: Record<string, { label: string; step: number; message: string }> = {
  recibido: { label: "Equipo recibido", step: 1, message: "Tu equipo está registrado y pronto iniciará el diagnóstico." },
  diagnostico: { label: "En diagnóstico", step: 2, message: "Estamos revisando tu equipo para encontrar la mejor solución." },
  esperando_aprobacion: { label: "Esperando tu aprobación", step: 2, message: "El diagnóstico está listo. Comunícate con el taller para aprobar el trabajo." },
  en_reparacion: { label: "En reparación", step: 3, message: "Estamos trabajando en tu equipo. Te avisaremos cuando esté listo." },
  listo_para_recoger: { label: "Listo para recoger", step: 4, message: "¡Buenas noticias! Tu equipo está listo. Coordina la recogida con el taller." },
  entregado: { label: "Entregado", step: 5, message: "El trabajo terminó y tu equipo fue entregado." },
  garantia: { label: "Revisión por garantía", step: 2, message: "Tu equipo volvió al taller y está siendo revisado por garantía." },
  cancelado: { label: "Orden cancelada", step: 0, message: "Esta orden fue cancelada. Contacta al taller si necesitas más información." },
};

async function obtenerOrden(token: string) {
  if (token === "demo") return demo;
  try { return await apiFetch<OrdenPublica>(`/api/v1/publico/seguimiento/${encodeURIComponent(token)}`, { public: true }); }
  catch { notFound(); }
}

export default async function TrackingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const orden = await obtenerOrden(token);
  const info = estadoInfo[orden.estado] ?? { label: orden.estado, step: 1, message: "Consulta los avances de tu equipo." };
  const pdfUrl = `${getApiUrl()}/api/v1/publico/seguimiento/${encodeURIComponent(token)}/comprobante.pdf`;

  return <main className="tracking-page"><header className="tracking-header"><span className="tracking-logo"><Wrench size={18} /></span><span><strong>{orden.taller_nombre}</strong><small>Seguimiento de servicio</small></span><span className="secure-label"><ShieldCheck size={14} /> Enlace seguro</span></header><section className="tracking-hero"><span className="tracking-code">Orden {orden.numero}</span><h1>{info.label}</h1><p>{info.message}</p><div className="tracking-steps" aria-label={`Paso ${info.step} de 5`}>{["Recibido", "Diagnóstico", "Reparación", "Listo", "Entregado"].map((label, index) => <div key={label} data-complete={index + 1 <= info.step}><span>{index + 1 < info.step ? <Check size={14} /> : index + 1}</span><small>{label}</small></div>)}</div></section><div className="tracking-grid"><section className="panel tracking-device"><div className="section-title"><Smartphone size={18} /><span><small>Tu equipo</small><h2>{orden.equipo.marca} {orden.equipo.modelo}</h2></span></div><dl><div><dt>Tipo</dt><dd>{orden.equipo.tipo}</dd></div><div><dt>Falla reportada</dt><dd>{orden.falla_reportada}</dd></div>{orden.diagnostico && <div><dt>Diagnóstico</dt><dd>{orden.diagnostico}</dd></div>}{orden.trabajo_realizado && <div><dt>Trabajo realizado</dt><dd>{orden.trabajo_realizado}</dd></div>}</dl></section><section className="panel tracking-work"><div className="section-title"><Package size={18} /><span><small>Detalle del trabajo</small><h2>Servicios y repuestos</h2></span></div><div className="public-lines">{[...orden.servicios.map((x) => ({...x, type: "Servicio"})), ...orden.repuestos.map((x) => ({...x, type: "Repuesto"}))].map((item, index) => <div key={`${item.type}-${index}`}><span><small>{item.type}</small><strong>{item.nombre}</strong></span><em>x{item.cantidad}</em></div>)}</div><div className="tracking-total"><span>Total final<small>Valor total de la orden</small></span><strong>{formatDecimalMoney(orden.total, orden.moneda_codigo)}</strong></div>{orden.estado === "entregado" && <a className="button button-primary w-full" href={pdfUrl}><Download size={16} /> Descargar comprobante PDF</a>}</section><section className="panel tracking-history"><div className="section-title"><Clock3 size={18} /><span><small>Actualizaciones</small><h2>Historia de la orden</h2></span></div><ol>{orden.historial.map((event, index) => <li key={`${event.fecha}-${index}`}><span><CircleDot size={15} /></span><div><strong>{event.descripcion}</strong><time dateTime={event.fecha}>{new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.fecha))}</time></div></li>)}</ol></section><aside className="tracking-help"><MapPin size={18} /><span><strong>¿Tienes una pregunta?</strong><small>Comunícate directamente con {orden.taller_nombre}. Este enlace solo muestra el avance de tu orden.</small></span></aside></div></main>;
}
