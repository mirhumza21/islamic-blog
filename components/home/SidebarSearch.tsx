"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SidebarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-4"
      role="search"
    >
      <label htmlFor="sidebar-search" className="text-sm font-semibold text-foreground">
        Search articles
      </label>
      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            id="sidebar-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find guidance…"
            className="pl-10"
          />
        </div>
        <Button type="submit" aria-label="Search">
          Search
        </Button>
      </div>
    </form>
  );
}
