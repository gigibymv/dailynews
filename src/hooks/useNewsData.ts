import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { NewsItem, NewsCategory } from "@/data/newsData";
import type { TldrItem } from "@/data/tldrData";
import type { CommunityPost } from "@/data/newsData";
import { mockNews, mockCommunityPosts } from "@/data/newsData";
import { mockTldrItems } from "@/data/tldrData";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function useNewsArticles() {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes on news_articles
  useEffect(() => {
    const channel = supabase
      .channel("news-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news_articles" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["news-articles"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["news-articles"],
    queryFn: async (): Promise<NewsItem[]> => {
      try {
        const { data, error } = await supabase
          .from("news_articles")
          .select("*")
          .order("is_breaking", { ascending: false })
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase news fetch error:", error);
          return mockNews;
        }

        if (!data || data.length === 0) return mockNews;

        return data.map((row: any) => ({
          id: row.id,
          title: row.title,
          summary: row.summary,
          takeaways: row.takeaways || [],
          source: row.source,
          url: row.url,
          category: row.category as NewsCategory,
          timeAgo: timeAgo(row.created_at),
          isBreaking: row.is_breaking,
        }));
      } catch (err) {
        console.error("Unexpected news fetch error:", err);
        return mockNews;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for near-realtime
  });
}

export function useTldrItems() {
  return useQuery({
    queryKey: ["tldr-items"],
    queryFn: async (): Promise<TldrItem[]> => {
      const { data, error } = await supabase
        .from("tldr_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) return mockTldrItems;

      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        summary: row.summary,
        url: row.url,
        readTime: row.read_time,
        category: row.category as TldrItem["category"],
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCommunityPosts() {
  return useQuery({
    queryKey: ["community-posts"],
    queryFn: async (): Promise<CommunityPost[]> => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) return mockCommunityPosts;

      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        source: row.source as "github" | "reddit",
        subreddit: row.subreddit || undefined,
        repo: row.repo || undefined,
        description: row.description,
        howItHelps: row.how_it_helps,
        author: row.author,
        timeAgo: timeAgo(row.created_at),
        upvotes: row.upvotes || undefined,
        stars: row.stars || undefined,
        comments: row.comments,
        url: row.url,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useDailyBriefing() {
  return useQuery({
    queryKey: ["daily-briefing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_briefings")
        .select("*")
        .order("published_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
