"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const themes = [
  { value: "light", label: "Claro", Icon: Sun },
  { value: "system", label: "Sistema", Icon: Laptop },
  { value: "dark", label: "Oscuro", Icon: Moon },
] as const;

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const activeTheme = theme ?? "system";

  if (compact) {
    const current = themes.find((item) => item.value === activeTheme) ?? themes[1];
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    return (
      <button className="icon-button" onClick={() => setTheme(next.value)} aria-label={`Tema: ${current.label}. Cambiar a ${next.label}`}>
        <current.Icon size={18} />
      </button>
    );
  }

  return (
    <div className="segmented" aria-label="Seleccionar tema" suppressHydrationWarning>
      {themes.map(({ value, label, Icon }) => (
        <button key={value} className="segmented-item" data-active={activeTheme === value} onClick={() => setTheme(value)} aria-pressed={activeTheme === value}>
          <Icon size={15} /><span>{label}</span>
        </button>
      ))}
    </div>
  );
}
