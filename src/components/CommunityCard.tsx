import { useState } from "react";
import { GitBranch, ArrowUp, MessageSquare, Star, ChevronDown, ExternalLink } from "lucide-react";
import { type CommunityPost } from "@/data/newsData";

export function CommunityCard({ post, index }: { post: CommunityPost; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isGitHub = post.source === "github";
  const isDark = index % 2 === 0;

  return (
    <article
      className={`p-5 opacity-0 animate-fade-in ${
        isDark
          ? "bg-card-dark text-card-dark-foreground"
          : "bg-card-light text-card-light-foreground"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`h-7 w-7 flex items-center justify-center border ${
              isDark ? "border-card-dark-foreground/20" : "border-border"
            }`}>
              {isGitHub ? (
                <GitBranch className={`h-3 w-3 ${isDark ? "text-card-dark-foreground/50" : "text-muted-foreground"}`} />
              ) : (
                <ArrowUp className="h-3 w-3 text-primary" />
              )}
            </div>
            <span className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${
              isDark ? "text-card-dark-foreground/50" : "text-muted-foreground"
            }`}>
              {isGitHub ? "GitHub" : "Reddit"}
            </span>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${
              isDark ? "text-card-dark-foreground/40" : "text-muted-foreground"
            } ${expanded ? "rotate-180" : ""}`}
          />
        </div>

        <p className={`text-[8px] uppercase tracking-[0.15em] mb-2 ${
          isDark ? "text-card-dark-foreground/40" : "text-muted-foreground"
        }`}>
          {isGitHub ? post.repo : post.subreddit}
        </p>

        <h4 className={`text-[15px] font-bold leading-[1.2] tracking-[-0.01em] mb-3 ${
          isDark ? "text-card-dark-foreground" : "text-card-light-foreground"
        }`}>
          {post.title}
        </h4>

        <div className={`flex items-center gap-3 pt-3 border-t text-[9px] uppercase tracking-[0.15em] ${
          isDark ? "border-card-dark-foreground/10 text-card-dark-foreground/40" : "border-border text-muted-foreground"
        }`}>
          <span className={`font-semibold ${isDark ? "text-card-dark-foreground" : "text-card-light-foreground"}`}>
            {post.author}
          </span>
          <span>{post.timeAgo}</span>
          <span className="ml-auto flex items-center gap-1 normal-case tracking-normal text-xs font-bold">
            {isGitHub ? (
              <><Star className="h-3 w-3 text-primary" />{post.stars?.toLocaleString()}</>
            ) : (
              <><ArrowUp className="h-3 w-3 text-primary" />{post.upvotes?.toLocaleString()}</>
            )}
          </span>
          <span className="flex items-center gap-1 normal-case tracking-normal text-xs">
            <MessageSquare className="h-3 w-3" />{post.comments}
          </span>
        </div>
      </div>

      {expanded && (
        <div className={`mt-4 pt-4 border-t animate-fade-in ${
          isDark ? "border-card-dark-foreground/10" : "border-border"
        }`}>
          <p className={`text-[13px] leading-[1.6] mb-4 ${
            isDark ? "text-card-dark-foreground" : "text-card-light-foreground"
          }`}>
            {post.description}
          </p>

          {/* How it helps */}
          <div className={`border-l-2 border-primary pl-3 py-2 mb-4 ${
            isDark ? "bg-white/5" : "bg-primary/5"
          }`}>
            <p className={`text-[9px] font-semibold uppercase tracking-[0.2em] mb-1 text-primary`}>
              How This Helps You
            </p>
            <p className={`text-[12px] leading-[1.6] font-outfit ${
              isDark ? "text-card-dark-foreground/80" : "text-foreground/80"
            }`}>
              {post.howItHelps}
            </p>
          </div>

          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary hover:opacity-70 transition-opacity"
          >
            {isGitHub ? "View on GitHub" : "View on Reddit"}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </article>
  );
}
