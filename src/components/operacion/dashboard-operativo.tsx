import Link from "next/link";
import type { ResumenOperativo } from "@/lib/operacion-modelos";
import { ESTADOS_ORDEN } from "@/lib/operacion-modelos";
import { EncabezadoPagina, formatearDinero, Icono } from "./elementos-operacion";
import { TarjetaOrden } from "./tarjeta-orden";

const estilosTarjeta = [
  "bg-teal-950 text-white dark:bg-teal-900",
  "bg-amber-400 text-amber-950 dark:bg-amber-500",
  "bg-white text-stone-950 dark:bg-stone-900 dark:text-white",
];

function TarjetaMetrica({ titulo, valor, nota, icono, estilo = 2 }: { titulo: string; valor: string; nota: string; icono: "orden" | "reloj" | "check" | "dinero"; estilo?: number }) {
  return (
    <article className={`relative min-h-36 overflow-hidden rounded-2xl border border-black/5 p-5 shadow-sm ${estilosTarjeta[estilo]}`}>
      <div className="flex items-start justify-between gap-4">
        <p className={`text-sm font-medium ${estilo === 2 ? "text-stone-500 dark:text-stone-400" : "opacity-75"}`}>{titulo}</p>
        <span className={`grid size-9 place-items-center rounded-xl ${estilo === 2 ? "bg-stone-100 text-teal-700 dark:bg-stone-800 dark:text-teal-300" : "bg-white/15"}`}><Icono nombre={icono} className="size-[18px]" /></span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight tabular-nums">{valor}</p>
      <p className={`mt-1 text-xs ${estilo === 2 ? "text-stone-500 dark:text-stone-400" : "opacity-70"}`}>{nota}</p>
    </article>
  );
}

function GraficaEstados({ datos }: { datos: ResumenOperativo["estados"] }) {
  const maximo = Math.max(...datos.map((item) => item.cantidad), 1);
  return (
    <div className="mt-6 space-y-3" aria-label="Distribución de órdenes por estado">
      {datos.map((item) => (
        <div key={item.estado} className="grid grid-cols-[minmax(7.5rem,1fr)_2fr_2rem] items-center gap-3 text-xs">
          <span className="truncate text-stone-600 dark:text-stone-300">{ESTADOS_ORDEN[item.estado].etiqueta}</span>
          <div className="h-2.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
            <div className="h-full rounded-full bg-teal-700 dark:bg-teal-400" style={{ width: `${Math.max((item.cantidad / maximo) * 100, 4)}%` }} />
          </div>
          <span className="text-right font-semibold tabular-nums text-stone-700 dark:text-stone-200">{item.cantidad}</span>
        </div>
      ))}
    </div>
  );
}

