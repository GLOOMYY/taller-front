export type RolTaller = "dueno" | "tecnico";

export interface Pagina<T> {
  items: T[];
  siguiente_cursor: string | null;
}

export interface Taller {
  id: string;
  nombre: string;
  pais_codigo: string;
  moneda_codigo: string;
  rol_actual: RolTaller;
}

export interface Usuario {
  id: string;
  nombre: string;
  nombre_usuario: string;
}

export type EstadoOrden =
  | "recibido"
  | "diagnostico"
  | "esperando_aprobacion"
  | "en_reparacion"
  | "listo_para_recoger"
  | "entregado"
  | "cancelado"
  | "garantia";

export interface DineroSnapshot {
  moneda: string;
  monto: string;
}

export interface OrdenPublica {
  taller_nombre: string;
  numero: string;
  estado: EstadoOrden;
  equipo: { tipo: string; marca: string; modelo: string; identificador?: string | null };
  falla_reportada: string;
  diagnostico?: string | null;
  trabajo_realizado?: string | null;
  servicios: { nombre: string; cantidad: string }[];
  repuestos: { nombre: string; cantidad: string }[];
  historial: { fecha: string; descripcion: string }[];
  total: string;
  moneda_codigo: string;
  entregado_en?: string | null;
}

export interface ResumenOperativo {
  periodo: { desde: string; hasta: string; dias: number };
  conteos_por_estado: Record<EstadoOrden, number>;
  activas: number;
  pendientes_recogida: number;
  entregadas: number;
  totales_por_moneda: {
    moneda: string;
    ordenado: string;
    pagado: string;
    pendiente: string;
  }[];
  ordenes_diarias: { fecha: string; cantidad: number }[];
  pagos_diarios: { fecha: string; moneda: string; monto: string }[];
}
