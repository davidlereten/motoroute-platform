"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EnvNotice } from "@/components/EnvNotice";
import { getSupabase } from "@/lib/supabase";
import type { BrandProfile } from "@/types/motoroute";

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.from("v_brand_profiles").select("*").order("brand_name").then(({ data }) => setBrands((data || []) as BrandProfile[]));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return brands;
    return brands.filter((b) => `${b.brand_name} ${b.origin_country_tr || ""}`.toLowerCase().includes(needle));
  }, [brands, q]);

  return (
    <main className="container">
      <EnvNotice />
      <section className="section-head section">
        <div><h1 className="section-title">Markalar</h1><p className="section-subtitle">Marka profilleri, model sayıları, üretim ülkesi ve kategori dağılımı.</p></div>
      </section>
      <div className="search-panel"><input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="BMW, Saab, Volkswagen, Tofaş..." /><span /></div>
      <section className="grid grid-4 section">
        {filtered.map((brand) => (
          <Link className="card" key={brand.brand_id} href={`/brands/${brand.brand_slug}`}>
            <h3 className="card-title">{brand.flag_emoji || ""} {brand.brand_name}</h3>
            <p className="card-subtitle">{brand.origin_country_tr || "Ülke bilgisi yok"}</p>
            <div className="badges">
              <span className="badge">{brand.model_count} model</span>
              <span className="badge">{brand.generation_count} kasa</span>
              {brand.turkey_market_model_count > 0 && <span className="badge accent">TR pazarı</span>}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
