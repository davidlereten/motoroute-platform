"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EnvNotice } from "@/components/EnvNotice";
import { SearchPanel } from "@/components/SearchPanel";
import { getSupabase } from "@/lib/supabase";
import type { BrandProfile, BusinessResult, CatalogSummary } from "@/types/motoroute";

type VehicleMini = {
  result_type: string;
  title: string;
  subtitle: string | null;
  trim_id: string | null;
  generation_code: string | null;
  brand_name: string | null;
  model_name: string | null;
};

export default function HomePage() {
  const [summary, setSummary] = useState<CatalogSummary | null>(null);
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [businesses, setBusinesses] = useState<BusinessResult[]>([]);
  const [vehicles, setVehicles] = useState<VehicleMini[]>([]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.from("v_catalog_summary").select("*").maybeSingle().then(({ data }) => setSummary(data as CatalogSummary | null));
    supabase.from("v_brand_profiles").select("*").order("model_count", { ascending: false }).limit(8).then(({ data }) => setBrands((data || []) as BrandProfile[]));
    supabase.rpc("search_vehicle_catalog_v2", { q: "bmw e46", limit_count: 6 }).then(({ data }) => setVehicles((data || []) as VehicleMini[]));
    supabase.rpc("search_businesses_v2", {
      q: "bmw e46 mekanik",
      user_lat: 41.025,
      user_lng: 29.045,
      p_account_type: null,
      limit_count: 3
    }).then(({ data }) => setBusinesses((data || []) as BusinessResult[]));
  }, []);

  return (
    <main>
      <EnvNotice />
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">MotoRoute v0.3 • Araç bilgi ve servis ağı</div>
            <h1 className="h1">Araç kataloğu, parça kodu ve uzman servis tek ekranda.</h1>
            <p className="lead">
              Satış/ilan sitesi değil; marka profili, kasa kodu, teknik veri, parça uyumluluğu ve tamirci/parçacı bulma altyapısı.
            </p>
            <SearchPanel />
            <div className="hero-actions">
              <Link className="btn accent" href="/vehicles?q=bmw%20e46">Araç katalog</Link>
              <Link className="btn secondary dark-btn" href="/parts?q=DEMO-E46-FRONT-PAD">Parça kodu dene</Link>
              <Link className="btn secondary dark-btn" href="/businesses?q=bmw%20e46%20mekanik">Servis bul</Link>
            </div>
          </div>

          <aside className="catalog-panel">
            <div className="panel-head">
              <span>Canlı katalog özeti</span>
              <strong>Supabase</strong>
            </div>
            <div className="metric-row"><span>Marka</span><strong>{summary?.brand_count ?? "—"}</strong></div>
            <div className="metric-row"><span>Model</span><strong>{summary?.model_count ?? "—"}</strong></div>
            <div className="metric-row"><span>Kasa / jenerasyon</span><strong>{summary?.generation_count ?? "—"}</strong></div>
            <div className="metric-row"><span>Versiyon / trim</span><strong>{summary?.trim_count ?? "—"}</strong></div>
            <div className="panel-note">BMW E46, Golf Mk4, Ibiza KJ1, OE parça kodu ve işletme araması aktif.</div>
          </aside>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div>
            <h2 className="section-title">Platform modülleri</h2>
            <p className="section-subtitle">Araç bilgisi, parça arama ve servis ağı ayrı ayrı değil aynı veritabanından çalışır.</p>
          </div>
        </div>
        <div className="module-grid">
          <Link className="module-card" href="/vehicles">
            <span className="module-code">01</span>
            <h3>Araç kataloğu</h3>
            <p>Marka, model, kasa, jenerasyon, motor kodu ve trim araması.</p>
          </Link>
          <Link className="module-card" href="/brands">
            <span className="module-code">02</span>
            <h3>Marka profilleri</h3>
            <p>Menşei, model ağacı, yıllar, kasa kodları ve kategori dağılımı.</p>
          </Link>
          <Link className="module-card" href="/parts">
            <span className="module-code">03</span>
            <h3>Parça kodu</h3>
            <p>OE/OEM, muadil kod, stok ve araç uyumluluğu.</p>
          </Link>
          <Link className="module-card" href="/businesses">
            <span className="module-code">04</span>
            <h3>Tamirci / parçacı</h3>
            <p>Uzmanlık, mesafe, desteklediği marka-kasa-motor bilgisi.</p>
          </Link>
        </div>
      </section>

      <section className="container section two-col">
        <div>
          <div className="section-head slim">
            <div>
              <h2 className="section-title">Örnek araç sonuçları</h2>
              <p className="section-subtitle">Canlı arama fonksiyonu: bmw e46</p>
            </div>
            <Link className="btn secondary" href="/vehicles?q=bmw%20e46">Tümünü aç</Link>
          </div>
          <div className="dense-list">
            {vehicles.map((v, i) => (
              <Link className="dense-row" href={v.trim_id ? `/vehicle/${v.trim_id}` : `/vehicles?q=${encodeURIComponent(v.title)}`} key={`${v.title}-${i}`}>
                <span className="dense-icon">{v.generation_code || "MR"}</span>
                <span><strong>{v.title}</strong><small>{v.subtitle || "Teknik katalog kaydı"}</small></span>
                <em>{v.result_type}</em>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="section-head slim">
            <div>
              <h2 className="section-title">Yakındaki işletmeler</h2>
              <p className="section-subtitle">Demo konum: İstanbul / Anadolu yakası</p>
            </div>
            <Link className="btn secondary" href="/businesses">Ara</Link>
          </div>
          <div className="dense-list">
            {businesses.map((b) => (
              <Link className="dense-row business" href="/businesses" key={b.business_id}>
                <span className="dense-icon">{b.account_type === "parts_dealer" ? "PA" : "SR"}</span>
                <span><strong>{b.business_name}</strong><small>{b.short_description_tr}</small></span>
                <em>{b.distance_km !== null ? `${b.distance_km} km` : "—"}</em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div>
            <h2 className="section-title">Popüler markalar</h2>
            <p className="section-subtitle">Marka profili, ülke, model sayısı ve kasa sayısı.</p>
          </div>
          <Link className="btn secondary" href="/brands">Tüm markalar</Link>
        </div>
        <div className="brand-strip">
          {brands.map((brand) => (
            <Link className="brand-tile" href={`/brands/${brand.brand_slug}`} key={brand.brand_id}>
              <span className="brand-symbol">{brand.logo_url ? "◎" : brand.brand_name.slice(0, 2).toUpperCase()}</span>
              <strong>{brand.flag_emoji || ""} {brand.brand_name}</strong>
              <small>{brand.origin_country_tr || "Menşei"} • {brand.model_count} model</small>
              <div><b>{brand.generation_count}</b> kasa <b>{brand.trim_count}</b> trim</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section compare-band">
        <div>
          <span className="eyebrow light">Sıradaki modül</span>
          <h2>Teknik tablo ve karşılaştırma ekranı büyütülecek.</h2>
          <p>Şu an DB tarafında teknik veri view’ları hazır. Sonraki aşamada araç detay sayfasını sahibinden/arabam benzeri teknik tablo düzenine taşıyoruz.</p>
        </div>
        <Link className="btn accent" href="/compare">Karşılaştırmayı aç</Link>
      </section>
    </main>
  );
}
