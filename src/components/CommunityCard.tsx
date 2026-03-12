import { useState } from "react";
import { GitBranch, ArrowUp, MessageSquare, Star, ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { type CommunityPost } from "@/data/newsData";
import { useBookmarks } from "@/hooks/useBookmarks";

export function CommunityCard({ post, index }: { post: CommunityPost; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const isGitHub = post.source === "github";
  const bookmarked = isBookmarked(post.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark({
      id: post.id,
      category: "community",
      title: post.title,
      url: post.url,
      source: post.source,
      data: post,
    });
  };

  return (
    <article
      className="border-t border-foreground/20 pt-4 opacity-0 animate-fade-in cursor-pointer group"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-semibold text-primary uppercase tracking-[0.1em]">
            {isGitHub ? "GitHub" : "Reddit"}
          </span>
          <span>·</span>
          <span>{isGitHub ? post.repo : post.subreddit}</span>
          <span>·</span>
          <span>{post.timeAgo}</span>
        </div>
        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-full transition-colors ${
            bookmarked 
              ? "text-primary bg-primary/10" 
              : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 opacity-0 group-hover:opacity-100"
          }`}
          title={bookmarked ? "Remove bookmark" : "Save for later"}
        >
          {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        </button>
      </div>

      <h4 className="font-display text-[18px] sm:text-[20px] font-bold leading-[1.2] tracking-tight text-foreground mb-3">
        {post.title}
      </h4>

      <p className="text-[13px] leading-[1.7] text-muted-foreground mb-3">
        {post.description}
      </p>

      {/* How it helps — expandable */}
      {expanded && (
        <div className="border-l-2 border-primary pl-3 py-1 mb-3 animate-fade-in">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] mb-1 text-primary">
            How This Helps You
          </p>
          <p className="text-[12px] leading-[1.6] text-foreground/80">
            {post.howItHelps}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-foreground/10">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">{post.author}</span>
          <span className="flex items-center gap-1 font-semibold">
            {isGitHub ? <Star className="h-3 w-3 text-primary" /> : <ArrowUp className="h-3 w-3 text-primary" />}
            {isGitHub ? post.stars?.toLocaleString() : post.upvotes?.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />{post.comments}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">{expanded ? "collapse" : "tap for details"}</span>
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
    </article>
  );
}
