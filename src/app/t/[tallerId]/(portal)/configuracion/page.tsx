import { ConfiguracionPanel } from "@/components/gestion/configuracion-panel";
import { getTaller } from "@/lib/portal";

export default async function ConfiguracionPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  const taller = await getTaller(tallerId);
  return <ConfiguracionPanel tallerId={tallerId} rolActual={taller.rol_actual} />;
}
