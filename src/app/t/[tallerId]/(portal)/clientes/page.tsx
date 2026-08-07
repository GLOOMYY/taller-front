import { ClientesPanel } from "@/components/gestion/clientes-panel";

export default async function ClientesPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  return <ClientesPanel tallerId={tallerId} />;
}

