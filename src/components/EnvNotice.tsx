"use client";

import { envReady } from "@/lib/supabase";

export function EnvNotice() {
  if (envReady()) return null;
  return (
    <div className="alert error">
      Supabase bağlantısı için <strong>.env.local</strong> dosyasına NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY eklenmeli.
    </div>
  );
}
