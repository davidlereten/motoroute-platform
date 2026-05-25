"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function Header() {
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
        <Link className="logo" href="/">
          <span className="logo-mark">MR</span>
          <span>Moto</span><span>Route</span>
        </Link>
        <nav className="nav">
          <Link href="/vehicles">Araçlar</Link>
          <Link href="/brands">Markalar</Link>
          <Link href="/compare">Karşılaştır</Link>
          <Link href="/parts">Parça Ara</Link>
          <Link href="/businesses">Tamirci / Parçacı</Link>
          <Link href="/search">Arama</Link>
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
