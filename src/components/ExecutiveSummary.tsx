import { todayBriefing, type BriefingItem } from "@/data/executiveSummaryData";
import { ExternalLink } from "lucide-react";

function BriefingCard({ item, index }: { item: BriefingItem; index: number }) {
  const isDark = index % 2 === 0;

  return (
    <div
      className={`p-5 md:p-6 opacity-0 animate-fade-in ${
        isDark ? "bg-card-dark text-card-dark-foreground" : "bg-card-light text-card-light-foreground"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        <span className="text-[28px] md:text-[36px] font-black leading-none tracking-tighter text-primary/25 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0 space-y-3">
          <h3
            className={`text-[14px] md:text-[15px] font-bold leading-snug tracking-tight ${
              isDark ? "text-card-dark-foreground" : "text-card-light-foreground"
            }`}
          >
            {item.title}
          </h3>

          <p
            className={`text-[11px] leading-[1.7] ${
              isDark ? "text-card-dark-foreground/70" : "text-muted-foreground"
            }`}
          >
            {item.analysis}
          </p>

          <div
            className={`border-l-2 border-primary pl-3 py-2 ${
              isDark ? "bg-card-dark-foreground/5" : "bg-primary/5"
            }`}
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] mb-1 text-primary">
              Strategic Implication
            </p>
            <p
              className={`text-[11px] leading-[1.7] ${
                isDark ? "text-card-dark-foreground/80" : "text-foreground/80"
              }`}
            >
              {item.mvImplication}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {item.sources.map((source, i) => (
              <a
                key={i}
                href={item.sourceUrls[i]}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.15em] transition-colors ${
                  isDark
                    ? "text-card-dark-foreground/40 hover:text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {source}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExecutiveSummary() {
  const { date, globalItems, africaItems, africaNoUpdate } = todayBriefing;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card-dark text-card-dark-foreground p-5 md:p-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-primary">
            Executive Briefing
          </p>
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-card-dark-foreground/40">
            {date} · 07:00 AM ET
          </p>
        </div>
        <h2 className="text-[18px] md:text-[22px] font-black tracking-tight text-card-dark-foreground leading-tight">
          Daily AI Intelligence Report
        </h2>
        <p className="text-[10px] text-card-dark-foreground/50 mt-1">
          Verified from 3+ independent sources · Strategy-grade analysis
        </p>
      </div>

      {/* Global Section */}
      <div>
        <div className="bg-card px-5 py-3 border-b border-border">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground">
            🌍 Global AI — Top 5
          </p>
        </div>
        <div className="space-y-[2px]">
          {globalItems.map((item, i) => (
            <BriefingCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Africa Section */}
      <div>
        <div className="bg-card px-5 py-3 border-b border-border">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground">
            🌍 African AI — Top 4
          </p>
        </div>
        {africaNoUpdate ? (
          <div className="bg-card-dark text-card-dark-foreground/60 p-6 text-center">
            <p className="text-[11px] italic">
              No significant verified AI developments in Africa in the past 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-[2px]">
            {africaItems?.map((item, i) => (
              <BriefingCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Sources disclaimer */}
      <div className="bg-card p-4">
        <p className="text-[8px] text-muted-foreground uppercase tracking-[0.2em] font-medium text-center">
          Sources: Financial Times · Bloomberg · Reuters · TechCrunch · The Verge · TechCabal · Disrupt Africa · African Business · TLDR AI · Official Company Blogs
        </p>
      </div>
    </div>
  );
}
