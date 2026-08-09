import { ClientesPanel } from "@/components/gestion/clientes-panel";
import { obtenerClientesGestion } from "@/lib/gestion-datos";

export default async function ClientesPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  const datos = await obtenerClientesGestion(tallerId);
  return <ClientesPanel tallerId={tallerId} initialClientes={datos?.clientes} modelos={datos?.modelos} />;
}
