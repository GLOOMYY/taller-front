export type EstadoOrden =
  | "recibido"
  | "diagnostico"
  | "esperando_aprobacion"
  | "en_reparacion"
  | "listo"
  | "entregado"
  | "cancelado";

export type Moneda = "COP" | "USD";

export interface DineroSnapshot {
  moneda: Moneda;
  valor: string;
}

export interface OrdenResumen {
  id: string;
  numero: string;
  cliente: string;
  equipo: string;
  referenciaEquipo: string;
  estado: EstadoOrden;
  falla: string;
  actualizada: string;
  total: DineroSnapshot;
  pagado: DineroSnapshot;
  saldo: DineroSnapshot;
}

export interface ResumenOperativo {
  periodoDias: number;
  abiertas: number;
  pendientesRecogida: number;
  entregadas: number;
  activas: OrdenResumen[];
  recogida: OrdenResumen[];
  saldos: DineroSnapshot[];
  estados: Array<{ estado: EstadoOrden; cantidad: number }>;
  pagosDiarios: Array<{ fecha: string; COP: string; USD: string }>;
}

export interface LineaOrden {
  id: string;
  concepto: string;
  detalle?: string;
  cantidad: string;
  total: DineroSnapshot;
}

export interface PagoOrden {
  id: string;
  fecha: string;
  metodo: string;
  referencia: string;
  importe: DineroSnapshot;
  estado: "confirmado" | "anulado";
}

export interface EventoOrden {
  id: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  autor: string;
}

export interface OrdenDetalle extends OrdenResumen {
  telefonoCliente: string;
  correoCliente: string;
  serial: string;
  accesorios: string;
  diagnostico: string;
  trabajoRealizado: string;
  garantiaDias: number;
  servicios: LineaOrden[];
  repuestos: LineaOrden[];
  pagos: PagoOrden[];
  historial: EventoOrden[];
  seguimientoHabilitado: boolean;
  transicionesPermitidas: EstadoOrden[];
}

export const ESTADOS_ORDEN: Record<
  EstadoOrden,
  { etiqueta: string; tono: "azul" | "ambar" | "verde" | "gris" | "rojo" }
> = {
  recibido: { etiqueta: "Recibida", tono: "azul" },
  diagnostico: { etiqueta: "En diagnóstico", tono: "ambar" },
  esperando_aprobacion: { etiqueta: "Esperando aprobación", tono: "ambar" },
  en_reparacion: { etiqueta: "En reparación", tono: "azul" },
  listo: { etiqueta: "Lista para recoger", tono: "verde" },
  entregado: { etiqueta: "Entregada", tono: "gris" },
  cancelado: { etiqueta: "Cancelada", tono: "rojo" },
};

