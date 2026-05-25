"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EnvNotice } from "@/components/EnvNotice";
import { SearchPanel } from "@/components/SearchPanel";
import { getSupabase } from "@/lib/supabase";
import type { GlobalSearchResult } from "@/types/motoroute";

function hrefForResult(item: GlobalSearchResult): string {
  if (["trim", "vehicle"].includes(item.entity_type)) return `/vehicle/${item.entity_id}`;
  if (["part", "parts"].includes(item.entity_type)) return `/parts?q=${encodeURIComponent(item.title)}`;
  if (["business", "mechanic", "parts_dealer"].includes(item.entity_type)) return `/businesses?q=${encodeURIComponent(item.title)}`;
  if (["brand", "model", "generation"].includes(item.entity_type)) return `/vehicles?q=${encodeURIComponent(item.title)}`;
  return `/search?q=${encodeURIComponent(item.title)}`;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !q.trim()) return;
    setLoading(true);
    supabase.rpc("search_motoroute_v2", { q, limit_count: 50, entity_filter: null }).then(({ data }) => {
      setResults((data || []) as GlobalSearchResult[]);
      setLoading(false);
    });
  }, [q]);

  return (
    <>
      <SearchPanel />
      <section className="section result-list">
        {q && <h2 className="section-title">“{q}” arama sonuçları</h2>}
        {loading && <div className="alert">Aranıyor...</div>}
        {!loading && q && results.length === 0 && <div className="alert">Sonuç yok.</div>}
        {results.map((item, index) => (
          <Link className="result" href={hrefForResult(item)} key={`${item.entity_type}-${item.entity_id}-${index}`}>
            <div className="result-icon">{item.entity_type.slice(0, 2).toUpperCase()}</div>
            <div className="result-main">
              <div className="result-title">{item.title}</div>
              <div className="result-subtitle">{item.subtitle || "Katalog sonucu"}</div>
              <div className="badges"><span className="badge accent">{item.entity_type}</span><span className="badge">{item.match_reason}</span></div>
            </div>
            <div className="result-action">Aç →</div>
          </Link>
        ))}
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <main className="container">
      <EnvNotice />
      <section className="section-head section">
        <div><h1 className="section-title">Genel arama</h1><p className="section-subtitle">Araç, marka, parça, kasa kodu, motor kodu ve işletme araması.</p></div>
      </section>
      <Suspense fallback={<div className="alert">Arama yükleniyor...</div>}><SearchContent /></Suspense>
    </main>
  );
}
