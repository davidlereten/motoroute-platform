"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { EnvNotice } from "@/components/EnvNotice";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
  }, []);

  async function signOut() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <main className="container">
      <EnvNotice />
      <section className="card section">
        <h1 className="section-title">Profil / Garaj</h1>
        {loading && <p className="card-subtitle">Profil yükleniyor...</p>}
        {!loading && !user && (
          <div className="alert">
            Bu sayfa için giriş gerekli. <Link href="/login"><strong>Giriş yap</strong></Link> veya <Link href="/register"><strong>üye ol</strong></Link>.
          </div>
        )}
        {user && (
          <>
            <p className="card-subtitle">Email: {user.email}</p>
            <div className="badges"><span className="badge success">Aktif oturum</span><span className="badge">Garaj modülü sonraki adımda bağlanacak</span></div>
            <div className="section"><button className="btn secondary" onClick={signOut}>Çıkış yap</button></div>
          </>
        )}
      </section>
    </main>
  );
}
