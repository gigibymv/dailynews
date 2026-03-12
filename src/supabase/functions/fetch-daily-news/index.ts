import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// RSS feeds to aggregate for AI news
const RSS_FEEDS = [
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", name: "TechCrunch AI" },
  { url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", name: "The Verge AI" },
  { url: "https://arstechnica.com/ai/feed/", name: "ArsTechnica AI" },
  { url: "https://blog.google/technology/ai/rss/", name: "Google AI Blog" },
  { url: "https://openai.com/blog/rss.xml", name: "OpenAI Blog" },
  { url: "https://www.reuters.com/technology/artificial-intelligence/rss", name: "Reuters AI" },
];

async function callAI(prompt: string): Promise<string> {
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI call failed [${response.status}]: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content returned from AI");
  return content;
}

function parseJSON(content: string): any {
  let jsonStr = content;
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1];
  return JSON.parse(jsonStr.trim());
}

async function fetchRSSFeed(feedUrl: string): Promise<string[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: { "User-Agent": "MV-Intelligence-Bot/1.0" },
    });
    if (!response.ok) return [];
    const xml = await response.text();
    
    // Extract titles and descriptions from RSS
    const items: string[] = [];
    const itemRegex = /<item[\s\S]*?<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      const titleMatch = match[0].match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/);
      const descMatch = match[0].match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/);
      const linkMatch = match[0].match(/<link>(.*?)<\/link>/);
      const title = titleMatch?.[1] || titleMatch?.[2] || "";
      const desc = descMatch?.[1] || descMatch?.[2] || "";
      const link = linkMatch?.[1] || "";
      if (title) items.push(`Title: ${title}\nURL: ${link}\nSummary: ${desc.substring(0, 200)}`);
    }
    return items;
  } catch (e) {
    console.error(`Failed to fetch RSS from ${feedUrl}:`, e);
    return [];
  }
}

async function fetchAndSummarizeNews() {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const hour = now.getUTCHours();

  // Fetch RSS feeds in parallel
  console.log("Fetching RSS feeds...");
  const feedResults = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const items = await fetchRSSFeed(feed.url);
      return { name: feed.name, items };
    })
  );

  const rssContext = feedResults
    .filter((r): r is PromiseFulfilledResult<{ name: string; items: string[] }> => r.status === "fulfilled")
    .map((r) => `## ${r.value.name}\n${r.value.items.join("\n\n")}`)
    .join("\n\n---\n\n");

  console.log(`RSS context gathered: ${rssContext.length} chars`);

  const prompt = `You are an AI news curator. Today is ${today}, current hour: ${hour}:00 UTC.

Here are the latest articles from major AI news RSS feeds:

${rssContext}

Based on these RSS articles AND your knowledge of the very latest AI developments in the last few hours, generate a JSON object (raw JSON only, no markdown):

{
  "news": [
    {
      "title": "headline",
      "summary": "2-3 sentence summary",
      "takeaways": ["insight 1", "insight 2", "insight 3", "insight 4"],
      "source": "publication name",
      "url": "article URL",
      "category": "LLMs|Robotics|Research|Industry|Policy",
      "is_breaking": false
    }
  ],
  "tldr": [
    {
      "title": "short headline",
      "summary": "2-3 sentence TLDR",
      "url": "source URL",
      "read_time": "3 min",
      "category": "headlines|research|tools|launches"
    }
  ],
  "community": [
    {
      "title": "post title",
      "source": "github|reddit",
      "subreddit": "r/SubName or null",
      "repo": "owner/repo or null",
      "description": "what it is",
      "how_it_helps": "practical business value",
      "author": "username",
      "url": "url",
      "upvotes": null,
      "stars": null,
      "comments": 0
    }
  ]
}

Generate 5 news articles (prioritize the RSS articles above, supplement with your knowledge), 10 TLDR items (across all 4 categories), 6 community posts (3 github, 3 reddit).
Focus on the MOST RECENT developments from the last few hours. Mark the biggest story as is_breaking: true.
Include African AI developments when relevant.

CRITICAL URL RULES:
- For news articles: ONLY use URLs directly extracted from the RSS feeds above. If you supplement with your own knowledge, use the EXACT real URL of the article (e.g. https://techcrunch.com/2026/03/12/...).
- For TLDR items: Use real, verified article URLs. Never use placeholder URLs.
- For GitHub community posts: Use the real repository URL (e.g. https://github.com/owner/repo).
- For Reddit community posts: Use the real subreddit URL (e.g. https://www.reddit.com/r/SubName/).
- NEVER generate fake URLs, placeholder URLs, or URLs with "/example" in them.
- Every URL must be a real, navigable link that a user can click and reach actual content.`;

  return parseJSON(await callAI(prompt));
}

async function clearAndInsertToday(newsData: any) {
  const today = new Date().toISOString().split("T")[0];

  // Delete today's data before reinserting
  await supabaseAdmin.from("news_articles").delete().eq("published_date", today);
  await supabaseAdmin.from("tldr_items").delete().eq("published_date", today);
  await supabaseAdmin.from("community_posts").delete().eq("published_date", today);

  if (newsData.news?.length) {
    const { error } = await supabaseAdmin.from("news_articles").insert(
      newsData.news.map((n: any) => ({
        title: n.title, summary: n.summary, takeaways: n.takeaways,
        source: n.source, url: n.url, category: n.category,
        is_breaking: n.is_breaking || false, published_date: today,
      }))
    );
    if (error) console.error("News insert error:", error);
  }

  if (newsData.tldr?.length) {
    const { error } = await supabaseAdmin.from("tldr_items").insert(
      newsData.tldr.map((t: any) => ({
        title: t.title, summary: t.summary, url: t.url,
        read_time: t.read_time, category: t.category, published_date: today,
      }))
    );
    if (error) console.error("TLDR insert error:", error);
  }

  if (newsData.community?.length) {
    const { error } = await supabaseAdmin.from("community_posts").insert(
      newsData.community.map((c: any) => ({
        title: c.title, source: c.source, subreddit: c.subreddit || null,
        repo: c.repo || null, description: c.description,
        how_it_helps: c.how_it_helps, author: c.author, url: c.url,
        upvotes: c.upvotes || null, stars: c.stars || null,
        comments: c.comments || 0, published_date: today,
      }))
    );
    if (error) console.error("Community insert error:", error);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting hourly news fetch with RSS aggregation...");
    const newsData = await fetchAndSummarizeNews();
    console.log(`Fetched: ${newsData.news?.length} news, ${newsData.tldr?.length} TLDR, ${newsData.community?.length} community`);

    await clearAndInsertToday(newsData);
    console.log("Database updated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        counts: {
          news: newsData.news?.length || 0,
          tldr: newsData.tldr?.length || 0,
          community: newsData.community?.length || 0,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error fetching news:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
