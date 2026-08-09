import { ConfiguracionPanel } from "@/components/gestion/configuracion-panel";
import { getTaller } from "@/lib/portal";
import { obtenerConfiguracionGestion } from "@/lib/configuracion-datos";

export default async function ConfiguracionPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  const [taller, datos] = await Promise.all([getTaller(tallerId), obtenerConfiguracionGestion(tallerId)]);
  return <ConfiguracionPanel tallerId={tallerId} rolActual={taller.rol_actual} nombreTaller={taller.nombre} paisCodigo={taller.pais_codigo} monedaCodigo={taller.moneda_codigo} initialCatalogos={datos.catalogos} initialMetodos={datos.metodos} initialMiembros={datos.miembros} />;
}
