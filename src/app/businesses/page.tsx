"use client";

import { FormEvent, useEffect, useState } from "react";
import { EnvNotice } from "@/components/EnvNotice";
import { getSupabase } from "@/lib/supabase";
import type { BusinessResult } from "@/types/motoroute";

export default function BusinessesPage() {
  const [q, setQ] = useState("bmw e46 mekanik");
  const [type, setType] = useState<string>("");
  const [items, setItems] = useState<BusinessResult[]>([]);

  async function search(query = q, accountType = type) {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase.rpc("search_businesses_v2", {
      q: query,
      user_lat: 41.025,
      user_lng: 29.045,
      p_account_type: accountType || null,
      limit_count: 40
    });
    setItems((data || []) as BusinessResult[]);
  }

  useEffect(() => { search("bmw e46 mekanik", ""); }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    search();
  }

  return (
    <main className="container">
      <EnvNotice />
      <section className="section-head section">
        <div><h1 className="section-title">Tamirci / Parçacı</h1><p className="section-subtitle">Konuma, uzmanlığa, marka/model/kasa ve motor koduna göre işletme arama.</p></div>
      </section>
      <form className="search-panel" onSubmit={submit}>
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="BMW E46 mekanik, parça, kaporta, M54..." />
        <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tüm işletmeler</option>
          <option value="mechanic">Tamirci</option>
          <option value="parts_dealer">Parçacı</option>
          <option value="body_shop">Kaporta/Boya</option>
          <option value="service">Servis</option>
        </select>
        <button className="btn">İşletme ara</button>
      </form>
      <section className="grid grid-3 section">
        {items.map((b) => (
          <div className="card" key={b.business_id}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div>
                <h3 className="card-title">{b.business_name}</h3>
                <p className="card-subtitle">{b.city} / {b.district} • {b.short_description_tr}</p>
              </div>
            </div>
            <div className="badges">
              <span className="badge success">★ {b.rating_avg} ({b.review_count})</span>
              {b.distance_km !== null && <span className="badge">{b.distance_km} km</span>}
              <span className="badge accent">{b.account_type}</span>
              {b.is_verified && <span className="badge success">Doğrulanmış</span>}
            </div>
            <div className="badges">
              {(b.service_names_tr || []).slice(0, 5).map((s) => <span className="badge" key={s}>{s}</span>)}
            </div>
            <div className="badges">
              {(b.supported_brands || []).slice(0, 6).map((s) => <span className="badge" key={s}>{s}</span>)}
              {(b.supported_generation_codes || []).slice(0, 6).map((s) => <span className="badge accent" key={s}>{s}</span>)}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
