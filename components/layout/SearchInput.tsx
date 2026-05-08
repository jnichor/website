"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({ className, autoFocus }: SearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = value.trim();
    if (q.length === 0) return;
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={"relative w-full " + (className ?? "")}
      aria-label="Buscar productos"
    >
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar productos, marcas, SKU…"
        className="pl-9"
        aria-label="Término de búsqueda"
        autoFocus={autoFocus}
      />
    </form>
  );
}
