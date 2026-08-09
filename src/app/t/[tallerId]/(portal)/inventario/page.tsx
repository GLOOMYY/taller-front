import { InventarioPanel } from "@/components/gestion/inventario-panel";
import { obtenerMovimientosGestion, obtenerRepuestosGestion } from "@/lib/gestion-datos";

export default async function InventarioPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  const repuestos = await obtenerRepuestosGestion(tallerId);
  return <InventarioPanel tallerId={tallerId} initialRepuestos={repuestos} initialMovimientos={await obtenerMovimientosGestion(tallerId, repuestos)} />;
}
