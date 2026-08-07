export type EstadoOrden =
  | "recibido"
  | "diagnostico"
  | "reparacion"
  | "listo"
  | "entregado";

export type Cliente = {
  id: string;
  nombre: string;
  documento?: string;
  telefono: string;
  correo?: string;
  activo: boolean;
  equipos: Dispositivo[];
  ordenes: number;
  ultimaVisita?: string;
};

export type Dispositivo = {
  id: string;
  tipo: string;
  marca: string;
  modelo: string;
  serie?: string;
  alias?: string;
};

export type OrdenBreve = {
  id: string;
  numero: string;
  dispositivo: string;
  estado: EstadoOrden;
  fecha: string;
};

export type Repuesto = {
  id: string;
  sku: string;
  nombre: string;
  categoria: string;
  existencia: number;
  minimo: number;
  unidad: string;
  ubicacion?: string;
  activo: boolean;
};

export type MovimientoInventario = {
  id: string;
  fecha: string;
  repuesto: string;
  tipo: "entrada" | "salida" | "ajuste";
  cantidad: number;
  referencia: string;
  responsable: string;
};

export type Proveedor = {
  id: string;
  nombre: string;
  identificacion?: string;
  contacto?: string;
  telefono?: string;
  correo?: string;
  ciudad?: string;
  activo: boolean;
  repuestos: number;
  ultimaEntrada?: string;
};

export type RolTaller = "dueno" | "tecnico";

