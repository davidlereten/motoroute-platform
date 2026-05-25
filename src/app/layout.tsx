import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "MotoRoute Platform",
  description: "Araç bilgi, karşılaştırma, tamirci ve parça bulma platformu"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <div className="shell">
          <Header />
          {children}
          <footer className="footer">
            <div className="footer-inner">
              <span>MotoRoute Platform Demo</span>
              <span>Bilgi, karşılaştırma, tamirci ve parça arama altyapısı</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
