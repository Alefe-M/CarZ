import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarZ - Plataforma de Gestão de Garagens & Veículos",
  description:
    "Sistema web multi-tenant para revendas de seminovos: controle em 3 etapas (Preparação, À Venda, Vendido), dossiê financeiro com detalhamento de peças e mão de obra, consulta FIPE e Trade-in.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
