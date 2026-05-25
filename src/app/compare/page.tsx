"use client";

import { FormEvent, useState } from "react";
import { EnvNotice } from "@/components/EnvNotice";
import { getSupabase } from "@/lib/supabase";
import type { VehicleSearchResult } from "@/types/motoroute";

export default function ComparePage() {
  const [leftQ, setLeftQ] = useState("bmw e46 320ci");
  const [rightQ, setRightQ] = useState("golf mk4");
  const [left, setLeft] = useState<VehicleSearchResult | null>(null);
  const [right, setRight] = useState<VehicleSearchResult | null>(null);

  async function compare(event?: FormEvent) {
    event?.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    const [a, b] = await Promise.all([
      supabase.rpc("search_vehicle_catalog_v2", { q: leftQ, limit_count: 1 }),
      supabase.rpc("search_vehicle_catalog_v2", { q: rightQ, limit_count: 1 })
    ]);
    setLeft(((a.data || []) as VehicleSearchResult[])[0] || null);
    setRight(((b.data || []) as VehicleSearchResult[])[0] || null);
  }

  return (
    <main className="container">
      <EnvNotice />
      <section className="section-head section">
        <div><h1 className="section-title">Karşılaştırma</h1><p className="section-subtitle">İlk demo: iki araç arama sonucu yan yana gösterilir. Teknik karşılaştırma tablosu sonraki adımda büyütülecek.</p></div>
      </section>
      <form className="grid grid-2 section" onSubmit={compare}>
        <input className="input" value={leftQ} onChange={(e) => setLeftQ(e.target.value)} />
        <input className="input" value={rightQ} onChange={(e) => setRightQ(e.target.value)} />
        <button className="btn" style={{ gridColumn: "1 / -1" }}>Karşılaştır</button>
      </form>
      <section className="grid grid-2 section">
        {[left, right].map((item, index) => (
          <div className="card" key={index}>
            <h2 className="card-title">{item?.title || "Araç seçilmedi"}</h2>
            <p className="card-subtitle">{item?.subtitle || "Arama yaparak araç seç."}</p>
            {item && <div className="badges"><span className="badge accent">{item.result_type}</span>{item.generation_code && <span className="badge">{item.generation_code}</span>}</div>}
          </div>
        ))}
      </section>
    </main>
  );
}
