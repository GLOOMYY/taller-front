import { DashboardOperativo } from "@/components/operacion/dashboard-operativo";
import { obtenerResumenOperativo } from "@/lib/operacion-datos";

export default async function InicioTallerPage({ params, searchParams }: { params: Promise<{ tallerId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ tallerId }, query] = await Promise.all([params, searchParams]);
  const periodoSolicitado = Number(query.periodo);
  const periodo = [7, 30, 90].includes(periodoSolicitado) ? periodoSolicitado : 30;
  const resumen = await obtenerResumenOperativo(tallerId, periodo);
  return <DashboardOperativo tallerId={tallerId} resumen={resumen} />;
}
