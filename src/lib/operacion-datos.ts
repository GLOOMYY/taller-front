import type {
  OrdenDetalle,
  OrdenResumen,
  ResumenOperativo,
} from "@/lib/operacion-modelos";
import { api } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { getAccessToken } from "@/lib/auth";

type ApiOrden = components["schemas"]["OrdenSalida"];
type ApiPaginaOrdenes = components["schemas"]["PaginaOrdenesSalida"];
type ApiResumen = components["schemas"]["ResumenOperativoSalida"];

function estadoDesdeApi(estado: string): OrdenResumen["estado"] {
  return ({ abierta: "recibido", en_proceso: "en_reparacion", espera_repuesto: "esperando_aprobacion", pendiente_recogida: "listo", entregado: "entregado" } as const)[estado as "abierta"] ?? "recibido";
}

function mapearOrden(orden: ApiOrden): OrdenResumen {
  const moneda = orden.moneda.codigo === "USD" ? "USD" : "COP";
  return {
    id: orden.id,
    numero: `OT-${String(orden.consecutivo).padStart(4, "0")}`,
    cliente: "Cliente registrado",
    equipo: "Equipo en servicio",
    referenciaEquipo: `Dispositivo · ${orden.dispositivo_id.slice(-6)}`,
    estado: estadoDesdeApi(orden.estado),
    falla: orden.falla_reportada,
    actualizada: new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(orden.actualizado_en)),
    total: { moneda, valor: orden.total },
    pagado: { moneda, valor: orden.pagado ?? "0.00" },
    saldo: { moneda, valor: orden.saldo ?? orden.total },
  };
}

const ordenes: OrdenResumen[] = [
  {
    id: "ord-1048",
    numero: "OT-1048",
    cliente: "Mariana Gómez",
    equipo: "iPhone 14 Pro",
    referenciaEquipo: "Apple · Morado oscuro",
    estado: "en_reparacion",
    falla: "La pantalla no responde después de una caída.",
    actualizada: "Hoy, 10:42",
    total: { moneda: "COP", valor: "485000.00" },
    pagado: { moneda: "COP", valor: "200000.00" },
    saldo: { moneda: "COP", valor: "285000.00" },
  },
  {
    id: "ord-1047",
    numero: "OT-1047",
    cliente: "Carlos Ruiz",
    equipo: "Galaxy S23",
    referenciaEquipo: "Samsung · Negro",
    estado: "listo",
    falla: "No carga y el conector se siente suelto.",
    actualizada: "Hoy, 09:18",
    total: { moneda: "COP", valor: "180000.00" },
    pagado: { moneda: "COP", valor: "180000.00" },
    saldo: { moneda: "COP", valor: "0.00" },
  },
  {
    id: "ord-1046",
    numero: "OT-1046",
    cliente: "Lucía Fernández",
    equipo: "MacBook Air M2",
    referenciaEquipo: "Apple · Medianoche",
    estado: "esperando_aprobacion",
    falla: "Se apaga al desconectar el cargador.",
    actualizada: "Ayer, 16:30",
    total: { moneda: "COP", valor: "720000.00" },
    pagado: { moneda: "COP", valor: "0.00" },
    saldo: { moneda: "COP", valor: "720000.00" },
  },
  {
    id: "ord-1045",
    numero: "OT-1045",
    cliente: "Alejandro Díaz",
    equipo: "Dell XPS 13",
    referenciaEquipo: "Dell · Plata",
    estado: "diagnostico",
    falla: "El ventilador hace ruido y se recalienta.",
    actualizada: "Ayer, 11:05",
    total: { moneda: "USD", valor: "45.00" },
    pagado: { moneda: "USD", valor: "0.00" },
    saldo: { moneda: "USD", valor: "45.00" },
  },
  {
    id: "ord-1044",
    numero: "OT-1044",
    cliente: "Sofía Castro",
    equipo: "iPad Air",
    referenciaEquipo: "Apple · Azul",
    estado: "entregado",
    falla: "Cambio de batería por baja autonomía.",
    actualizada: "5 ago, 14:22",
    total: { moneda: "COP", valor: "390000.00" },
    pagado: { moneda: "COP", valor: "390000.00" },
    saldo: { moneda: "COP", valor: "0.00" },
  },
];

