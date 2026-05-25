"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EnvNotice } from "@/components/EnvNotice";
import { getSupabase } from "@/lib/supabase";
import type { BrandProfile } from "@/types/motoroute";

type BrowserRow = {
  model_id: string;
  model_name: string;
  model_slug: string;
  kind: string | null;
  body_type: string | null;
  segment: string | null;
  production_status: string | null;
  production_start_year: number | null;
  production_end_year: number | null;
  generation_count: number;
  trim_count: number;
  generations: Array<{ generation_code?: string | null; generation_name?: string | null; year_from?: number | null; year_to?: number | null }> | null;
};

export default function BrandDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [brand, setBrand] = useState<BrandProfile | null>(null);
  const [rows, setRows] = useState<BrowserRow[]>([]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !slug) return;
    supabase.from("v_brand_profiles").select("*").eq("brand_slug", slug).maybeSingle().then(({ data }) => setBrand(data as BrandProfile | null));
    supabase.from("v_brand_model_browser").select("*").eq("brand_slug", slug).order("model_name").then(({ data }) => setRows((data || []) as BrowserRow[]));
  }, [slug]);

  return (
    <main className="container">
      <EnvNotice />
      <section className="hero section">
        <div className="eyebrow">Marka profili</div>
        <h1 className="h1">{brand?.flag_emoji || ""} {brand?.brand_name || slug}</h1>
        <p className="lead">{brand?.origin_country_tr || "Ülke bilgisi"} • {brand?.model_count ?? "—"} model • {brand?.generation_count ?? "—"} kasa • {brand?.trim_count ?? "—"} trim</p>
      </section>

      <section className="section">
        <h2 className="section-title">Model ağacı</h2>
        <div className="result-list section">
          {rows.map((row) => (
            <div className="card" key={row.model_id}>
              <div className="section-head" style={{ marginBottom: 0 }}>
                <div>
                  <h3 className="card-title">{row.model_name}</h3>
                  <p className="card-subtitle">{row.kind || "vehicle"} • {row.body_type || "body"} • {row.production_start_year || "?"}-{row.production_end_year || "günümüz"}</p>
                </div>
                <div className="badges"><span className="badge">{row.generation_count} kasa</span><span className="badge">{row.trim_count} trim</span></div>
              </div>
              <div className="badges">
                {(row.generations || []).slice(0, 12).map((g, i) => (
                  <span className="badge" key={`${row.model_id}-${i}`}>{g.generation_code || g.generation_name || "Kasa"} {g.year_from ? `(${g.year_from}-${g.year_to || ""})` : ""}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
