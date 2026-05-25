"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EnvNotice } from "@/components/EnvNotice";
import { SearchPanel } from "@/components/SearchPanel";
import { getSupabase } from "@/lib/supabase";
import type { BrandProfile, BusinessResult, CatalogSummary } from "@/types/motoroute";

export default function HomePage() {
  const [summary, setSummary] = useState<CatalogSummary | null>(null);
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [businesses, setBusinesses] = useState<BusinessResult[]>([]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.from("v_catalog_summary").select("*").maybeSingle().then(({ data }) => setSummary(data as CatalogSummary | null));
    supabase.from("v_brand_profiles").select("*").order("model_count", { ascending: false }).limit(8).then(({ data }) => setBrands((data || []) as BrandProfile[]));
    supabase.rpc("search_businesses_v2", {
      q: "bmw e46 mekanik",
      user_lat: 41.025,
      user_lng: 29.045,
      p_account_type: null,
      limit_count: 3
    }).then(({ data }) => setBusinesses((data || []) as BusinessResult[]));
  }, []);

  return (
    <main className="container">
      <EnvNotice />
      <section className="hero section">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Araç bilgi platformu</div>
            <h1 className="h1">Her araç, her kasa, her parça tek sistemde.</h1>
            <p className="lead">
              Satış sitesi değil; marka profili, teknik karşılaştırma, parça kodu ve tamirci/parçacı bulma odaklı otomotiv bilgi platformu.
            </p>
            <SearchPanel />
            <div className="stat-grid">
              <div className="stat"><strong>{summary?.brand_count ?? "—"}</strong><span>Marka</span></div>
              <div className="stat"><strong>{summary?.model_count ?? "—"}</strong><span>Model</span></div>
              <div className="stat"><strong>{summary?.generation_count ?? "—"}</strong><span>Kasa / Jenerasyon</span></div>
              <div className="stat"><strong>{summary?.trim_count ?? "—"}</strong><span>Versiyon / Trim</span></div>
            </div>
          </div>
          <div className="hero-card">
            <h3>Profesyonel arama</h3>
            <p className="mini-line">Kasa kodu, motor kodu, OE parça kodu ve işletme uzmanlığı aynı arama mantığına bağlandı.</p>
            <div className="badges">
              <Link className="badge dark" href="/search?q=bmw%20e46%20320ci">BMW E46 320Ci</Link>
              <Link className="badge dark" href="/search?q=golf%20mk4">Golf Mk4</Link>
              <Link className="badge dark" href="/search?q=ibiza%20kj1">Ibiza KJ1</Link>
              <Link className="badge dark" href="/parts?q=34116761244">34116761244</Link>
              <Link className="badge dark" href="/businesses?q=bmw%20e46%20mekanik">BMW E46 mekanik</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section grid grid-3">
        <Link className="card feature-card" href="/vehicles">
          <h3 className="card-title">Araç katalog</h3>
          <p className="card-subtitle">Marka, model, kasa, trim ve motor kodu seviyesinde arama.</p>
          <div className="badges"><span className="badge accent">E46</span><span className="badge">Mk4</span><span className="badge">KJ1</span></div>
        </Link>
        <Link className="card feature-card" href="/parts">
          <h3 className="card-title">Parça kodu</h3>
          <p className="card-subtitle">OE/OEM, muadil kod ve araç uyumluluğu altyapısı.</p>
          <div className="badges"><span className="badge success">34116761244</span><span className="badge">Bosch</span></div>
        </Link>
        <Link className="card feature-card" href="/businesses">
          <h3 className="card-title">Tamirci / parçacı</h3>
          <p className="card-subtitle">Uzmanlık, mesafe, desteklenen marka/model/kasa ve stok bilgisi.</p>
          <div className="badges"><span className="badge warn">Konum</span><span className="badge">Uzmanlık</span></div>
        </Link>
      </section>

      <section className="section">
        <div className="section-head">
          <div><h2 className="section-title">Popüler markalar</h2><p className="section-subtitle">Marka profili, modeller, yıllar ve kasa kodları.</p></div>
          <Link className="btn secondary" href="/brands">Tüm markalar</Link>
        </div>
        <div className="grid grid-4">
          {brands.map((brand) => (
            <Link className="card brand-card" href={`/brands/${brand.brand_slug}`} key={brand.brand_id}>
              <div>
                <div className="brand-logo">{brand.brand_name.slice(0, 2).toUpperCase()}</div>
                <h3 className="card-title">{brand.flag_emoji || ""} {brand.brand_name}</h3>
                <p className="card-subtitle">{brand.origin_country_tr || "Menşei bilgisi"} • {brand.model_count} model</p>
              </div>
              <div className="badges"><span className="badge">{brand.generation_count} kasa</span><span className="badge">{brand.trim_count} trim</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div><h2 className="section-title">Yakındaki işletmeler</h2><p className="section-subtitle">Tamirci, parçacı, kaportacı ve uzman servis kayıtları.</p></div>
          <Link className="btn secondary" href="/businesses">İşletme ara</Link>
        </div>
        <div className="grid grid-3">
          {businesses.map((b) => (
            <Link className="card" href="/businesses" key={b.business_id}>
              <h3 className="card-title">{b.business_name}</h3>
              <p className="card-subtitle">{b.short_description_tr}</p>
              <div className="badges">
                <span className="badge success">★ {b.rating_avg}</span>
                {b.distance_km !== null && <span className="badge">{b.distance_km} km</span>}
                {b.is_verified && <span className="badge accent">Doğrulanmış</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
