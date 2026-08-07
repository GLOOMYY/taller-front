"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EstadoOrden, OrdenResumen } from "@/lib/operacion-modelos";
import { EstadoBadge, formatearDinero, Icono, Vacio } from "./elementos-operacion";
import { TarjetaOrden } from "./tarjeta-orden";

type Grupo = "abiertas" | "pendientes" | "entregadas" | "todas";

const grupos: Array<{ id: Grupo; etiqueta: string }> = [
  { id: "abiertas", etiqueta: "Abiertas" },
  { id: "pendientes", etiqueta: "Pendientes" },
  { id: "entregadas", etiqueta: "Entregadas" },
  { id: "todas", etiqueta: "Todas" },
];

function pertenece(estado: EstadoOrden, grupo: Grupo) {
  if (grupo === "todas") return true;
  if (grupo === "pendientes") return estado === "listo";
  if (grupo === "entregadas") return estado === "entregado";
  return !["listo", "entregado", "cancelado"].includes(estado);
}

export function ListadoOrdenes({ ordenes, tallerId, grupoInicial = "abiertas" }: { ordenes: OrdenResumen[]; tallerId: string; grupoInicial?: Grupo }) {
  const [grupo, setGrupo] = useState<Grupo>(grupoInicial);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<EstadoOrden | "">("");
  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase("es");
    return ordenes.filter((orden) => {
      const coincideGrupo = pertenece(orden.estado, grupo);
      const coincideEstado = !estado || orden.estado === estado;
      const coincideTexto = !texto || [orden.numero, orden.cliente, orden.equipo, orden.falla].some((valor) => valor.toLocaleLowerCase("es").includes(texto));
      return coincideGrupo && coincideEstado && coincideTexto;
    });
  }, [busqueda, estado, grupo, ordenes]);

  return (
    <>
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-4">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Grupos de órdenes">
          {grupos.map((item) => {
            const cantidad = ordenes.filter((orden) => pertenece(orden.estado, item.id)).length;
            return <button key={item.id} type="button" role="tab" aria-selected={grupo === item.id} onClick={() => setGrupo(item.id)} className={`flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-teal-600 ${grupo === item.id ? "bg-teal-950 text-white dark:bg-teal-700" : "text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"}`}>{item.etiqueta}<span className={`rounded-md px-1.5 py-0.5 text-[10px] ${grupo === item.id ? "bg-white/15" : "bg-stone-100 dark:bg-stone-800"}`}>{cantidad}</span></button>;
          })}
        </div>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_14rem]">
          <label className="relative block">
            <span className="sr-only">Buscar órdenes</span>
            <Icono nombre="buscar" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} type="search" placeholder="Buscar por orden, cliente, equipo o falla…" className="min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 dark:border-stone-700 dark:bg-stone-950 dark:text-white" />
          </label>
          <label>
            <span className="sr-only">Filtrar por estado</span>
            <select value={estado} onChange={(event) => setEstado(event.target.value as EstadoOrden | "")} className="min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200">
              <option value="">Todos los estados</option>
              <option value="recibido">Recibida</option><option value="diagnostico">En diagnóstico</option><option value="esperando_aprobacion">Esperando aprobación</option><option value="en_reparacion">En reparación</option><option value="listo">Lista para recoger</option><option value="entregado">Entregada</option><option value="cancelado">Cancelada</option>
            </select>
          </label>
        </div>
      </div>

      {filtradas.length ? <>
        <div className="grid gap-3 sm:grid-cols-2 lg:hidden">{filtradas.map((orden) => <TarjetaOrden key={orden.id} orden={orden} tallerId={tallerId} />)}</div>
        <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900 lg:block">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-400"><tr><th className="w-[13%] px-5 py-3">Orden</th><th className="w-[24%] px-5 py-3">Cliente y equipo</th><th className="w-[23%] px-5 py-3">Falla reportada</th><th className="w-[17%] px-5 py-3">Estado</th><th className="w-[15%] px-5 py-3 text-right">Saldo</th><th className="w-[8%] px-5 py-3"><span className="sr-only">Abrir</span></th></tr></thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtradas.map((orden) => <tr key={orden.id} className="group transition hover:bg-stone-50 dark:hover:bg-stone-800/50"><td className="px-5 py-4 align-top"><Link href={`/t/${tallerId}/ordenes/${orden.id}`} className="font-bold text-teal-700 hover:underline dark:text-teal-400">{orden.numero}</Link><p className="mt-1 text-xs text-stone-400">{orden.actualizada}</p></td><td className="px-5 py-4 align-top"><p className="font-semibold text-stone-900 dark:text-white">{orden.cliente}</p><p className="mt-1 truncate text-xs text-stone-500 dark:text-stone-400">{orden.equipo} · {orden.referenciaEquipo}</p></td><td className="px-5 py-4 align-top"><p className="line-clamp-2 text-stone-600 dark:text-stone-300">{orden.falla}</p></td><td className="px-5 py-4 align-top"><EstadoBadge estado={orden.estado} /></td><td className="px-5 py-4 text-right align-top font-bold tabular-nums text-stone-900 dark:text-stone-100">{formatearDinero(orden.saldo)}</td><td className="px-5 py-4 text-right align-top"><Link href={`/t/${tallerId}/ordenes/${orden.id}`} aria-label={`Abrir ${orden.numero}`} className="inline-grid size-8 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-teal-700 dark:hover:bg-stone-700"><Icono nombre="flecha" className="size-4" /></Link></td></tr>)}
            </tbody>
          </table>
        </div>
      </> : <Vacio titulo="No encontramos órdenes" descripcion="Prueba con otro término o cambia los filtros. También puedes registrar una nueva orden." accion={<Link href={`/t/${tallerId}/ordenes/nueva`} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-400 px-4 text-sm font-bold text-amber-950"><Icono nombre="mas" className="size-4" />Crear nueva orden</Link>} />}
    </>
  );
}

