import { useState } from "react";
import { ArrowUp, Star, Heart, ArrowRight, Zap, Wrench, Bookmark } from "lucide-react";
import { type UseCasePost } from "@/data/useCaseData";

function sourceLabel(source: string) {
  if (source === "reddit") return "Reddit";
  if (source === "linkedin") return "LinkedIn";
  return "GitHub";
}

function sourceSub(post: UseCasePost) {
  if (post.source === "reddit") return post.subreddit;
  if (post.source === "linkedin") return post.profileTitle;
  return post.repo;
}

function engagementInfo(post: UseCasePost) {
  if (post.source === "reddit") return { icon: <ArrowUp className="h-3 w-3 text-primary" />, count: post.upvotes?.toLocaleString() };
  if (post.source === "linkedin") return { icon: <Heart className="h-3 w-3 text-primary" />, count: post.likes?.toLocaleString() };
  return { icon: <Star className="h-3 w-3 text-primary" />, count: post.stars?.toLocaleString() };
}

export function UseCaseCard({ post, index, isBookmarked, onToggleBookmark }: { post: UseCasePost; index: number; isBookmarked?: boolean; onToggleBookmark?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const engagement = engagementInfo(post);

  return (
    <article
      className="border-t border-foreground/20 pt-4 opacity-0 animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
        <span className="font-semibold text-primary uppercase tracking-[0.1em]">{sourceLabel(post.source)}</span>
        <span>·</span>
        <span>{sourceSub(post)}</span>
        <span>·</span>
        <span>{post.timeAgo}</span>
      </div>

      <h4 className="font-display text-[18px] sm:text-[20px] font-bold leading-[1.2] tracking-tight text-foreground mb-3">
        {post.title}
      </h4>

      {/* Productivity gain — expandable */}
      {expanded && (
        <div className="flex items-start gap-2 mb-3 border-l-2 border-primary pl-3 py-1 animate-fade-in">
          <Zap className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] mb-1 text-primary">Key Takeaways</p>
            <p className="text-[12px] leading-[1.5] font-medium text-foreground/80">
              {post.productivityGain}
            </p>
          </div>
        </div>
      )}

      <p className="text-[13px] leading-[1.7] text-muted-foreground mb-3">
        {post.summary}
      </p>

      {/* Tools */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <Wrench className="h-3 w-3 text-muted-foreground shrink-0" />
        {post.toolsUsed.map((tool) => (
          <span key={tool} className="text-[10px] text-muted-foreground">
            {tool}{post.toolsUsed.indexOf(tool) < post.toolsUsed.length - 1 ? " ·" : ""}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-foreground/10">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">{post.author}</span>
          <span className="flex items-center gap-1 font-semibold">{engagement.icon}{engagement.count}</span>
          <span className="text-[10px]">{expanded ? "collapse" : "tap for details"}</span>
        </div>
        <div className="flex items-center gap-3">
          {onToggleBookmark && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
              className="p-1 text-muted-foreground hover:text-primary transition-colors"
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
            </button>
          )}
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground hover:text-primary transition-colors"
          >
            read more
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
