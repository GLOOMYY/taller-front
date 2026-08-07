"use client";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="empty-state"><span><AlertTriangle /></span><h2>No pudimos cargar esta sección</h2><p>Revisa tu conexión e inténtalo nuevamente. Tu información está segura.</p><button className="button button-primary" onClick={reset}>Volver a intentar</button></div>;
}
