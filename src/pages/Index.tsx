import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Menu, X } from "lucide-react";
import { mockNews, mockCommunityPosts, type NewsCategory } from "@/data/newsData";
import { HeadlineCard, StoryRow } from "@/components/NewsCard";
import { CommunityCard } from "@/components/CommunityCard";
import { CommunitySearch } from "@/components/CommunitySearch";
import { CategoryFilter } from "@/components/CategoryFilter";
import { AppSidebar } from "@/components/AppSidebar";
import { ExecutiveSummary } from "@/components/ExecutiveSummary";

type Tab = "briefing" | "news" | "community";

const tabs: { key: Tab; label: string }[] = [
  { key: "briefing", label: "Executive Summary" },
  { key: "news", label: "AI News" },
  { key: "community", label: "GitHub & Reddit" },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("briefing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(
    () => activeCategory ? mockNews.filter((n) => n.category === activeCategory) : mockNews,
    [activeCategory]
  );

  // Simple global search across news titles
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return filtered;
    const q = searchQuery.toLowerCase();
    return filtered.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
  }, [filtered, searchQuery]);

  const headline = searchFiltered[0];
  const rest = searchFiltered.slice(1);

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }} />

      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="border-b border-border px-4 md:px-8 py-3 flex items-center justify-between bg-card sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/50 lg:hidden">
              MV Intelligence
            </p>
            <time className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.25em] hidden sm:block">
              {format(new Date(), "EEE, MMM d, yyyy")}
            </time>
          </div>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-[11px] bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-all w-48"
            />
          </div>
        </div>

        {/* Mobile navigation dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-border bg-card animate-fade-in">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setMobileMenuOpen(false); }}
                className={`w-full text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                  activeTab === tab.key
                    ? "text-foreground bg-secondary border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="p-3 md:p-4">
          {/* Tabs */}
          <div className="flex items-center gap-[2px] mb-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Executive Summary tab */}
          {activeTab === "briefing" && <ExecutiveSummary />}

          {/* News tab */}
          {activeTab === "news" && (
            <div className="space-y-3">
              <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />
              {headline && <HeadlineCard item={headline} />}
              <div className="grid sm:grid-cols-2 gap-[3px]">
                {rest.map((item, i) => (
                  <StoryRow key={item.id} item={item} index={i} />
                ))}
              </div>
              {searchFiltered.length === 0 && (
                <div className="bg-card p-12 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    {searchQuery ? "No stories match your search." : "No stories in this category today."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Community tab */}
          {activeTab === "community" && (
            <div className="space-y-3">
              <CommunitySearch />
              <div className="grid sm:grid-cols-2 gap-[3px]">
                {mockCommunityPosts.map((post, i) => (
                  <CommunityCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-10 pt-4 border-t border-border flex items-center justify-between pb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              MV Intelligence
            </p>
            <p className="text-[8px] text-muted-foreground uppercase tracking-[0.3em] font-medium">
              ©2026 · Daily at 7:00 AM EST
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
