"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Cliente, Dispositivo, ModeloOpcion, OrdenBreve } from "./types";
import { EmptyState, Icon, Modal, PageHeading, Panel, PrimaryButton, SearchField, SecondaryButton, fieldClass, labelClass } from "./ui";
import { crearClienteReal, crearDispositivoReal, editarDispositivoReal } from "@/app/gestion-actions";

const clientesIniciales: Cliente[] = [
  { id: "cli-1", nombre: "Isabella Ríos", documento: "1032456789", telefono: "+57 301 555 0184", correo: "Isabella.rios@email.com", activo: true, ordenes: 4, ultimaVisita: "5 ago 2026", equipos: [{ id: "eq-1", tipo: "Celular", marca: "Apple", modelo: "iPhone 14", serie: "F2LX92K1", alias: "Personal" }, { id: "eq-2", tipo: "Portátil", marca: "Lenovo", modelo: "ThinkPad E14", serie: "PF4K91D2" }] },
  { id: "cli-2", nombre: "Carlos Mendoza", documento: "80123456", telefono: "+57 315 210 9901", correo: "c.mendoza@email.com", activo: true, ordenes: 2, ultimaVisita: "31 jul 2026", equipos: [{ id: "eq-3", tipo: "Tablet", marca: "Samsung", modelo: "Galaxy Tab S9", serie: "R52W30" }] },
  { id: "cli-3", nombre: "Inversiones Salazar SAS", documento: "901482003-1", telefono: "+57 601 742 1180", correo: "soporte@salazar.co", activo: true, ordenes: 8, ultimaVisita: "28 jul 2026", equipos: [{ id: "eq-4", tipo: "Portátil", marca: "Dell", modelo: "Latitude 5440", alias: "Administración" }] },
  { id: "cli-4", nombre: "Isabella Peña", telefono: "+57 310 904 7712", activo: false, ordenes: 1, ultimaVisita: "12 mar 2026", equipos: [] },
];

const historial: OrdenBreve[] = [
  { id: "ord-1", numero: "OT-1048", dispositivo: "iPhone 14", estado: "reparacion", fecha: "5 ago 2026" },
  { id: "ord-2", numero: "OT-0982", dispositivo: "ThinkPad E14", estado: "entregado", fecha: "18 jun 2026" },
  { id: "ord-3", numero: "OT-0911", dispositivo: "iPhone 14", estado: "entregado", fecha: "2 abr 2026" },
];

const estadoLabel: Record<OrdenBreve["estado"], string> = { recibido: "Recibida", diagnostico: "Diagnóstico", reparacion: "En reparación", listo: "Lista para recoger", entregado: "Entregada" };

