import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";

export function CommunitySearch() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log("Searching:", query);
  };

  return (
    <form onSubmit={handleSearch} className="bg-card-dark p-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-card-dark-foreground/50 mb-3">
        Search GitHub & Reddit
      </p>
      <div className="flex gap-[2px]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-card-dark-foreground/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI agents, frameworks, tools..."
            className="w-full pl-9 pr-4 py-2.5 text-[12px] bg-card-dark-foreground/10 text-card-dark-foreground placeholder:text-card-dark-foreground/30 outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          Search
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <p className="text-[8px] text-card-dark-foreground/30 mt-2 uppercase tracking-[0.15em]">
        Find the best threads, repos, and discussions related to AI agents
      </p>
    </form>
  );
}
