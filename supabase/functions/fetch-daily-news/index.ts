import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

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
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2500,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API call failed [${response.status}]: ${errText}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error("No content returned from Gemini");
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 

    const response = await fetch(feedUrl, {
      headers: { "User-Agent": "MV-Intelligence-Bot/1.0" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return [];
    const xml = await response.text();
    
    const items: string[] = [];
    const itemRegex = /<item[\s\S]*?<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
      const titleMatch = match[0].match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/);
      const descMatch = match[0].match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/);
      const linkMatch = match[0].match(/<link>(.*?)<\/link>/);
      const title = titleMatch?.[1] || titleMatch?.[2] || "";
      const desc = descMatch?.[1] || descMatch?.[2] || "";
      const link = linkMatch?.[1] || "";
      if (title) items.push(`Title: ${title}\nURL: ${link}\nSummary: ${desc.substring(0, 250)}`);
    }
    return items;
  } catch (e) {
    console.error(`Failed to fetch RSS from ${feedUrl}:`, e);
    return [];
  }
}

async function fetchTldrTechContent(): Promise<string> {
  try {
    const response = await fetch("https://tldr.tech/ai", {
      headers: { "User-Agent": "MV-Intelligence-Bot/1.0" },
    });
    if (!response.ok) return "Could not fetch tldr.tech content directly.";
    const html = await response.text();
    // Simple extraction of text content to avoid passing massive HTML
    return html.replace(/<[^>]*>?/gm, ' ').substring(0, 5000);
  } catch (e) {
    console.error("TLDR fetch error:", e);
    return "Error fetching TLDR.tech content.";
  }
}

async function fetchAndSummarizeNews(mode: "hourly" | "daily" = "hourly") {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const hour = now.getUTCHours();

  console.log(`Starting ${mode} news update...`);

  // Fetch recent history
  const { data: recentNews } = await supabaseAdmin
    .from("news_articles")
    .select("title, url")
    .order("created_at", { ascending: false })
    .limit(mode === "daily" ? 50 : 20);
  
  const newsHistory = recentNews?.map(n => `- ${n.title} (${n.url})`).join("\n") || "none";

  // Fetch RSS feeds
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

  let additionalContext = "";
  if (mode === "daily") {
    console.log("Fetching TLDR.tech content for daily wrap-up...");
    additionalContext = await fetchTldrTechContent();
  }

  const modeInstructions = mode === "daily" 
    ? `MODE: DAILY WRAP-UP (24-hour summary).
       STRICT FOCUS: This is your most important task. Create a definitive 24-hour analysis.
       TLDR.AI INTEGRATION: We have provided the latest content from tldr.tech/ai below. Use it as a primary source for the 'TOP STORIES' and 'tldr' sections.
       TOP STORIES: Generate a deep daily review in the 'briefing' section of the JSON. 
       - EXACTLY 5 Global items (Top 5 most important stories of the day).
       - EXACTLY 5 Africa items (Top 5 most important stories in African AI). 
       Each item must be a definitive 'Top Story' with profound 'mvImplication'.`
    : `MODE: HOURLY UPDATE. 
       FOCUS: Catch the very latest stories that happened in the last 1-2 hours.
       TOP STORIES: Provide a quick snapshot of the 'right now' (Top 3 global, Top 3 africa if available).`;

  const prompt = `You are an AI news curator for MV Intelligence. Today is ${today}, ${hour}:00 UTC.
  
${modeInstructions}

STRICT RULE: Do NOT repeat or include any of the following recently posted articles:
${newsHistory}

LATEST RSS CONTENT (USE FOR GENERAL NEWS):
${rssContext}

MASTER SOURCE - TLDR.TECH/AI (USE FOR DAILY WRAP-UP & TOP STORIES):
${additionalContext.substring(0, 4000)}

Generate a JSON object (raw JSON only, no markdown):

{
  "news": [{
      "title": "headline",
      "summary": "2-3 sentence summary",
      "takeaways": ["insight 1", "insight 2", "insight 3", "insight 4"],
      "source": "publication name",
      "url": "article URL",
      "category": "LLMs|Robotics|Research|Industry|Policy",
      "is_breaking": false
  }],
  "tldr": [{
      "title": "headline",
      "summary": "2-3 sentence summary",
      "url": "source URL",
      "read_time": "3 min",
      "category": "headlines|research|tools|launches"
  }],
  "community": [{
      "title": "contribution",
      "source": "github|reddit",
      "subreddit": "r/SubName or null",
      "repo": "owner/repo or null",
      "description": "what it is",
      "how_it_helps": "practical value",
      "author": "username",
      "url": "url",
      "upvotes": null, "stars": null, "comments": 0
  }],
  "briefing": {
    "globalItems": [{
        "title": "Top story title", 
        "analysis": "24h context and why it matters", 
        "mvImplication": "Strategic advice for an executive",
        "sources": ["Source Name"], 
        "sourceUrls": ["URL"]
    }],
    "africaItems": [{
        "title": "Top Africa story title", 
        "analysis": "Context", 
        "mvImplication": "Strategic advice",
        "sources": ["Source Name"], 
        "sourceUrls": ["URL"]
    }]
  }
}

Generate EXACTLY ${mode === "daily" ? 10 : 5} NEW news articles, 10 NEW TLDR items, and 6 NEW community posts.
For the 'briefing' section: Produce ${mode === "daily" ? "exactly 5 global and 5 africa" : "up to 3 global and 3 africa"} strategic items.
Focus on NEW/UNIQUE URLs not in the history list.`;

  return parseJSON(await callAI(prompt));
}

async function upsertData(data: any) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  if (data.news?.length) {
    await supabaseAdmin.from("news_articles").upsert(
      data.news.map((n: any) => ({ ...n, published_date: today, created_at: now.toISOString() })),
      { onConflict: "url" }
    );
  }

  if (data.tldr?.length) {
    await supabaseAdmin.from("tldr_items").upsert(
      data.tldr.map((t: any) => ({ ...t, published_date: today, created_at: now.toISOString() })),
      { onConflict: "url" }
    );
  }

  if (data.community?.length) {
    await supabaseAdmin.from("community_posts").upsert(
      data.community.map((c: any) => ({ ...c, published_date: today, created_at: now.toISOString() })),
      { onConflict: "url" }
    );
  }

  if (data.briefing) {
    await supabaseAdmin.from("daily_briefings").upsert({
      published_date: today,
      global_items: data.briefing.globalItems,
      africa_items: data.briefing.africaItems,
      summary_analysis: `Summary for ${today}`,
    }, { onConflict: "published_date" });
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    let mode: "hourly" | "daily" = "hourly";
    try {
      const body = await req.json();
      if (body?.mode === "daily") mode = "daily";
    } catch { /* default to hourly */ }

    const data = await fetchAndSummarizeNews(mode);
    await upsertData(data);

    return new Response(JSON.stringify({ success: true, mode }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
