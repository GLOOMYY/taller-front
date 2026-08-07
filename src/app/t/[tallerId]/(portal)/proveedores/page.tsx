import { ProveedoresPanel } from "@/components/gestion/proveedores-panel";

export default async function ProveedoresPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  return <ProveedoresPanel tallerId={tallerId} />;
}

