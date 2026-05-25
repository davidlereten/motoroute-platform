import Link from "next/link";
import type { VehicleSearchResult } from "@/types/motoroute";

export function VehicleResultCard({ item }: { item: VehicleSearchResult }) {
  const href = item.trim_id ? `/vehicle/${item.trim_id}` : item.generation_id ? `/vehicles?generation=${item.generation_id}` : `/brands`;
  return (
    <Link className="result" href={href}>
      <div className="result-icon">{item.brand_name?.slice(0, 2).toUpperCase()}</div>
      <div className="result-main">
        <div className="result-title">{item.title}</div>
        <div className="result-subtitle">{item.subtitle || "Katalog kaydı"}</div>
        <div className="badges">
          <span className="badge accent">{item.result_type}</span>
          {item.generation_code && <span className="badge">Kasa: {item.generation_code}</span>}
          {item.trim_name && <span className="badge success">Versiyon: {item.trim_name}</span>}
        </div>
      </div>
    </Link>
  );
}
