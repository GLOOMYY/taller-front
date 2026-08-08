import { InventarioPanel } from "@/components/gestion/inventario-panel";
import { obtenerRepuestosGestion } from "@/lib/gestion-datos";

export default async function InventarioPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  return <InventarioPanel tallerId={tallerId} initialRepuestos={await obtenerRepuestosGestion(tallerId)} />;
}
