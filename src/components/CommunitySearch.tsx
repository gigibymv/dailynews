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
    <form onSubmit={handleSearch} className="border-t border-foreground/20 pt-4 mb-6">
      <p className="text-[11px] text-muted-foreground mb-3 uppercase tracking-[0.15em]">
        Search GitHub & Reddit
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI agents, frameworks, tools..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-foreground/15 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 border border-foreground text-foreground text-[13px] font-semibold hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          Search
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}
