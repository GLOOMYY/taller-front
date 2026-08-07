import Link from "next/link";
import { EncabezadoPagina, Icono } from "@/components/operacion/elementos-operacion";
import { ListadoOrdenes } from "@/components/operacion/listado-ordenes";
import { listarOrdenes } from "@/lib/operacion-datos";

type Grupo = "abiertas" | "pendientes" | "entregadas" | "todas";

export default async function OrdenesPage({ params, searchParams }: { params: Promise<{ tallerId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ tallerId }, query] = await Promise.all([params, searchParams]);
  const ordenes = await listarOrdenes(tallerId);
  const solicitado = typeof query.grupo === "string" ? query.grupo : "abiertas";
  const grupoInicial: Grupo = ["abiertas", "pendientes", "entregadas", "todas"].includes(solicitado) ? solicitado as Grupo : "abiertas";
  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <EncabezadoPagina ceja="Operación" titulo="Órdenes de trabajo" descripcion="Consulta el avance de cada equipo y mantén el trabajo del taller en movimiento." acciones={<Link href={`/t/${tallerId}/ordenes/nueva`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-4 text-sm font-bold text-amber-950 shadow-sm transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"><Icono nombre="mas" className="size-4" />Nueva orden</Link>} />
      <ListadoOrdenes ordenes={ordenes} tallerId={tallerId} grupoInicial={grupoInicial} />
    </div>
  );
}
