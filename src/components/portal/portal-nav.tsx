"use client";

import {
  Boxes, ChevronDown, ClipboardList, LayoutDashboard, Menu, Settings,
  Truck, UsersRound, Wrench, X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { RolTaller } from "@/lib/api/contracts";

const items = [
  { href: "inicio", label: "Inicio", icon: LayoutDashboard },
  { href: "ordenes", label: "Órdenes", icon: ClipboardList },
  { href: "clientes", label: "Clientes y equipos", icon: UsersRound },
  { href: "inventario", label: "Inventario", icon: Boxes },
  { href: "proveedores", label: "Proveedores", icon: Truck },
  { href: "configuracion", label: "Configuración", icon: Settings },
];

export function PortalNav({ tallerId, tallerNombre, rol }: { tallerId: string; tallerNombre: string; rol: RolTaller }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <>
      <div className="portal-brand"><span className="portal-logo"><Wrench size={19} /></span><span><strong>Taller.</strong><small>Panel operativo</small></span></div>
      <a href="/seleccionar-taller" className="workshop-switcher"><span><small>Taller activo</small><strong>{tallerNombre}</strong></span><ChevronDown size={16} /></a>
      <nav className="portal-links" aria-label="Navegación del taller">
        {items.map(({ href, label, icon: Icon }) => {
          const url = `/t/${tallerId}/${href}`;
          const active = pathname === url || pathname.startsWith(`${url}/`);
          return <Link key={href} href={url} className={cn("portal-link", active && "active")} onClick={() => setOpen(false)}><Icon size={18} /><span>{label}</span>{href === "ordenes" && <em>12</em>}</Link>;
        })}
      </nav>
      <div className="portal-nav-footer">
        <Link href="/perfil" className="profile-chip"><span>ML</span><span><strong>Isabella López</strong><small>{rol === "dueno" ? "Dueña" : "Técnico"}</small></span><ChevronDown size={15} /></Link>
        <a className="logout-link" href="/auth/logout">Cerrar sesión</a>
      </div>
    </>
  );

  return (
    <>
      <aside className="portal-sidebar">{content}</aside>
      <header className="mobile-header"><span className="portal-logo"><Wrench size={18} /></span><strong>{tallerNombre}</strong><button className="icon-button" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu size={20} /></button></header>
      {open && <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menú"><button className="drawer-backdrop" onClick={() => setOpen(false)} aria-label="Cerrar menú" /><aside><button className="drawer-close" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X size={20} /></button>{content}</aside></div>}
    </>
  );
}
