import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import { Providers } from "@/components/providers";
import "./globals.css";

const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
const display = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display" });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = new URL("/og.png", `${protocol}://${host}`).toString();
  return {
    title: { default: "Taller — Control claro, trabajo en marcha", template: "%s · Taller" },
    description: "Órdenes, clientes, inventario y seguimiento en un solo lugar para talleres que quieren avanzar.",
    applicationName: "Taller",
    openGraph: { title: "Taller", description: "Tu taller, en orden y en movimiento.", locale: "es_CO", type: "website", images: [{ url: image, width: 1200, height: 630, alt: "Taller, portal operativo para talleres" }] },
    twitter: { card: "summary_large_image", title: "Taller", description: "Tu taller, en orden y en movimiento.", images: [image] },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={`${body.variable} ${display.variable}`}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
