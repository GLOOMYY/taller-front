import Link from "next/link";
import { EncabezadoPagina, Icono } from "@/components/operacion/elementos-operacion";
import { FormularioNuevaOrden } from "@/components/operacion/formulario-nueva-orden";

export default async function NuevaOrdenPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Link href={`/t/${tallerId}/ordenes`} className="inline-flex items-center gap-1 text-sm font-semibold text-stone-500 hover:text-teal-700 dark:text-stone-400 dark:hover:text-teal-400"><Icono nombre="flecha" className="size-4 rotate-180" />Volver a órdenes</Link>
      <EncabezadoPagina ceja="Alta rápida" titulo="Nueva orden de trabajo" descripcion="Registra cliente, equipo y motivo de ingreso. Podrás completar diagnóstico, servicios y repuestos desde el detalle." />
      <FormularioNuevaOrden tallerId={tallerId} />
    </div>
  );
}