export function ClientesPanel({ tallerId, initialClientes = clientesIniciales, modelos = [] }: { tallerId: string; initialClientes?: Cliente[]; modelos?: ModeloOpcion[] }) {
  const [clientes, setClientes] = useState(initialClientes);
  const [consulta, setConsulta] = useState("");
  const [soloActivos, setSoloActivos] = useState(true);
  const [seleccionadoId, setSeleccionadoId] = useState(initialClientes[0]?.id ?? "");
  const [modal, setModal] = useState<"cliente" | "equipo" | null>(null);
  const [equipoEditando, setEquipoEditando] = useState<Dispositivo | null>(null);
  const [aviso, setAviso] = useState("");

  const filtrados = useMemo(() => clientes.filter((cliente) => {
    const texto = `${cliente.nombre} ${cliente.documento ?? ""} ${cliente.telefono} ${cliente.correo ?? ""}`.toLowerCase();
    return texto.includes(consulta.toLowerCase()) && (!soloActivos || cliente.activo);
  }), [clientes, consulta, soloActivos]);
  const seleccionado = clientes.find((cliente) => cliente.id === seleccionadoId);
  const historialVisible = tallerId === "demo" ? historial : [];
  const modelosFormulario = modelos.length ? modelos : [{ id: "demo-modelo", nombre: "Equipo", marca: "Genérica", tipo: "Otro" }];

  async function crearCliente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nombre = String(data.get("nombre"));
    const telefono = String(data.get("telefono") || "");
    const correo = String(data.get("correo") || "");
    const remoto = tallerId === "demo" ? null : await crearClienteReal(tallerId, { nombre, telefono: telefono || null, correo: correo || null });
    const nuevo: Cliente = { id: remoto?.id ?? `cli-${Date.now()}`, nombre: remoto?.nombre ?? nombre, documento: String(data.get("documento") || ""), telefono: remoto?.telefono ?? telefono, correo: remoto?.correo ?? correo, activo: true, ordenes: 0, equipos: [] };
    setClientes((actuales) => [nuevo, ...actuales]);
    setSeleccionadoId(nuevo.id);
    setModal(null);
    setAviso("Cliente creado. Ya puedes registrar su primer equipo.");
  }

  async function guardarEquipo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!seleccionado) return;
    const data = new FormData(event.currentTarget);
    const modeloId = String(data.get("modelo_id") || "");
    const modelo = modelosFormulario.find((item) => item.id === modeloId);
    const payload = { modelo_id: modeloId, identificador: String(data.get("serie") || "") || null, notas: String(data.get("alias") || "") || null };
    const remoto = tallerId === "demo" ? null : equipoEditando
      ? await editarDispositivoReal(tallerId, equipoEditando.id, payload)
      : await crearDispositivoReal(tallerId, seleccionado.id, payload);
    const equipo: Dispositivo = { id: remoto?.id ?? equipoEditando?.id ?? `eq-local-${seleccionado.equipos.length + 1}`, modeloId: remoto?.modelo_id ?? modeloId, tipo: modelo?.tipo ?? equipoEditando?.tipo ?? "", marca: modelo?.marca ?? equipoEditando?.marca ?? "", modelo: modelo?.nombre ?? equipoEditando?.modelo ?? "", serie: remoto?.identificador ?? payload.identificador ?? "", alias: remoto?.notas ?? payload.notas ?? "" };
    setClientes((actuales) => actuales.map((cliente) => cliente.id === seleccionado.id ? { ...cliente, equipos: equipoEditando ? cliente.equipos.map((item) => item.id === equipo.id ? equipo : item) : [...cliente.equipos, equipo] } : cliente));
    setModal(null);
    setEquipoEditando(null);
    setAviso(equipoEditando ? "Equipo actualizado." : "Equipo agregado al perfil del cliente.");
  }

  function abrirNuevoEquipo() { setEquipoEditando(null); setModal("equipo"); }
  function abrirEdicionEquipo(equipo: Dispositivo) { setEquipoEditando(equipo); setModal("equipo"); }

  return <div className="space-y-6">
    <PageHeading eyebrow="Relaciones" title="Clientes y equipos" description="Consulta los datos de contacto, dispositivos e historial de servicio desde un solo lugar." action={<PrimaryButton type="button" onClick={() => setModal("cliente")}><Icon name="plus" className="size-4"/>Nuevo cliente</PrimaryButton>}/>

    {aviso && <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-200"><span>{aviso}</span><button type="button" onClick={() => setAviso("")} aria-label="Ocultar aviso"><Icon name="close" className="size-4"/></button></div>}

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.8fr)]">
      <Panel className="min-w-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row">
          <SearchField value={consulta} onChange={setConsulta} placeholder="Nombre, documento, teléfono o correo"/>
          <label className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"><input type="checkbox" checked={soloActivos} onChange={(e) => setSoloActivos(e.target.checked)} className="size-4 rounded accent-teal-700"/>Solo activos</label>
        </div>
        {filtrados.length === 0 ? <EmptyState icon="users" title="No encontramos clientes" description="Prueba otra búsqueda o registra un cliente nuevo." action={<PrimaryButton onClick={() => setModal("cliente")}><Icon name="plus" className="size-4"/>Nuevo cliente</PrimaryButton>}/> : <>
          <div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950/50 dark:text-slate-400"><tr><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Contacto</th><th className="px-4 py-3 text-center">Equipos</th><th className="px-4 py-3 text-right"><span className="sr-only">Abrir</span></th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{filtrados.map((cliente) => <tr key={cliente.id} className={`cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/60 ${seleccionadoId === cliente.id ? "bg-teal-50/70 dark:bg-teal-950/25" : ""}`} onClick={() => setSeleccionadoId(cliente.id)}><td className="px-4 py-3"><p className="font-semibold text-slate-900 dark:text-white">{cliente.nombre}</p><p className="mt-0.5 text-xs text-slate-500">{cliente.documento || "Sin documento"}{!cliente.activo && " · Inactivo"}</p></td><td className="px-4 py-3"><p className="text-slate-700 dark:text-slate-200">{cliente.telefono}</p><p className="mt-0.5 text-xs text-slate-500">{cliente.correo || "Sin correo"}</p></td><td className="px-4 py-3 text-center font-medium tabular-nums text-slate-700 dark:text-slate-200">{cliente.equipos.length}</td><td className="px-4 py-3 text-right"><button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-teal-700 dark:hover:bg-slate-700" onClick={(event) => { event.stopPropagation(); setSeleccionadoId(cliente.id); }} aria-label={`Ver detalle de ${cliente.nombre}`}><Icon name="chevron" className="size-4"/></button></td></tr>)}</tbody></table></div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">{filtrados.map((cliente) => <button type="button" key={cliente.id} onClick={() => setSeleccionadoId(cliente.id)} className={`flex w-full items-center justify-between gap-3 p-4 text-left ${seleccionadoId === cliente.id ? "bg-teal-50 dark:bg-teal-950/25" : ""}`}><div><p className="font-semibold text-slate-900 dark:text-white">{cliente.nombre}</p><p className="mt-1 text-xs text-slate-500">{cliente.telefono} · {cliente.equipos.length} equipos</p></div><Icon name="chevron" className="size-4 text-slate-400"/></button>)}</div>
        </>}
      </Panel>

      <Panel className="overflow-hidden">
        {!seleccionado ? <EmptyState icon="users" title="Selecciona un cliente" description="Aquí verás sus equipos e historial."/> : <>
          <div className="border-b border-slate-200 p-5 dark:border-slate-800"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal-100 font-bold text-teal-800 dark:bg-teal-500/15 dark:text-teal-300">{seleccionado.nombre.split(" ").map((part) => part[0]).slice(0,2).join("")}</span><div className="min-w-0"><h2 className="truncate font-bold text-slate-950 dark:text-white">{seleccionado.nombre}</h2><p className="text-xs text-slate-500">{seleccionado.ordenes} órdenes · Última visita {seleccionado.ultimaVisita ?? "—"}</p></div></div><button type="button" aria-label="Editar cliente" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><Icon name="edit" className="size-4"/></button></div><dl className="mt-4 grid gap-2 text-sm"><div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Icon name="phone" className="size-4 text-slate-400"/><span>{seleccionado.telefono}</span></div><div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Icon name="mail" className="size-4 text-slate-400"/><span className="truncate">{seleccionado.correo || "Sin correo registrado"}</span></div></dl></div>
          <div className="p-5"><div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-900 dark:text-white">Equipos</h3><button type="button" onClick={abrirNuevoEquipo} className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400"><Icon name="plus" className="size-3.5"/>Agregar</button></div>{seleccionado.equipos.length === 0 ? <p className="mt-3 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500 dark:bg-slate-800/60">Aún no hay equipos registrados.</p> : <div className="mt-3 space-y-2">{seleccionado.equipos.map((equipo) => <article key={equipo.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Icon name="device" className="size-4"/></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{equipo.marca} {equipo.modelo}</p><p className="truncate text-xs text-slate-500">{equipo.tipo}{equipo.alias && ` · ${equipo.alias}`}{equipo.serie && ` · S/N ${equipo.serie}`}</p></div><button type="button" onClick={() => abrirEdicionEquipo(equipo)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-teal-700" aria-label={`Editar ${equipo.marca} ${equipo.modelo}`}><Icon name="edit" className="size-4"/></button></article>)}</div>}</div>
          <div className="border-t border-slate-200 p-5 dark:border-slate-800"><h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Icon name="history" className="size-4 text-slate-400"/>Historial reciente</h3><div className="mt-3 space-y-3">{historialVisible.slice(0, seleccionado.ordenes ? 3 : 0).map((orden) => <div key={orden.id} className="flex items-center justify-between gap-3 text-sm"><div><p className="font-semibold text-slate-800 dark:text-slate-100">{orden.numero} · {orden.dispositivo}</p><p className="text-xs text-slate-500">{orden.fecha}</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{estadoLabel[orden.estado]}</span></div>)}{(tallerId !== "demo" || seleccionado.ordenes === 0) && <p className="text-sm text-slate-500">Este cliente todavía no tiene órdenes.</p>}</div></div>
        </>}
      </Panel>
    </div>

    {modal === "cliente" && <Modal title="Nuevo cliente" description="Los campos marcados son necesarios para crear el perfil." onClose={() => setModal(null)}><form onSubmit={crearCliente} className="space-y-4"><label className={labelClass}>Nombre o razón social *<input className={fieldClass} name="nombre" required autoFocus placeholder="Ej. Isabella G"/></label><div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>Documento<input className={fieldClass} name="documento" placeholder="Cédula o NIT"/></label><label className={labelClass}>Teléfono *<input className={fieldClass} name="telefono" type="tel" required placeholder="+57 300 000 0000"/></label></div><label className={labelClass}>Correo electrónico<input className={fieldClass} name="correo" type="email" placeholder="cliente@correo.com"/></label><div className="flex justify-end gap-2 pt-2"><SecondaryButton type="button" onClick={() => setModal(null)}>Cancelar</SecondaryButton><PrimaryButton type="submit">Guardar cliente</PrimaryButton></div></form></Modal>}
    {modal === "equipo" && seleccionado && <Modal title={equipoEditando ? "Editar equipo" : "Agregar equipo"} description={`Quedará asociado a ${seleccionado.nombre}.`} onClose={() => { setModal(null); setEquipoEditando(null); }}><form onSubmit={guardarEquipo} className="space-y-4"><label className={labelClass}>Modelo *<select className={fieldClass} name="modelo_id" required defaultValue={equipoEditando?.modeloId ?? ""}><option value="" disabled>Seleccionar modelo</option>{modelosFormulario.map((modelo) => <option key={modelo.id} value={modelo.id}>{modelo.marca} {modelo.nombre} · {modelo.tipo}</option>)}{equipoEditando && !modelosFormulario.some((modelo) => modelo.id === equipoEditando.modeloId) && <option value={equipoEditando.modeloId}>Modelo actual</option>}</select></label><div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>Número de serie<input className={fieldClass} name="serie" defaultValue={equipoEditando?.serie ?? ""}/></label><label className={labelClass}>Alias<input className={fieldClass} name="alias" defaultValue={equipoEditando?.alias ?? ""} placeholder="Ej. Equipo de trabajo"/></label></div><div className="flex justify-end gap-2 pt-2"><SecondaryButton type="button" onClick={() => { setModal(null); setEquipoEditando(null); }}>Cancelar</SecondaryButton><PrimaryButton type="submit">{equipoEditando ? "Guardar cambios" : "Agregar equipo"}</PrimaryButton></div></form></Modal>}
    <p className="sr-only">Taller activo: {tallerId}</p>
  </div>;
}
