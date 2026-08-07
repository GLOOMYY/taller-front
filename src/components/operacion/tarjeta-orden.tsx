import Link from "next/link";
import type { OrdenResumen } from "@/lib/operacion-modelos";
import { EstadoBadge, formatearDinero, Icono } from "./elementos-operacion";

export function TarjetaOrden({ orden, tallerId, compacta = false }: { orden: OrdenResumen; tallerId: string; compacta?: boolean }) {
  return (
    <Link
      href={`/t/${tallerId}/ordenes/${orden.id}`}
      className="group block rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-teal-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-wide text-teal-700 dark:text-teal-400">{orden.numero}</p>
          <h3 className="mt-1 font-semibold text-stone-950 dark:text-white">{orden.equipo}</h3>
          <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{orden.cliente}</p>
        </div>
        <Icono nombre="flecha" className="mt-1 size-4 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-teal-600" />
      </div>
      {!compacta && <p className="mt-3 line-clamp-2 text-sm text-stone-600 dark:text-stone-300">{orden.falla}</p>}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <EstadoBadge estado={orden.estado} />
        <div className="text-right">
          <p className="text-xs text-stone-400">Saldo</p>
          <p className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-100">{formatearDinero(orden.saldo)}</p>
        </div>
      </div>
    </Link>
  );
}

