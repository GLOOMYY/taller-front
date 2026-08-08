import { ClientesPanel } from "@/components/gestion/clientes-panel";
import { obtenerClientesGestion } from "@/lib/gestion-datos";

export default async function ClientesPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  return <ClientesPanel tallerId={tallerId} initialClientes={await obtenerClientesGestion(tallerId)} />;
}
