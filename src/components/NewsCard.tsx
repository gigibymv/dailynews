import { useState } from "react";
import { type NewsItem } from "@/data/newsData";
import { ChevronDown, ExternalLink, ArrowRight } from "lucide-react";

export function HeadlineCard({ item }: { item: NewsItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="bg-card-dark text-card-dark-foreground p-6 md:p-8 relative overflow-hidden">
      <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-card-dark-foreground/50">
              {item.category}
            </span>
            {item.isBreaking && (
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary animate-pulse">
                Breaking
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-card-dark-foreground/40 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>

        {/* Big number */}
        <div className="absolute right-6 top-16 hidden md:block pointer-events-none select-none">
          <span className="text-[80px] font-black text-primary/15 leading-none">01</span>
        </div>

        <h2 className="text-[26px] md:text-[36px] font-bold leading-[1.08] tracking-[-0.02em] text-card-dark-foreground mb-5 max-w-[85%]">
          {item.title}
        </h2>

        <p className="text-[12px] text-card-dark-foreground/60 leading-[1.7] max-w-lg">
          {item.summary}
        </p>

        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-card-dark-foreground/10">
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-card-dark-foreground">{item.source}</span>
          <span className="text-[9px] text-card-dark-foreground/40 uppercase tracking-[0.15em]">{item.timeAgo}</span>
          <span className="ml-auto text-[9px] text-card-dark-foreground/30 uppercase tracking-[0.15em]">
            Click to expand
          </span>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-card-dark-foreground/10 animate-fade-in">
          <h4 className="text-[9px] font-semibold uppercase tracking-[0.3em] text-primary mb-5">
            Key Takeaways
          </h4>
          <ul className="space-y-3 mb-6">
            {item.takeaways.map((t, i) => (
              <li key={i} className="flex gap-3 text-[13px] text-card-dark-foreground leading-[1.6]">
                <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0 mt-1" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary hover:opacity-70 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            Read on {item.source}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </article>
  );
}

export function StoryRow({ item, index }: { item: NewsItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isDark = index % 2 === 0;

  return (
    <article
      className={`p-5 opacity-0 animate-fade-in transition-colors ${
        isDark
          ? "bg-card-dark text-card-dark-foreground"
          : "bg-card-light text-card-light-foreground"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between mb-2">
          <span className={`text-[9px] font-semibold uppercase tracking-[0.25em] ${
            isDark ? "text-card-dark-foreground/50" : "text-muted-foreground"
          }`}>
            {item.category}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              isDark ? "text-card-dark-foreground/40" : "text-muted-foreground"
            } ${expanded ? "rotate-180" : ""}`}
          />
        </div>

        <span className="text-3xl font-black text-primary/20 leading-none block mb-2 select-none">
          {String(index + 2).padStart(2, "0")}
        </span>

        <h3 className={`text-[16px] font-bold leading-[1.2] tracking-[-0.01em] mb-2 ${
          isDark ? "text-card-dark-foreground" : "text-card-light-foreground"
        }`}>
          {item.title}
        </h3>

        <p className={`text-[11px] leading-[1.7] line-clamp-2 ${
          isDark ? "text-card-dark-foreground/50" : "text-muted-foreground"
        }`}>
          {item.summary}
        </p>

        <div className={`flex items-center gap-3 mt-4 pt-3 border-t text-[9px] uppercase tracking-[0.2em] ${
          isDark ? "border-card-dark-foreground/10 text-card-dark-foreground/40" : "border-border text-muted-foreground"
        }`}>
          <span className={`font-semibold ${isDark ? "text-card-dark-foreground" : "text-card-light-foreground"}`}>
            {item.source}
          </span>
          <span>{item.timeAgo}</span>
        </div>
      </div>

      {expanded && (
        <div className={`mt-4 pt-4 border-t animate-fade-in ${
          isDark ? "border-card-dark-foreground/10" : "border-border"
        }`}>
          <h4 className="text-[9px] font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            Key Takeaways
          </h4>
          <ul className="space-y-2 mb-4">
            {item.takeaways.map((t, i) => (
              <li key={i} className={`flex gap-2.5 text-[13px] leading-[1.6] ${
                isDark ? "text-card-dark-foreground" : "text-card-light-foreground"
              }`}>
                <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0 mt-1" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary hover:opacity-70 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            Read on {item.source}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </article>
  );
}
