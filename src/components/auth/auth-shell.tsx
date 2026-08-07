import { Logo } from "@/components/ui/logo";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <main className="auth-page"><header><Logo /><ThemeSwitcher compact /></header><section className="auth-card"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p>{children}</section><small className="auth-footer">Taller · Operación segura y separada por negocio</small></main>;
}
