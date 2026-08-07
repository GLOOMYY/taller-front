import { Wrench } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm"><Wrench size={19} /></span>
      {!compact && <span className="font-display text-lg font-extrabold tracking-[-.035em]">Taller<span className="text-[var(--accent-strong)]">.</span></span>}
    </span>
  );
}
