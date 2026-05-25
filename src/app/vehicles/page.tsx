"use client";

import { FormEvent, useEffect, useState } from "react";
import { EnvNotice } from "@/components/EnvNotice";
import { VehicleResultCard } from "@/components/VehicleResultCard";
import { getSupabase } from "@/lib/supabase";
import type { VehicleSearchResult } from "@/types/motoroute";

export default function VehiclesPage() {
  const [query, setQuery] = useState("bmw e46");
  const [results, setResults] = useState<VehicleSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(nextQuery = query) {
    const supabase = getSupabase();
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.rpc("search_vehicle_catalog_v2", { q: nextQuery, limit_count: 50 });
    setResults((data || []) as VehicleSearchResult[]);
    setLoading(false);
  }

  useEffect(() => { search("bmw e46"); }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    search();
  }

  return (
    <main className="container">
      <EnvNotice />
      <div className="section-head section">
        <div><h1 className="section-title">Araç kataloğu</h1><p className="section-subtitle">Marka, model, kasa kodu, motor kodu ve trim araması.</p></div>
      </div>
      <form className="toolbar" onSubmit={submit}>
        <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="BMW E46, Golf Mk4, Ibiza KJ1..." />
        <button className="btn">Araç ara</button>
        <span className="badge">{results.length} sonuç</span>
      </form>
      <section className="section result-list">
        {loading && <div className="alert">Araç kataloğu aranıyor...</div>}
        {!loading && results.length === 0 && <div className="alert">Sonuç yok. Başka bir marka/model/kasa kodu dene.</div>}
        {results.map((item, index) => <VehicleResultCard key={`${item.result_type}-${item.trim_id || item.generation_id || item.model_id}-${index}`} item={item} />)}
      </section>
    </main>
  );
}
