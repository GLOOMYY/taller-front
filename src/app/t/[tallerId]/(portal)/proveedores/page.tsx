import { ProveedoresPanel } from "@/components/gestion/proveedores-panel";
import { obtenerProveedoresGestion } from "@/lib/gestion-datos";

export default async function ProveedoresPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  return <ProveedoresPanel tallerId={tallerId} initialProveedores={await obtenerProveedoresGestion(tallerId)} />;
}
