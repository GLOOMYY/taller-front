import { PortalNav } from "@/components/portal/portal-nav";
import { getTaller } from "@/lib/portal";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children, params }: LayoutProps<"/t/[tallerId]">) {
  const { tallerId } = await params;
  const taller = await getTaller(tallerId);
  return <div className="portal-shell"><PortalNav tallerId={tallerId} tallerNombre={taller.nombre} rol={taller.rol_actual} /><main className="portal-content">{children}</main></div>;
}
