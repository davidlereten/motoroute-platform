"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EnvNotice } from "@/components/EnvNotice";
import { getSupabase } from "@/lib/supabase";
import type { VehicleDetail, VehicleSpec } from "@/types/motoroute";

export default function VehicleDetailPage() {
  const params = useParams<{ trimId: string }>();
  const [detail, setDetail] = useState<VehicleDetail | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !params.trimId) return;
    supabase.from("v_vehicle_detail_full").select("*").eq("trim_id", params.trimId).maybeSingle().then(({ data }) => setDetail(data as VehicleDetail | null));
  }, [params.trimId]);

  const groups = useMemo(() => {
    const map = new Map<string, VehicleSpec[]>();
    for (const spec of detail?.specs_json || []) {
      const key = spec.group_name_tr || "Teknik Bilgi";
      map.set(key, [...(map.get(key) || []), spec]);
    }
    return Array.from(map.entries());
  }, [detail]);

  return (
    <main className="container">
      <EnvNotice />
      {!detail ? <div className="alert section">Araç detayı yükleniyor veya kayıt bulunamadı.</div> : (
        <>
          <section className="hero section">
            <div className="eyebrow">Araç detay</div>
            <h1 className="h1">{detail.brand_name} {detail.model_name} {detail.generation_code} {detail.trim_name}</h1>
            <p className="lead">{detail.brand_country_flag || ""} {detail.brand_country_tr || ""} • {detail.fuel || "yakıt"} • {detail.engine_code || "motor kodu"} • {detail.power_hp ? `${detail.power_hp} HP` : "güç bilgisi"}</p>
            <div className="stat-grid">
              <div className="stat"><strong>{detail.power_hp ?? "—"}</strong><span>HP</span></div>
              <div className="stat"><strong>{detail.torque_nm ?? "—"}</strong><span>Nm</span></div>
              <div className="stat"><strong>{detail.zero_to_100_kmh_sec ?? "—"}</strong><span>0-100 sn</span></div>
              <div className="stat"><strong>{detail.top_speed_kmh ?? "—"}</strong><span>km/s</span></div>
            </div>
          </section>
          <section className="grid grid-2 section">
            {groups.map(([group, specs]) => (
              <div className="card" key={group}>
                <h2 className="card-title">{group}</h2>
                <table className="table">
                  <tbody>
                    {specs.map((spec) => (
                      <tr key={`${group}-${spec.label_key}-${spec.sort_order}`}>
                        <th>{spec.label_tr}</th>
                        <td>{spec.value_text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
