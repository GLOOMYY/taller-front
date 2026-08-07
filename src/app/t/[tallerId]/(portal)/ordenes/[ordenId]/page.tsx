import { notFound } from "next/navigation";
import { DetalleOrden } from "@/components/operacion/detalle-orden";
import { obtenerOrden } from "@/lib/operacion-datos";

export default async function DetalleOrdenPage({ params }: { params: Promise<{ tallerId: string; ordenId: string }> }) {
  const { tallerId, ordenId } = await params;
  const orden = await obtenerOrden(tallerId, ordenId);
  if (!orden) notFound();
  return <DetalleOrden orden={orden} tallerId={tallerId} />;
}
