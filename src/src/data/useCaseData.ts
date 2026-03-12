export interface UseCasePost {
  id: string;
  title: string;
  author: string;
  source: "reddit" | "linkedin" | "github";
  subreddit?: string;
  profileTitle?: string;
  repo?: string;
  summary: string;
  toolsUsed: string[];
  productivityGain: string;
  url: string;
  timeAgo: string;
  upvotes?: number;
  likes?: number;
  stars?: number;
  comments: number;
}

export const mockUseCases: UseCasePost[] = [
  {
    id: "uc1",
    title: "I replaced 4 hours of weekly reporting with a single Claude prompt chain",
    author: "u/data_sarah",
    source: "reddit",
    subreddit: "r/ChatGPTPro",
    summary: "I built a prompt chain that pulls data from our CRM, formats it into exec-ready slides, and emails the PDF every Monday at 8am. What used to take me half a day now runs on autopilot. The trick was breaking it into 3 chained prompts with structured JSON output between each step.",
    toolsUsed: ["Claude", "Zapier", "Google Slides API"],
    productivityGain: "4 hours saved per week — fully automated weekly reporting pipeline",
    url: "https://www.reddit.com/r/ChatGPTPro/",
    timeAgo: "6h ago",
    upvotes: 1847,
    comments: 234,
  },
  {
    id: "uc2",
    title: "How I use Cursor + Claude to ship features 3x faster as a solo founder",
    author: "Marc Louvion",
    source: "linkedin",
    profileTitle: "Founder @ ShipFast",
    summary: "As a solo founder, I've completely changed my dev workflow. I describe features in plain English, let Cursor generate the code, then review and iterate. I shipped 12 features last month that would have taken me a quarter. The key insight: treat AI as a junior dev who needs clear specs, not vague instructions.",
    toolsUsed: ["Cursor", "Claude", "Vercel"],
    productivityGain: "3x faster feature shipping — 12 features/month as a solo dev",
    url: "https://www.linkedin.com/in/marclouvion/",
    timeAgo: "8h ago",
    likes: 2340,
    comments: 187,
  },
  {
    id: "uc3",
    title: "Built an AI agent that triages our entire support inbox — 200+ tickets/day",
    author: "u/eng_mike_42",
    source: "reddit",
    subreddit: "r/artificial",
    summary: "Our support team was drowning. I built a LangChain agent that reads incoming tickets, categorizes them by urgency and topic, drafts a response, and routes to the right team member. It handles 200+ tickets daily with 94% accuracy. Support team went from 12-hour backlogs to same-day resolution.",
    toolsUsed: ["LangChain", "GPT-4", "Linear API", "Slack"],
    productivityGain: "Support backlog reduced from 12 hours to same-day — 94% auto-triage accuracy",
    url: "https://www.reddit.com/r/artificial/",
    timeAgo: "12h ago",
    upvotes: 3201,
    comments: 412,
  },
  {
    id: "uc4",
    title: "ai-meeting-summarizer: Drop in a recording, get structured notes + action items",
    author: "jxnl",
    source: "github",
    repo: "jxnl/ai-meeting-summarizer",
    summary: "Open-source tool that processes meeting recordings into structured markdown: key decisions, action items with owners, follow-up deadlines, and a 3-sentence executive summary. Uses Whisper for transcription and GPT-4 for structuring. We use it for every standup and it's saved our PM 5+ hours per week.",
    toolsUsed: ["Whisper", "GPT-4", "Python", "FFmpeg"],
    productivityGain: "5+ hours saved per week for PMs — zero manual note-taking",
    url: "https://github.com/jxnl/ai-meeting-summarizer",
    timeAgo: "1d ago",
    stars: 4200,
    comments: 67,
  },
  {
    id: "uc5",
    title: "I automated my entire content calendar with AI — here's the exact workflow",
    author: "Lara Acosta",
    source: "linkedin",
    profileTitle: "Content Strategist",
    summary: "Every Sunday my system generates 7 LinkedIn posts, 3 newsletter drafts, and 5 tweet threads based on my notes and bookmarks from the week. I review for 30 min, edit maybe 20%, and schedule everything. What used to be 8 hours of content creation is now a 30-minute review session.",
    toolsUsed: ["ChatGPT", "Notion AI", "Buffer", "Readwise"],
    productivityGain: "8 hours → 30 minutes for weekly content creation",
    url: "https://www.linkedin.com/in/laraacosta/",
    timeAgo: "14h ago",
    likes: 5120,
    comments: 342,
  },
  {
    id: "uc6",
    title: "Using GPT-4 Vision to auto-generate alt text for our entire image library (50k+ images)",
    author: "u/a11y_champion",
    source: "reddit",
    subreddit: "r/webdev",
    summary: "Our e-commerce site had 50,000+ product images with no alt text. I wrote a script that sends each image to GPT-4 Vision, generates contextual alt text, and updates our CMS via API. Total cost was ~$180 and it improved our SEO rankings within 2 weeks. Accessibility score went from 62 to 97.",
    toolsUsed: ["GPT-4 Vision", "Python", "Shopify API"],
    productivityGain: "50,000 images tagged in 6 hours — accessibility score 62→97",
    url: "https://www.reddit.com/r/webdev/",
    timeAgo: "18h ago",
    upvotes: 2890,
    comments: 198,
  },
  {
    id: "uc7",
    title: "doc-qa-bot: Chat with your company docs using RAG — deployed in 10 min",
    author: "simonw",
    source: "github",
    repo: "simonw/doc-qa-bot",
    summary: "Dead simple RAG setup: point it at a folder of PDFs/docs, it chunks and embeds them, then gives you a chat interface. Our legal team uses it to query contracts and our engineering team uses it for internal docs. Reduced 'where do I find X' Slack messages by 70%.",
    toolsUsed: ["LlamaIndex", "OpenAI", "Pinecone", "Streamlit"],
    productivityGain: "70% reduction in internal information-seeking — instant doc search",
    url: "https://github.com/simonw/doc-qa-bot",
    timeAgo: "20h ago",
    stars: 8900,
    comments: 134,
  },
  {
    id: "uc8",
    title: "How our sales team uses AI to research prospects — went from 30 min to 2 min per lead",
    author: "Kyle Poyar",
    source: "linkedin",
    profileTitle: "Growth Partner @ OpenView",
    summary: "Built a simple automation: paste a company URL, and it scrapes the site, pulls recent news, checks LinkedIn for key contacts, and generates a personalized outreach draft. Our SDRs went from researching 15 leads/day to 80+ leads/day. Response rates actually went UP because the personalization is better than what most humans write under time pressure.",
    toolsUsed: ["Perplexity API", "Clay", "GPT-4", "Apollo"],
    productivityGain: "Lead research: 30 min → 2 min — 5x more prospects contacted daily",
    url: "https://www.linkedin.com/in/kylepoyar/",
    timeAgo: "22h ago",
    likes: 3890,
    comments: 267,
  },
];
