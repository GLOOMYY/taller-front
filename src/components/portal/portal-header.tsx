import { Bell, Search } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function PortalHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <header className="content-header">
      <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
      <div className="content-header-actions">
        <label className="global-search"><Search size={16} /><span className="sr-only">Buscar</span><input placeholder="Buscar orden, cliente…" /><kbd>⌘ K</kbd></label>
        <ThemeSwitcher compact />
        <button className="icon-button notification-button" aria-label="Notificaciones"><Bell size={18} /><span /></button>
        {action}
      </div>
    </header>
  );
}
