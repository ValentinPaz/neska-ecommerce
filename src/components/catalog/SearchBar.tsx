"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.push(`/catalogo?${params.toString()}`);
    });
  }

  function clear() {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    startTransition(() => {
      router.push(`/catalogo?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={submit} className="relative flex items-center">
      <Search
        className="absolute left-3 h-3.5 w-3.5 text-[#B8A79B] pointer-events-none"
        strokeWidth={1.5}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar productos…"
        className={`pl-8 pr-8 py-2 text-sm border border-[#DCCBB8] rounded bg-white text-[#6E5C52] placeholder:text-[#B8A79B] focus:outline-none focus:border-[#C8A86B] transition-colors w-44 focus:w-56 transition-all ${isPending ? "opacity-60" : ""}`}
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2.5 text-[#B8A79B] hover:text-[#6E5C52] transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </form>
  );
}