const detalleBase: OrdenDetalle = {
  ...ordenes[0],
  telefonoCliente: "+57 310 555 0147",
  correoCliente: "mariana.gomez@ejemplo.com",
  serial: "DNPQ72L9K7",
  accesorios: "Equipo sin cargador, con funda transparente.",
  diagnostico:
    "Módulo de pantalla fracturado y flex táctil sin respuesta. La placa y las cámaras superan las pruebas funcionales.",
  trabajoRealizado:
    "Desmontaje, limpieza interna y preparación para instalar módulo OLED de reemplazo.",
  garantiaDias: 90,
  servicios: [
    {
      id: "ser-1",
      concepto: "Cambio de módulo de pantalla",
      detalle: "Incluye instalación y pruebas funcionales",
      cantidad: "1",
      total: { moneda: "COP", valor: "120000.00" },
    },
  ],
  repuestos: [
    {
      id: "rep-1",
      concepto: "Pantalla OLED compatible iPhone 14 Pro",
      detalle: "SKU PAN-IP14P-OLED",
      cantidad: "1",
      total: { moneda: "COP", valor: "365000.00" },
    },
  ],
  pagos: [
    {
      id: "pag-1",
      fecha: "7 ago 2026, 09:14",
      metodo: "Transferencia",
      referencia: "TRX-8841",
      importe: { moneda: "COP", valor: "200000.00" },
      estado: "confirmado",
    },
  ],
  historial: [
    {
      id: "evt-3",
      fecha: "7 ago 2026, 10:42",
      titulo: "Reparación iniciada",
      descripcion: "El equipo pasó a la mesa de trabajo 2.",
      autor: "Daniel Torres",
    },
    {
      id: "evt-2",
      fecha: "7 ago 2026, 09:14",
      titulo: "Pago confirmado",
      descripcion: "Abono registrado por transferencia.",
      autor: "Laura Pérez",
    },
    {
      id: "evt-1",
      fecha: "6 ago 2026, 15:38",
      titulo: "Orden creada",
      descripcion: "Equipo recibido con funda transparente.",
      autor: "Laura Pérez",
    },
  ],
  seguimientoHabilitado: true,
  transicionesPermitidas: ["listo", "cancelado"],
};

