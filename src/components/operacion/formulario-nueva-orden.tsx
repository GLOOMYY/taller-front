"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icono } from "./elementos-operacion";

const campo = "min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 dark:border-stone-700 dark:bg-stone-950 dark:text-white";

export function FormularioNuevaOrden({ tallerId }: { tallerId: string }) {
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState(false);
  const [guardada, setGuardada] = useState(false);

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGuardada(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (guardada) return (
    <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-600 text-white"><Icono nombre="check" className="size-7" /></span>
      <h2 className="mt-4 text-xl font-bold text-emerald-950 dark:text-emerald-100">Orden preparada correctamente</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-emerald-800 dark:text-emerald-300">La interfaz está lista para conectar esta acción al contrato de creación del backend.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2"><button type="button" onClick={() => setGuardada(false)} className="min-h-10 rounded-xl border border-emerald-300 px-4 text-sm font-bold text-emerald-900 dark:border-emerald-800 dark:text-emerald-200">Crear otra</button><Link href={`/t/${tallerId}/ordenes`} className="inline-flex min-h-10 items-center rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white">Volver a órdenes</Link></div>
    </div>
  );

  return (
    <form onSubmit={enviar} className="space-y-5">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Paso 1</p><h2 className="mt-1 text-lg font-bold text-stone-950 dark:text-white">Cliente</h2><p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Selecciona un cliente existente o regístralo sin salir de la orden.</p></div><Icono nombre="usuario" className="size-6 text-stone-400" /></div>
        {!nuevoCliente ? <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"><label><span className="mb-1.5 block text-xs font-semibold text-stone-600 dark:text-stone-300">Cliente *</span><select required className={campo} defaultValue=""><option value="" disabled>Buscar o seleccionar cliente…</option><option value="Isabella">Isabella Gómez · 310 555 0147</option><option value="carlos">Carlos Ruiz · 300 445 8812</option><option value="lucia">Lucía Fernández · 315 823 0931</option></select></label><button type="button" onClick={() => setNuevoCliente(true)} className="mt-auto min-h-11 rounded-xl border border-stone-200 px-4 text-sm font-bold text-teal-700 hover:bg-teal-50 dark:border-stone-700 dark:text-teal-400 dark:hover:bg-teal-950">+ Nuevo cliente</button></div> : <div className="mt-5 rounded-xl bg-stone-50 p-4 dark:bg-stone-950"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold text-stone-800 dark:text-stone-200">Nuevo cliente</p><button type="button" onClick={() => setNuevoCliente(false)} className="text-xs font-semibold text-stone-500 hover:underline">Usar existente</button></div><div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold">Nombre completo *</span><input required className={campo} placeholder="Ej. Ana Martínez" /></label><label><span className="mb-1.5 block text-xs font-semibold">Teléfono *</span><input required inputMode="tel" className={campo} placeholder="300 000 0000" /></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold">Correo electrónico</span><input type="email" className={campo} placeholder="ana@ejemplo.com" /></label></div></div>}
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Paso 2</p><h2 className="mt-1 text-lg font-bold text-stone-950 dark:text-white">Equipo</h2><p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Identifica el dispositivo y lo que el cliente entrega.</p></div><Icono nombre="equipo" className="size-6 text-stone-400" /></div>
        {!nuevoEquipo ? <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"><label><span className="mb-1.5 block text-xs font-semibold text-stone-600 dark:text-stone-300">Equipo *</span><select required className={campo} defaultValue=""><option value="" disabled>Seleccionar equipo del cliente…</option><option value="iphone">iPhone 14 Pro · DNPQ72L9K7</option><option value="ipad">iPad Air · G6TY2201</option></select></label><button type="button" onClick={() => setNuevoEquipo(true)} className="mt-auto min-h-11 rounded-xl border border-stone-200 px-4 text-sm font-bold text-teal-700 hover:bg-teal-50 dark:border-stone-700 dark:text-teal-400 dark:hover:bg-teal-950">+ Nuevo equipo</button></div> : <div className="mt-5 rounded-xl bg-stone-50 p-4 dark:bg-stone-950"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold text-stone-800 dark:text-stone-200">Nuevo equipo</p><button type="button" onClick={() => setNuevoEquipo(false)} className="text-xs font-semibold text-stone-500 hover:underline">Usar existente</button></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label><span className="mb-1.5 block text-xs font-semibold">Tipo *</span><select required className={campo} defaultValue=""><option value="" disabled>Seleccionar</option><option>Celular</option><option>Portátil</option><option>Tableta</option></select></label><label><span className="mb-1.5 block text-xs font-semibold">Marca *</span><input required className={campo} placeholder="Ej. Apple" /></label><label><span className="mb-1.5 block text-xs font-semibold">Modelo *</span><input required className={campo} placeholder="Ej. iPhone 15" /></label><label><span className="mb-1.5 block text-xs font-semibold">Serial / IMEI</span><input className={campo} placeholder="Opcional" /></label></div></div>}
        <div className="mt-4 grid gap-3 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold text-stone-600 dark:text-stone-300">Falla reportada *</span><textarea required rows={4} className={`${campo} resize-y py-3`} placeholder="Describe con las palabras del cliente…" /></label><label><span className="mb-1.5 block text-xs font-semibold text-stone-600 dark:text-stone-300">Accesorios y estado de ingreso</span><textarea rows={4} className={`${campo} resize-y py-3`} placeholder="Cargador, funda, golpes, rayones…" /></label></div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Paso 3</p><h2 className="mt-1 text-lg font-bold text-stone-950 dark:text-white">Recepción</h2><p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Define responsable, prioridad y observaciones internas.</p></div><Icono nombre="archivo" className="size-6 text-stone-400" /></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold">Técnico responsable</span><select className={campo}><option>Sin asignar</option><option>Daniel Torres</option><option>Isabella G</option></select></label><label><span className="mb-1.5 block text-xs font-semibold">Prioridad</span><select className={campo}><option>Normal</option><option>Alta</option><option>Urgente</option></select></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold">Nota interna</span><textarea rows={3} className={`${campo} resize-y py-3`} placeholder="Solo visible para el equipo del taller…" /></label></div>
      </section>
      <div className="sticky bottom-3 flex items-center justify-end gap-2 rounded-2xl border border-stone-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-stone-700 dark:bg-stone-900/95"><Link href={`/t/${tallerId}/ordenes`} className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">Cancelar</Link><button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-5 text-sm font-bold text-amber-950 shadow-sm hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"><Icono nombre="check" className="size-4" />Crear orden</button></div>
    </form>
  );
}

