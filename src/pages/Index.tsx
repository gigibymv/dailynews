import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { Search, Menu, X, Bookmark } from "lucide-react";
import { RefreshButton } from "@/components/RefreshButton";
import { type NewsCategory } from "@/data/newsData";
import { mockUseCases, type UseCasePost } from "@/data/useCaseData";
import { supabase } from "@/integrations/supabase/client";
import { useNewsArticles, useCommunityPosts } from "@/hooks/useNewsData";
import { HeadlineCard, StoryRow } from "@/components/NewsCard";
import { CommunityCard } from "@/components/CommunityCard";
import { CommunitySearch } from "@/components/CommunitySearch";
import { CategoryFilter } from "@/components/CategoryFilter";
import { AppSidebar } from "@/components/AppSidebar";
import { ExecutiveSummary } from "@/components/ExecutiveSummary";
import { UseCaseCard } from "@/components/UseCaseCard";
import { UseCaseSearch } from "@/components/UseCaseSearch";
import { useBookmarks } from "@/hooks/useBookmarks";
type Tab = "briefing" | "news" | "usecases" | "community" | "saved";

const tabs: { key: Tab; label: string }[] = [
  { key: "briefing", label: "Daily Brief" },
  { key: "news", label: "Latest News" },
  { key: "usecases", label: "Use Cases" },
  { key: "community", label: "Community" },
  { key: "saved", label: "Saved" },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("briefing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [useCaseQuery, setUseCaseQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UseCasePost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { isBookmarked, toggleBookmark, getByCategory } = useBookmarks();

  const handleUseCaseSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-use-cases', {
        body: { query },
      });
      if (error) throw error;
      setSearchResults(data?.results || []);
    } catch (err) {
      console.error('Use case search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const { data: newsArticles = [], refetch: refetchNews, isFetching: isFetchingNews } = useNewsArticles();
  const { data: communityPosts = [], refetch: refetchCommunity, isFetching: isFetchingCommunity } = useCommunityPosts();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke('fetch-daily-news');
      if (error) console.error('Refresh failed:', error);
      // Realtime will auto-update, but refetch to be sure
      await Promise.all([refetchNews(), refetchCommunity()]);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchNews, refetchCommunity]);

  const filtered = useMemo(
    () => activeCategory ? newsArticles.filter((n) => n.category === activeCategory) : newsArticles,
    [activeCategory, newsArticles]
  );

  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return filtered;
    const q = searchQuery.toLowerCase();
    return filtered.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
  }, [filtered, searchQuery]);

  const allArticles = searchFiltered;

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }} />

      <main className="flex-1 overflow-auto min-w-0">
        {/* Top bar */}
        <div className="border-b border-foreground/10 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <p className="font-display text-base font-bold text-foreground lg:hidden truncate">
              MV Intelligence
            </p>
            <time className="text-[11px] text-muted-foreground hidden sm:block">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </time>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="sm:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle search"
            >
              <Search className="h-4 w-4" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-foreground/15 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all w-52 bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="sm:hidden border-b border-foreground/10 px-4 py-3 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-foreground/15 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all bg-transparent"
              />
            </div>
          </div>
        )}

        {/* Mobile navigation dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-foreground/10 animate-fade-in">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setMobileMenuOpen(false); }}
                className={`w-full text-left px-5 py-3.5 text-[13px] transition-colors ${
                  activeTab === tab.key
                    ? "text-foreground font-semibold border-l-2 border-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="px-4 sm:px-8 py-6 md:py-8 max-w-6xl">
          {/* Tab nav — editorial underline style */}
          <div className="flex items-center gap-4 sm:gap-6 mb-8 overflow-x-auto no-scrollbar pb-1 border-b border-foreground/10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-[13px] font-display font-semibold transition-colors whitespace-nowrap shrink-0 -mb-px ${
                  activeTab === tab.key
                    ? "text-foreground border-b-2 border-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "briefing" && <ExecutiveSummary />}

          {activeTab === "news" && (
            <div>
              <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />

              {/* Section header */}
              <div className="flex items-center gap-4 mb-6">
                <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-foreground italic shrink-0">
                  latest
                </h3>
                <div className="flex-1 h-px bg-foreground/20" />
                <RefreshButton onClick={handleRefreshAll} isFetching={isRefreshing} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {allArticles.map((item, i) => (
                  <StoryRow
                    key={item.id}
                    item={item}
                    index={i}
                    isBookmarked={isBookmarked(item.id)}
                    onToggleBookmark={() => toggleBookmark({ id: item.id, category: "news", title: item.title, url: item.url, source: item.source, data: item })}
                  />
                ))}
              </div>

              {searchFiltered.length === 0 && (
                <p className="text-[13px] text-muted-foreground italic py-12 text-center">
                  {searchQuery ? "No stories match your search." : "No stories in this category today."}
                </p>
              )}
            </div>
          )}

          {activeTab === "usecases" && (
            <div className="space-y-8 sm:space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">AI-Powered Search · Find solutions to your pain points</p>
                  <h2 className="font-display text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.1]">
                    Real AI use cases from real people
                  </h2>
                </div>
                <RefreshButton onClick={handleRefreshAll} isFetching={isRefreshing} label="Find new" />
              </div>

              <UseCaseSearch
                query={useCaseQuery}
                onChange={(q) => { setUseCaseQuery(q); if (!q) { setHasSearched(false); setSearchResults([]); } }}
                onSearch={handleUseCaseSearch}
                isSearching={isSearching}
              />

              {/* Online search results */}
              {hasSearched && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-foreground italic shrink-0">
                      search results
                    </h3>
                    <div className="flex-1 h-px bg-foreground/20" />
                    <span className="text-[11px] text-muted-foreground">{searchResults.length} results</span>
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {searchResults.map((post, i) => (
                        <UseCaseCard
                          key={post.id}
                          post={post}
                          index={i}
                          isBookmarked={isBookmarked(post.id)}
                          onToggleBookmark={() => toggleBookmark({ id: post.id, category: "usecases", title: post.title, url: post.url, source: post.source, data: post })}
                        />
                      ))}
                    </div>
                  ) : !isSearching ? (
                    <p className="text-[13px] text-muted-foreground italic py-12 text-center">
                      No use cases found for this pain point. Try a different search.
                    </p>
                  ) : null}
                </div>
              )}

              {/* Curated use cases */}
              {!hasSearched && (
                <>
                  {(["reddit", "linkedin", "github"] as const).map((source) => {
                    const items = mockUseCases.filter((p) => p.source === source);
                    if (items.length === 0) return null;
                    const label = source === "reddit" ? "from reddit" : source === "linkedin" ? "from linkedin" : "from github";
                    return (
                      <div key={source}>
                        <div className="flex items-center gap-4 mb-6">
                          <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-foreground italic shrink-0">
                            {label}
                          </h3>
                          <div className="flex-1 h-px bg-foreground/20" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                          {items.map((post, i) => (
                            <UseCaseCard
                              key={post.id}
                              post={post}
                              index={i}
                              isBookmarked={isBookmarked(post.id)}
                              onToggleBookmark={() => toggleBookmark({ id: post.id, category: "usecases", title: post.title, url: post.url, source: post.source, data: post })}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {activeTab === "community" && (
            <div className="space-y-8 sm:space-y-10">
              <div>
                <h2 className="font-display text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                  Community
                </h2>
              </div>

              <CommunitySearch />

              <div className="flex items-center gap-4 mb-6">
                <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-foreground italic shrink-0">
                  trending
                </h3>
                <div className="flex-1 h-px bg-foreground/20" />
                <RefreshButton onClick={handleRefreshAll} isFetching={isRefreshing} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {communityPosts.map((post, i) => (
                  <CommunityCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-8 sm:space-y-10">
              <div>
                <h2 className="font-display text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground leading-[1.1]">
                  Saved items
                </h2>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {getByCategory("news").length + getByCategory("usecases").length} bookmarked
                </p>
              </div>

              {getByCategory("news").length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-foreground italic shrink-0">news</h3>
                    <div className="flex-1 h-px bg-foreground/20" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {getByCategory("news").map((b, i) => (
                      <StoryRow key={b.id} item={b.data} index={i} isBookmarked={true}
                        onToggleBookmark={() => toggleBookmark({ id: b.id, category: "news", title: b.title, url: b.url, source: b.source, data: b.data })} />
                    ))}
                  </div>
                </div>
              )}

              {getByCategory("usecases").length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-display text-[22px] sm:text-[26px] font-normal text-foreground italic shrink-0">use cases</h3>
                    <div className="flex-1 h-px bg-foreground/20" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {getByCategory("usecases").map((b, i) => (
                      <UseCaseCard key={b.id} post={b.data} index={i} isBookmarked={true}
                        onToggleBookmark={() => toggleBookmark({ id: b.id, category: "usecases", title: b.title, url: b.url, source: b.source, data: b.data })} />
                    ))}
                  </div>
                </div>
              )}

              {getByCategory("news").length === 0 && getByCategory("usecases").length === 0 && (
                <div className="text-center py-16">
                  <Bookmark className="h-8 w-8 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-[13px] text-muted-foreground italic">
                    No saved items yet. Bookmark news or use cases to find them here.
                  </p>
                </div>
              )}
            </div>
          )}

          <footer className="mt-12 sm:mt-16 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row items-center gap-2 justify-between pb-8">
            <p className="font-display text-base font-semibold text-foreground/40">
              MV Intelligence
            </p>
            <p className="text-[10px] text-muted-foreground">
              ©2026 · Updated hourly
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