function GraficaPagos({ datos }: { datos: ResumenOperativo["pagosDiarios"] }) {
  const valores = datos.map((item) => Number.parseFloat(item.COP));
  const maximo = Math.max(...valores, 1);
  const puntos = valores.map((valor, indice) => `${(indice / Math.max(valores.length - 1, 1)) * 100},${86 - (valor / maximo) * 70}`).join(" ");
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>Pagos confirmados · COP</span>
        <span>Máx. {formatearDinero({ moneda: "COP", valor: `${maximo}.00` })}</span>
      </div>
      <svg className="mt-3 h-40 w-full overflow-visible" role="img" aria-label="Serie diaria de pagos confirmados en pesos colombianos" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pagos-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0f766e" stopOpacity=".28" />
            <stop offset="1" stopColor="#0f766e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,90 L${puntos.replaceAll(" ", " L")} L100,90 Z`} fill="url(#pagos-gradient)" />
        <polyline points={puntos} fill="none" stroke="currentColor" className="text-teal-700 dark:text-teal-400" strokeWidth="2.25" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        {valores.map((valor, indice) => <circle key={datos[indice].fecha} cx={(indice / Math.max(valores.length - 1, 1)) * 100} cy={86 - (valor / maximo) * 70} r="1.7" className="fill-amber-400 stroke-white dark:stroke-stone-900" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
      </svg>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-stone-400">
        {datos.map((item) => <span key={item.fecha}>{item.fecha}</span>)}
      </div>
    </div>
  );
}

export function DashboardOperativo({ tallerId, resumen }: { tallerId: string; resumen: ResumenOperativo }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <EncabezadoPagina
        ceja="Resumen operativo"
        titulo="Buenos días, Laura"
        descripcion="Esto es lo que está pasando hoy en el taller."
        acciones={<>
          <nav aria-label="Periodo del resumen" className="flex rounded-xl border border-stone-200 bg-white p-1 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            {[7, 30, 90].map((dias) => <Link key={dias} href={`/t/${tallerId}/inicio?periodo=${dias}`} aria-current={resumen.periodoDias === dias ? "page" : undefined} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${resumen.periodoDias === dias ? "bg-teal-950 text-white dark:bg-teal-700" : "text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"}`}>{dias} días</Link>)}
          </nav>
          <Link href={`/t/${tallerId}/ordenes/nueva`} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-amber-950 shadow-sm transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"><Icono nombre="mas" className="size-4" />Nueva orden</Link>
        </>}
      />

      <section aria-label="Métricas principales" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaMetrica titulo="Órdenes abiertas" valor={String(resumen.abiertas)} nota="En atención activa" icono="orden" estilo={0} />
        <TarjetaMetrica titulo="Pendientes de recogida" valor={String(resumen.pendientesRecogida)} nota="Equipos listos para entregar" icono="reloj" estilo={1} />
        <TarjetaMetrica titulo="Entregadas" valor={String(resumen.entregadas)} nota={`Durante los últimos ${resumen.periodoDias} días`} icono="check" />
        <TarjetaMetrica titulo="Saldo pendiente" valor={resumen.saldos[0] ? formatearDinero(resumen.saldos[0]) : "$0 COP"} nota={resumen.saldos.slice(1).map(formatearDinero).join(" · ") || "Sin saldos en otras monedas"} icono="dinero" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.7fr)]">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div><h2 className="font-bold text-stone-950 dark:text-white">Actividad de pagos</h2><p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Importes provistos por el resumen del backend</p></div>
            <span className="rounded-lg bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">{resumen.periodoDias} días</span>
          </div>
          <GraficaPagos datos={resumen.pagosDiarios} />
        </section>
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
          <h2 className="font-bold text-stone-950 dark:text-white">Órdenes por estado</h2>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Distribución actual del trabajo</p>
          <GraficaEstados datos={resumen.estados} />
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-3 flex items-end justify-between"><div><h2 className="font-bold text-stone-950 dark:text-white">En proceso</h2><p className="text-xs text-stone-500 dark:text-stone-400">Órdenes con actividad reciente</p></div><Link href={`/t/${tallerId}/ordenes?grupo=abiertas`} className="text-xs font-bold text-teal-700 hover:underline dark:text-teal-400">Ver todas</Link></div>
          <div className="grid gap-3 sm:grid-cols-2">{resumen.activas.slice(0, 4).map((orden) => <TarjetaOrden key={orden.id} orden={orden} tallerId={tallerId} compacta />)}</div>
        </section>
        <section>
          <div className="mb-3 flex items-end justify-between"><div><h2 className="font-bold text-stone-950 dark:text-white">Cola de recogida</h2><p className="text-xs text-stone-500 dark:text-stone-400">Listas para avisar o entregar</p></div><Link href={`/t/${tallerId}/ordenes?grupo=pendientes`} className="text-xs font-bold text-teal-700 hover:underline dark:text-teal-400">Ver cola</Link></div>
          {resumen.recogida.length ? <div className="grid gap-3 sm:grid-cols-2">{resumen.recogida.map((orden) => <TarjetaOrden key={orden.id} orden={orden} tallerId={tallerId} compacta />)}</div> : <p className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500 dark:border-stone-700">No hay equipos pendientes de recogida.</p>}
        </section>
      </div>
    </div>
  );
}

