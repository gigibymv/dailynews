import { useState } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { RefreshButton } from "@/components/RefreshButton";
import { type TldrItem } from "@/data/tldrData";
import { useTldrItems } from "@/hooks/useNewsData";

const categories = ["all", "headlines", "research", "tools", "launches"] as const;
type Category = (typeof categories)[number];

function TldrCard({ item }: { item: TldrItem }) {
  return (
    <article className="border-t border-foreground/20 pt-4">
      <p className="text-[12px] text-muted-foreground mb-2">
        March 11, 2026 · {item.readTime} read
      </p>

      <h4 className="font-display text-[18px] sm:text-[20px] font-bold leading-[1.2] tracking-tight text-foreground mb-3">
        {item.title}
      </h4>

      <p className="text-[14px] leading-[1.7] text-muted-foreground mb-4">
        {item.summary}
      </p>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-foreground hover:text-primary transition-colors"
      >
        read more
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </article>
  );
}

export function TldrFeed() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const { data: tldrItems = [], refetch: refetchTldr, isFetching: isFetchingTldr } = useTldrItems();

  const filtered = activeCategory === "all"
    ? tldrItems
    : tldrItems.filter((item) => item.category === activeCategory);

  // Group items by category for section display
  const headlines = filtered.filter((i) => i.category === "headlines");
  const research = filtered.filter((i) => i.category === "research");
  const tools = filtered.filter((i) => i.category === "tools");
  const launches = filtered.filter((i) => i.category === "launches");

  const sections = activeCategory === "all"
    ? [
        { label: "headlines", items: headlines },
        { label: "research & analysis", items: research },
        { label: "tools & repos", items: tools },
        { label: "launches", items: launches },
      ].filter((s) => s.items.length > 0)
    : [{ label: activeCategory, items: filtered }];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-primary mb-1">
          TLDR AI · Daily Digest
        </p>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[24px] sm:text-[28px] font-bold tracking-tight text-foreground leading-tight">
            Today's AI News in 5 Minutes
          </h2>
          <RefreshButton onClick={() => refetchTldr()} isFetching={isFetchingTldr} />
        </div>
        <p className="text-[12px] text-muted-foreground mt-1">
          Curated from{" "}
          <a
            href="https://tldr.tech/ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            tldr.tech/ai
          </a>
          {" "}· March 11, 2026
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-[10px] font-display font-semibold uppercase tracking-[0.12em] transition-colors rounded-lg ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.label}>
          {/* Section header with line */}
          <div className="flex items-center gap-4 mb-6">
            <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-foreground italic shrink-0">
              {section.label}
            </h3>
            <div className="flex-1 h-px bg-foreground/20" />
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {section.items.map((item) => (
              <TldrCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
