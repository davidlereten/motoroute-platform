"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EnvNotice } from "@/components/EnvNotice";
import { getSupabase } from "@/lib/supabase";
import type { PartResult } from "@/types/motoroute";

type BusinessPart = {
  inventory_id: string;
  business_name: string;
  part_name_tr: string;
  part_number: string | null;
  oe_part_number: string | null;
  stock_status: string;
  price_amount: number | null;
  currency: string | null;
  compatible_text: string | null;
};

function PartsContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") || "DEMO-E46-FRONT-PAD";
  const [q, setQ] = useState(initial);
  const [parts, setParts] = useState<PartResult[]>([]);
  const [stock, setStock] = useState<BusinessPart[]>([]);

  async function search(query = q) {
    const supabase = getSupabase();
    if (!supabase || !query.trim()) return;
    const [master, business] = await Promise.all([
      supabase.rpc("search_parts_v2", { q: query, limit_count: 30 }),
      supabase.rpc("search_business_parts_v2", { q: query, limit_count: 30 })
    ]);
    setParts((master.data || []) as PartResult[]);
    setStock((business.data || []) as BusinessPart[]);
  }

  useEffect(() => { search(initial); }, [initial]);

  return (
    <>
      <form className="search-panel" onSubmit={(e) => { e.preventDefault(); search(); }}>
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Parça adı, OE kodu, muadil kod, motor kodu..." />
        <button className="btn">Parça ara</button>
      </form>
      <section className="grid grid-2 section">
        <div className="card">
          <h2 className="card-title">Ana parça veritabanı</h2>
          <div className="result-list section">
            {parts.map((p) => (
              <div className="result" key={p.part_id}>
                <div className="result-icon">PR</div>
                <div className="result-main">
                  <div className="result-title">{p.name_tr}</div>
                  <div className="result-subtitle">{p.manufacturer_name || "Üretici"} • {p.primary_part_number || "Kod yok"} • OE {p.oe_part_number || "—"}</div>
                  <div className="badges"><span className="badge">{p.category_tr || "Kategori"}</span>{p.compatible_summary && <span className="badge success">Uyum: {p.compatible_summary}</span>}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="card-title">İşletme stokları</h2>
          <div className="result-list section">
            {stock.map((s) => (
              <div className="result" key={s.inventory_id}>
                <div className="result-icon">ST</div>
                <div className="result-main">
                  <div className="result-title">{s.part_name_tr}</div>
                  <div className="result-subtitle">{s.business_name} • {s.part_number || "Kod yok"} • {s.price_amount ? `${s.price_amount} ${s.currency}` : "Fiyat sor"}</div>
                  <div className="badges"><span className="badge accent">{s.stock_status}</span>{s.compatible_text && <span className="badge">{s.compatible_text}</span>}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function PartsPage() {
  return (
    <main className="container">
      <EnvNotice />
      <section className="section-head section">
        <div><h1 className="section-title">Parça arama</h1><p className="section-subtitle">OE/OEM, muadil kod, motor kodu ve işletme stok araması.</p></div>
      </section>
      <Suspense fallback={<div className="alert">Parça modülü yükleniyor...</div>}><PartsContent /></Suspense>
    </main>
  );
}
