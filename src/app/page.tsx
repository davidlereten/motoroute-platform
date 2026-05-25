"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck, Wrench, Database, MapPin, Gauge, Cpu, BadgeCheck } from "lucide-react";
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

const moduleCards = [
  { href: "/vehicles?q=bmw%20e46", icon: Database, title: "Araç Kataloğu", text: "Marka, model, kasa kodu, jenerasyon, motor ve trim bazlı arama." },
  { href: "/parts?q=DEMO-E46-FRONT-PAD", icon: Cpu, title: "Parça Kodu", text: "OE/OEM, muadil kod, uyumluluk ve parçacı stok sonuçları." },
  { href: "/businesses?q=bmw%20e46%20mekanik", icon: Wrench, title: "Servis Ağı", text: "Tamirci, parçacı, kaportacı ve uzman servisleri araç bazında bul." },
  { href: "/compare", icon: Gauge, title: "Karşılaştırma", text: "Teknik verileri aynı tabloda karşılaştırmaya hazır altyapı." }
];

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
    <main className="pro-page">
      <EnvNotice />

      <section className="pro-hero">
        <div className="pro-hero-inner">
          <div className="pro-hero-copy">
            <div className="pro-kicker"><span>MotoRoute v0.4 PRO</span><b>Canlı Supabase verisi</b></div>
            <h1>Türkiye odaklı araç bilgi, parça ve servis ağı.</h1>
            <p>
              Satış ilanı değil; BMW E46’den Saab 9-3’e, Golf Mk4’ten Ibiza KJ1’e kadar marka, model, kasa kodu,
              teknik veri, parça kodu ve uzman servis eşleştirme platformu.
            </p>
            <div className="pro-search-shell">
              <SearchPanel />
            </div>
            <div className="quick-actions">
              <Link href="/vehicles?q=bmw%20e46" className="btn accent"><Search size={18}/> BMW E46 ara</Link>
              <Link href="/parts?q=34116761244" className="btn secondary">OE kodu dene</Link>
              <Link href="/businesses?q=bmw%20e46%20mekanik" className="btn secondary">Yakın servis bul</Link>
            </div>
          </div>

          <aside className="live-panel">
            <div className="live-panel-head">
              <span>Canlı katalog</span>
              <BadgeCheck size={18}/>
            </div>
            <div className="live-stat"><small>Marka</small><strong>{summary?.brand_count ?? "—"}</strong></div>
            <div className="live-stat"><small>Model</small><strong>{summary?.model_count ?? "—"}</strong></div>
            <div className="live-stat"><small>Kasa/Jenerasyon</small><strong>{summary?.generation_count ?? "—"}</strong></div>
            <div className="live-stat"><small>Versiyon/Trim</small><strong>{summary?.trim_count ?? "—"}</strong></div>
            <div className="live-note"><ShieldCheck size={16}/> DB + arama + parçacı/tamirci modülü aktif.</div>
          </aside>
        </div>
      </section>

      <section className="container pro-section module-overview">
        {moduleCards.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} className="pro-module-card" key={item.title}>
              <span className="pro-module-icon"><Icon size={22}/></span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </Link>
          );
        })}
      </section>

      <section className="container pro-section split-layout">
        <div className="pro-card big-card">
          <div className="card-toolbar">
            <div>
              <span className="label-red">Araç kataloğu</span>
              <h2>BMW E46 canlı sonuçları</h2>
            </div>
            <Link href="/vehicles?q=bmw%20e46" className="small-link">Tümünü aç</Link>
          </div>
          <div className="vehicle-table-like">
            {vehicles.map((vehicle, index) => (
              <Link className="vehicle-line" href={vehicle.trim_id ? `/vehicle/${vehicle.trim_id}` : `/vehicles?q=${encodeURIComponent(vehicle.title)}`} key={`${vehicle.title}-${index}`}>
                <span className="code-pill">{vehicle.generation_code || vehicle.result_type}</span>
                <span className="line-main"><b>{vehicle.title}</b><small>{vehicle.subtitle || "Teknik katalog kaydı"}</small></span>
                <span className="line-type">{vehicle.result_type}</span>
              </Link>
            ))}
            {vehicles.length === 0 && <div className="empty-state">Araç sonucu yükleniyor veya Supabase yanıtı boş.</div>}
          </div>
        </div>

        <div className="pro-card big-card">
          <div className="card-toolbar">
            <div>
              <span className="label-red">Servis ağı</span>
              <h2>Yakındaki işletmeler</h2>
            </div>
            <Link href="/businesses" className="small-link">İşletme ara</Link>
          </div>
          <div className="business-list-pro">
            {businesses.map((business) => (
              <Link href="/businesses" className="business-line-pro" key={business.business_id}>
                <span className="business-avatar">{business.account_type === "parts_dealer" ? "PA" : "SR"}</span>
                <span className="line-main"><b>{business.business_name}</b><small>{business.short_description_tr}</small></span>
                <span className="distance"><MapPin size={13}/>{business.distance_km !== null ? `${business.distance_km} km` : "—"}</span>
              </Link>
            ))}
            {businesses.length === 0 && <div className="empty-state">İşletme sonucu yükleniyor veya Supabase yanıtı boş.</div>}
          </div>
        </div>
      </section>

      <section className="container pro-section">
        <div className="section-head pro-head">
          <div>
            <span className="label-red">Marka profilleri</span>
            <h2 className="section-title">Popüler markalar ve model ağacı</h2>
            <p className="section-subtitle">Menşei, model sayısı, kasa/jenerasyon ve trim dağılımı.</p>
          </div>
          <Link className="btn secondary" href="/brands">Tüm markalar</Link>
        </div>
        <div className="brand-board">
          {brands.map((brand) => (
            <Link className="brand-pro-card" href={`/brands/${brand.brand_slug}`} key={brand.brand_id}>
              <div className="brand-topline">
                <span className="brand-logo-placeholder">{brand.brand_name.slice(0, 2).toUpperCase()}</span>
                <span>{brand.flag_emoji || ""}</span>
              </div>
              <strong>{brand.brand_name}</strong>
              <small>{brand.origin_country_tr || "Menşei bilinmiyor"}</small>
              <div className="brand-metrics"><span>{brand.model_count} model</span><span>{brand.generation_count} kasa</span><span>{brand.trim_count} trim</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container pro-section roadmap-band">
        <div>
          <span className="label-red">Sonraki geliştirme</span>
          <h2>v0.5’te araç detay ekranını teknik tablo merkezli büyüteceğiz.</h2>
          <p>Genel bakış, motor/performans, yakıt, boyutlar, şanzıman, üretim ve parça uyumluluğu aynı sayfada toplanacak.</p>
        </div>
        <Link className="btn accent" href="/compare">Karşılaştırmayı aç</Link>
      </section>
    </main>
  );
}
