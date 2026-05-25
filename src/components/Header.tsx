"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const links = [
  { href: "/vehicles", label: "Araç Katalog" },
  { href: "/brands", label: "Markalar" },
  { href: "/compare", label: "Karşılaştır" },
  { href: "/parts", label: "Parça Kodu" },
  { href: "/businesses", label: "Servis Ağı" },
  { href: "/search", label: "Arama" }
];

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="logo" href="/" aria-label="MotoRoute ana sayfa">
          <span className="logo-mark">MR</span>
          <span className="logo-text"><b>Moto</b><b>Route</b></span>
          <small>catalog</small>
        </Link>
        <nav className="nav" aria-label="Ana menü">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname?.startsWith(link.href) ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          {user ? (
            <Link className="btn secondary" href="/profile">Profil</Link>
          ) : (
            <>
              <Link className="btn secondary" href="/login">Giriş</Link>
              <Link className="btn accent" href="/register">Üye Ol</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
