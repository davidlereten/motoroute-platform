"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { EnvNotice } from "@/components/EnvNotice";
import { getSupabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
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
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setMessage("Üyelik oluşturuldu. Supabase email confirmation açıksa mail onayı gerekebilir.");
  }

  return (
    <main className="container">
      <EnvNotice />
      <section className="card auth-card">
        <h1 className="section-title">Üye ol</h1>
        <p className="card-subtitle">Araç garajı oluştur, yorum yap, tamirci/parçacı ile mesajlaş.</p>
        <form className="form section" onSubmit={submit}>
          <div>
            <label className="label">Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="mustafa" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ornek@mail.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="password-wrap">
              <input className="input" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="En az 6 karakter" />
              <button className="eye-btn" type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Show password">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert ok">{message}</div>}
          <button className="btn full" disabled={loading}>{loading ? "Üyelik oluşturuluyor..." : "Üye ol"}</button>
        </form>
        <p className="card-subtitle">Zaten hesabın var mı? <Link href="/login"><strong>Giriş yap</strong></Link></p>
      </section>
    </main>
  );
}
