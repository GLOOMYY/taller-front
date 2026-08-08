import { DashboardOperativo } from "@/components/operacion/dashboard-operativo";
import { obtenerResumenOperativo } from "@/lib/operacion-datos";
import { getUsuario } from "@/lib/portal";

export default async function InicioTallerPage({ params, searchParams }: { params: Promise<{ tallerId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ tallerId }, query] = await Promise.all([params, searchParams]);
  const periodoSolicitado = Number(query.periodo);
  const periodo = [7, 30, 90].includes(periodoSolicitado) ? periodoSolicitado : 30;
  const [resumen, usuario] = await Promise.all([
    obtenerResumenOperativo(tallerId, periodo),
    getUsuario(),
  ]);
  return <DashboardOperativo tallerId={tallerId} resumen={resumen} nombreUsuario={usuario?.nombre ?? "tu taller"} />;
}
