import type { ReactNode } from "react";
import { ESTADOS_ORDEN, type DineroSnapshot, type EstadoOrden } from "@/lib/operacion-modelos";

export function Icono({
  nombre,
  className = "size-5",
}: {
  nombre:
    | "orden"
    | "reloj"
    | "check"
    | "dinero"
    | "buscar"
    | "mas"
    | "flecha"
    | "equipo"
    | "usuario"
    | "archivo"
    | "alerta"
    | "enlace"
    | "pago"
    | "pieza"
    | "servicio"
    | "historial"
    | "editar";
  className?: string;
}) {
  const paths: Record<typeof nombre, ReactNode> = {
    orden: <><path d="M9 5h6"/><path d="M9 9h6"/><path d="M9 13h4"/><path d="M5 3h14v18H5z"/></>,
    reloj: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
    dinero: <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M17 14h.01"/><circle cx="12" cy="12" r="2"/></>,
    buscar: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    mas: <path d="M12 5v14M5 12h14"/>,
    flecha: <path d="m9 18 6-6-6-6"/>,
    equipo: <><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/></>,
    usuario: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    archivo: <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></>,
    alerta: <><path d="m12 3 10 18H2z"/><path d="M12 9v4M12 17h.01"/></>,
    enlace: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1"/></>,
    pago: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></>,
    pieza: <><path d="M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 3-3-1-1-3z"/></>,
    servicio: <><path d="M4 19 15 8"/><path d="m14 4 6 6M3 17l4 4"/><path d="M17 3 21 7"/></>,
    historial: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
    editar: <><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10z"/><path d="m13.5 7 3.5 3.5"/></>,
  };

  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[nombre]}
    </svg>
  );
}

export function formatearDinero(dinero: DineroSnapshot) {
  const negativo = dinero.valor.startsWith("-");
  const limpio = dinero.valor.replace("-", "");
  const [entero, decimales = "00"] = limpio.split(".");
  const agrupado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const simbolo = dinero.moneda === "COP" ? "$" : "US$";
  const centavos = decimales.slice(0, 2) === "00" ? "" : `,${decimales.slice(0, 2)}`;
  return `${negativo ? "−" : ""}${simbolo}${agrupado}${centavos} ${dinero.moneda}`;
}

const tonos = {
  azul: "bg-sky-50 text-sky-700 ring-sky-600/15 dark:bg-sky-500/10 dark:text-sky-300",
  ambar: "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300",
  verde: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300",
  gris: "bg-stone-100 text-stone-600 ring-stone-500/15 dark:bg-white/5 dark:text-stone-300",
  rojo: "bg-red-50 text-red-700 ring-red-600/15 dark:bg-red-500/10 dark:text-red-300",
};

export function EstadoBadge({ estado }: { estado: EstadoOrden }) {
  const config = ESTADOS_ORDEN[estado];
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tonos[config.tono]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {config.etiqueta}
    </span>
  );
}

export function EncabezadoPagina({
  ceja,
  titulo,
  descripcion,
  acciones,
}: {
  ceja?: string;
  titulo: string;
  descripcion: string;
  acciones?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {ceja && <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">{ceja}</p>}
        <h1 className="text-2xl font-bold tracking-tight text-stone-950 dark:text-stone-50 sm:text-3xl">{titulo}</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-stone-600 dark:text-stone-400">{descripcion}</p>
      </div>
      {acciones && <div className="flex shrink-0 flex-wrap items-center gap-2">{acciones}</div>}
    </header>
  );
}

export function Vacio({ titulo, descripcion, accion }: { titulo: string; descripcion: string; accion?: ReactNode }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/50 p-8 text-center dark:border-stone-700 dark:bg-stone-900/40">
      <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-300"><Icono nombre="orden" /></span>
      <h2 className="font-semibold text-stone-900 dark:text-white">{titulo}</h2>
      <p className="mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">{descripcion}</p>
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  );
}

