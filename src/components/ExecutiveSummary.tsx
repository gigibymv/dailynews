import { useState } from "react";
import { todayBriefing, type BriefingItem } from "@/data/executiveSummaryData";
import { ExternalLink, ArrowRight } from "lucide-react";
import { RefreshButton } from "@/components/RefreshButton";
import { type TldrItem } from "@/data/tldrData";
import { useTldrItems } from "@/hooks/useNewsData";

type BriefTab = "briefing" | "tldr";

function BriefingCard({ item, index }: { item: BriefingItem; index: number }) {
  return (
    <article
      className="border-t border-foreground/20 pt-4 opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="text-[24px] sm:text-[32px] font-display font-normal italic leading-none text-foreground/15 select-none shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0 space-y-3">
          <h3 className="font-display text-[18px] sm:text-[20px] font-bold leading-[1.2] tracking-tight text-foreground">
            {item.title}
          </h3>

          <p className="text-[14px] leading-[1.7] text-muted-foreground">
            {item.analysis}
          </p>

          <div className="border-l-2 border-primary pl-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1 text-primary">
              Strategic Implication
            </p>
            <p className="text-[14px] leading-[1.7] text-foreground/80">
              {item.mvImplication}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {item.sources.map((source, i) => (
              <a
                key={i}
                href={item.sourceUrls[i]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-primary transition-colors"
              >
                {source}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

const tldrCategories = ["all", "headlines", "research", "tools", "launches"] as const;
type TldrCategory = (typeof tldrCategories)[number];

function TldrCard({ item }: { item: TldrItem }) {
  return (
    <article className="border-t border-foreground/20 pt-4">
      <p className="text-[12px] text-muted-foreground mb-2">
        {item.readTime} read
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

function TldrSection() {
  const [activeCategory, setActiveCategory] = useState<TldrCategory>("all");
  const { data: tldrItems = [], refetch, isFetching } = useTldrItems();

  const filtered = activeCategory === "all"
    ? tldrItems
    : tldrItems.filter((item) => item.category === activeCategory);

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
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-muted-foreground">
            Curated from{" "}
            <a href="https://tldr.tech/ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              tldr.tech/ai
            </a>
          </p>
          <RefreshButton onClick={() => refetch()} isFetching={isFetching} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tldrCategories.map((cat) => (
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

      {sections.map((section) => (
        <div key={section.label}>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-foreground italic shrink-0">
              {section.label}
            </h3>
            <div className="flex-1 h-px bg-foreground/20" />
          </div>
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

export function ExecutiveSummary() {
  const [activeSubTab, setActiveSubTab] = useState<BriefTab>("briefing");
  const { date, globalItems, africaItems, africaNoUpdate } = todayBriefing;

  const subTabs: { key: BriefTab; label: string }[] = [
    { key: "briefing", label: "Top Stories" },
    { key: "tldr", label: "TLDR AI" },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div>
        <p className="text-[12px] text-muted-foreground mb-1">{date} · Updated hourly</p>
        <h2 className="font-display text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.1]">
          Daily Brief
        </h2>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-4 border-b border-foreground/10 -mb-4">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={`pb-3 text-[13px] font-display font-semibold transition-colors whitespace-nowrap -mb-px ${
              activeSubTab === tab.key
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === "briefing" && (
        <>
          {/* Global Section */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-foreground italic shrink-0">
                global AI — top 5
              </h3>
              <div className="flex-1 h-px bg-foreground/20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {globalItems.map((item, i) => (
                <BriefingCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* Africa Section */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-foreground italic shrink-0">
                african AI — top 5
              </h3>
              <div className="flex-1 h-px bg-foreground/20" />
            </div>
            {africaNoUpdate ? (
              <p className="text-[13px] text-muted-foreground italic">
                No significant verified AI developments in Africa in the past 24 hours.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {africaItems?.map((item, i) => (
                  <BriefingCard key={item.id} item={item} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Sources */}
          <div className="border-t border-foreground/10 pt-4">
            <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
              Sources: Financial Times · Bloomberg · Reuters · TechCrunch · The Verge · TechCabal · Disrupt Africa · African Business · TLDR AI · Official Company Blogs
            </p>
          </div>
        </>
      )}

      {activeSubTab === "tldr" && <TldrSection />}
    </div>
  );
}
