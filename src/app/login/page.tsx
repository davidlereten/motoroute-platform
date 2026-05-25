"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { EnvNotice } from "@/components/EnvNotice";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase .env.local bilgileri eksik.");
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setMessage("Giriş başarılı. Profil sayfasına yönlendiriliyorsunuz.");
    router.push("/profile");
  }

  return (
    <main className="container">
      <EnvNotice />
      <section className="card auth-card">
        <h1 className="section-title">Giriş yap</h1>
        <p className="card-subtitle">Profil, garaj, mesaj ve işletme işlemleri için giriş gerekir.</p>
        <form className="form section" onSubmit={submit}>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ornek@mail.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="password-wrap">
              <input className="input" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              <button className="eye-btn" type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Show password">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert ok">{message}</div>}
          <button className="btn full" disabled={loading}>{loading ? "Giriş yapılıyor..." : "Giriş yap"}</button>
        </form>
        <p className="card-subtitle">Hesabın yok mu? <Link href="/register"><strong>Üye ol</strong></Link></p>
      </section>
    </main>
  );
}
