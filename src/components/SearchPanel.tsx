"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchPanel({ placeholder = "BMW E46, Golf Mk4, fren balata, parça kodu..." }: { placeholder?: string }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit(event: FormEvent) {
    event.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form className="search-panel" onSubmit={submit}>
      <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} />
      <button className="btn" type="submit"><Search size={18} /> Ara</button>
    </form>
  );
}