export async function obtenerResumenOperativo(
  tallerId: string,
  periodoDias = 30,
): Promise<ResumenOperativo> {
  if (await getAccessToken()) {
    const base = `/api/v1/talleres/${encodeURIComponent(tallerId)}`;
    const [resumen, abiertas, recogida] = await Promise.all([
      api.get<ApiResumen>(`${base}/resumen-operativo?periodo_dias=${periodoDias}`),
      api.get<ApiPaginaOrdenes>(`${base}/ordenes?grupo=abiertas&limite=4`),
      api.get<ApiPaginaOrdenes>(`${base}/ordenes?grupo=pendientes_recogida&limite=4`),
    ]);
    return {
      periodoDias,
      abiertas: resumen.activas,
      pendientesRecogida: resumen.pendientes_recogida,
      entregadas: resumen.entregadas,
      activas: abiertas.items.map(mapearOrden),
      recogida: recogida.items.map(mapearOrden),
      saldos: resumen.totales_por_moneda.map((item) => ({ moneda: item.moneda_codigo === "USD" ? "USD" : "COP", valor: item.pendiente })),
      estados: [
        { estado: "recibido", cantidad: resumen.conteos_por_estado.abierta },
        { estado: "en_reparacion", cantidad: resumen.conteos_por_estado.en_proceso },
        { estado: "esperando_aprobacion", cantidad: resumen.conteos_por_estado.espera_repuesto },
        { estado: "listo", cantidad: resumen.conteos_por_estado.pendiente_recogida },
        { estado: "entregado", cantidad: resumen.conteos_por_estado.entregado },
      ],
      pagosDiarios: resumen.serie_pagos.map((dia) => ({
        fecha: new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(new Date(`${dia.fecha}T12:00:00`)),
        COP: dia.totales_por_moneda.find((item) => item.moneda_codigo === "COP")?.total ?? "0.00",
        USD: dia.totales_por_moneda.find((item) => item.moneda_codigo === "USD")?.total ?? "0.00",
      })),
    };
  }
  return {
    periodoDias,
    abiertas: 12,
    pendientesRecogida: 4,
    entregadas: periodoDias === 7 ? 9 : periodoDias === 90 ? 86 : 31,
    activas: ordenes.filter((orden) =>
      ["diagnostico", "esperando_aprobacion", "en_reparacion"].includes(
        orden.estado,
      ),
    ),
    recogida: ordenes.filter((orden) => orden.estado === "listo"),
    saldos: [
      { moneda: "COP", valor: "1285000.00" },
      { moneda: "USD", valor: "45.00" },
    ],
    estados: [
      { estado: "recibido", cantidad: 3 },
      { estado: "diagnostico", cantidad: 4 },
      { estado: "esperando_aprobacion", cantidad: 2 },
      { estado: "en_reparacion", cantidad: 3 },
      { estado: "listo", cantidad: 4 },
      { estado: "entregado", cantidad: periodoDias === 7 ? 9 : 31 },
    ],
    pagosDiarios: [
      { fecha: "1 ago", COP: "350000.00", USD: "0.00" },
      { fecha: "2 ago", COP: "580000.00", USD: "35.00" },
      { fecha: "3 ago", COP: "420000.00", USD: "0.00" },
      { fecha: "4 ago", COP: "840000.00", USD: "55.00" },
      { fecha: "5 ago", COP: "610000.00", USD: "0.00" },
      { fecha: "6 ago", COP: "920000.00", USD: "20.00" },
      { fecha: "7 ago", COP: "740000.00", USD: "45.00" },
    ],
  };
}

export async function listarOrdenes(tallerId: string): Promise<OrdenResumen[]> {
  if (await getAccessToken()) {
    const pagina = await api.get<ApiPaginaOrdenes>(`/api/v1/talleres/${encodeURIComponent(tallerId)}/ordenes?limite=100`);
    return pagina.items.map(mapearOrden);
  }
  return ordenes;
}

export async function obtenerOrden(
  tallerId: string,
  ordenId: string,
): Promise<OrdenDetalle | null> {
  if (await getAccessToken()) {
    const orden = await api.get<ApiOrden>(`/api/v1/talleres/${encodeURIComponent(tallerId)}/ordenes/${encodeURIComponent(ordenId)}`);
    const resumen = mapearOrden(orden);
    return {
      ...detalleBase,
      ...resumen,
      diagnostico: orden.diagnostico ?? "",
      trabajoRealizado: orden.trabajo_realizado ?? "",
      accesorios: orden.accesorios_recibidos ?? "",
      servicios: [],
      repuestos: [],
      pagos: [],
      historial: [],
      seguimientoHabilitado: orden.seguimiento_habilitado,
      transicionesPermitidas: orden.estado === "entregado" ? [] : resumen.saldo.valor === "0.00" && orden.estado === "pendiente_recogida" ? ["entregado"] : ["en_reparacion", "cancelado"],
    };
  }
  if (ordenId === detalleBase.id) return detalleBase;
  const resumen = ordenes.find((orden) => orden.id === ordenId);
  if (!resumen) return null;
  return {
    ...detalleBase,
    ...resumen,
    telefonoCliente: "+57 300 555 0101",
    correoCliente: "cliente@ejemplo.com",
    servicios: [],
    repuestos: [],
    pagos: [],
    historial: detalleBase.historial.slice(-1),
    seguimientoHabilitado: false,
    transicionesPermitidas:
      resumen.estado === "entregado"
        ? []
        : resumen.estado === "listo"
          ? ["entregado", "en_reparacion"]
          : ["en_reparacion", "cancelado"],
  };
}
