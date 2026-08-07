import Link from "next/link";
import { Link2Off } from "lucide-react";

export default function TrackingNotFound() { return <main className="tracking-page"><div className="empty-state"><span><Link2Off /></span><h1>Este enlace ya no está disponible</h1><p>Puede haber vencido, sido reemplazado o estar incompleto. Solicita un enlace nuevo directamente al taller.</p><Link className="button button-secondary" href="/">Ir al inicio</Link></div></main>; }
