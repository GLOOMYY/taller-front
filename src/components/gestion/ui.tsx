import type { ReactNode, SVGProps } from "react";

type IconName =
  | "search"
  | "plus"
  | "users"
  | "phone"
  | "mail"
  | "device"
  | "box"
  | "warning"
  | "arrow"
  | "truck"
  | "settings"
  | "chevron"
  | "edit"
  | "history"
  | "store"
  | "card"
  | "shield"
  | "tag"
  | "close";

const paths: Record<IconName, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z"/>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  device: <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 18h6"/></>,
  box: <><path d="m21 8-9 5-9-5 9-5 9 5Z"/><path d="m3 8 9 5 9-5v8l-9 5-9-5V8Z"/><path d="M12 13v8"/></>,
  warning: <><path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></>,
  arrow: <><path d="M12 5v14M18 13l-6 6-6-6"/></>,
  truck: <><path d="M10 17h4V5H2v12h3"/><path d="M14 9h4l4 4v4h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9v-.09A1.7 1.7 0 0 0 7.94 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 3.6 15a1.7 1.7 0 0 0-1.5-1H2V9.9h.1A1.7 1.7 0 0 0 3.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06L6 4.23l.06.06A1.7 1.7 0 0 0 8 4.6a1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
  store: <><path d="M3 10h18l-2-7H5l-2 7Z"/><path d="M5 10v11h14V10M9 21v-7h6v7"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>,
  tag: <><path d="M20.6 13.6 11 23.2 1.8 14V4.8H11Z"/><circle cx="7" cy="10" r="1"/></>,
  close: <path d="m18 6-12 12M6 6l12 12"/>,
};

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name]}</svg>;
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-teal-700 dark:text-teal-400">{eyebrow}</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{title}</h1><p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p></div>
    {action}
  </header>;
}

export function PrimaryButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500 ${className}`} {...props}>{children}</button>;
}

export function SecondaryButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 ${className}`} {...props}>{children}</button>;
}

export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="relative block min-w-0 flex-1"><span className="sr-only">Buscar</span><Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white"/></label>;
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>{children}</section>;
}

export function Stat({ label, value, detail, icon, warning = false }: { label: string; value: string; detail: string; icon: IconName; warning?: boolean }) {
  return <Panel className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-2xl font-bold tabular-nums text-slate-950 dark:text-white">{value}</p></div><span className={`grid size-10 place-items-center rounded-xl ${warning ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" : "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"}`}><Icon name={icon} className="size-5"/></span></div><p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{detail}</p></Panel>;
}

export function EmptyState({ icon, title, description, action }: { icon: IconName; title: string; description: string; action?: ReactNode }) {
  return <div className="grid min-h-56 place-items-center px-5 py-10 text-center"><div><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"><Icon name={icon} className="size-6"/></span><h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{title}</h3><p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>{action && <div className="mt-4">{action}</div>}</div></div>;
}

export function Modal({ title, description, onClose, children }: { title: string; description?: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="gestion-modal-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-lg sm:rounded-2xl sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 id="gestion-modal-title" className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}</div><button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-slate-800"><Icon name="close" className="size-5"/></button></div><div className="mt-5">{children}</div></div></div>;
}

export const fieldClass = "mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white";
export const labelClass = "text-sm font-medium text-slate-700 dark:text-slate-200";
