import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { query } = await req.json();
    if (!query || typeof query !== 'string' || query.trim().length < 3) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are an AI use case research assistant. Given a user's pain point or search query, find and describe real-world AI use cases that solve that specific problem.

Return a JSON array of 5-8 use cases. Each use case must have:
- "title": A descriptive title of the use case (string)
- "summary": 2-3 sentence description of how AI was used to solve the problem (string)
- "toolsUsed": Array of specific AI tools/services used (string[])
- "productivityGain": One sentence describing the measurable impact (string)
- "source": Where this type of solution is commonly discussed - one of "reddit", "linkedin", "github" (string)
- "author": A realistic author name or handle (string)
- "url": A plausible URL where one might find this kind of solution (string)

Focus on REAL, PRACTICAL use cases that people have actually deployed. Be specific about tools, workflows, and measurable results. Tailor results precisely to the user's query/pain point.

Return ONLY the JSON array, no markdown, no explanation.`;

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Find AI use cases for this pain point: "${query}"` },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`AI Gateway error [${response.status}]: ${errBody}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    
    // Parse the JSON from the response, handling potential markdown wrapping
    let results;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      results = JSON.parse(cleaned);
    } catch {
      results = [];
    }

    // Normalize and add IDs
    const normalized = (Array.isArray(results) ? results : []).map((item: any, i: number) => ({
      id: `search-${i}`,
      title: item.title || '',
      summary: item.summary || '',
      toolsUsed: Array.isArray(item.toolsUsed) ? item.toolsUsed : [],
      productivityGain: item.productivityGain || '',
      source: ['reddit', 'linkedin', 'github'].includes(item.source) ? item.source : 'reddit',
      author: item.author || 'Anonymous',
      url: item.url || '#',
      timeAgo: 'AI Search',
      comments: 0,
    }));

    return new Response(JSON.stringify({ results: normalized }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search use cases error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, results: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
