export type NewsCategory = "LLMs" | "Robotics" | "Research" | "Industry" | "Policy";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  takeaways: string[];
  source: string;
  url: string;
  category: NewsCategory;
  timeAgo: string;
  isBreaking?: boolean;
}

const categoryColorMap: Record<NewsCategory, string> = {
  LLMs: "bg-primary",
  Robotics: "bg-muted-foreground",
  Research: "bg-primary",
  Industry: "bg-muted-foreground",
  Policy: "bg-primary",
};

export function getCategoryColor(category: NewsCategory) {
  return categoryColorMap[category];
}

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "OpenAI Acquires Promptfoo to Bolster AI Security Testing",
    summary: "Promptfoo, the open-source AI evaluation and red-teaming platform, has agreed to be acquired by OpenAI. The tool will remain open source while being integrated into OpenAI's infrastructure layers.",
    takeaways: [
      "Promptfoo will remain open source post-acquisition",
      "OpenAI gains systematic AI testing and red-teaming capabilities",
      "Integration will help teams catch vulnerabilities early before deployment",
      "Signals OpenAI's increasing focus on AI safety and compliance tooling",
    ],
    source: "TLDR AI",
    url: "https://www.promptfoo.dev/blog/promptfoo-joining-openai/",
    category: "Industry",
    timeAgo: "Today",
    isBreaking: true,
  },
  {
    id: "2",
    title: "Anthropic Sues US Defense Department Over Supply Chain Risk Label",
    summary: "Anthropic filed lawsuits after the DoD labeled the company a supply-chain risk, which could bar government contractors from using its models. The dispute followed Anthropic's refusal to allow unrestricted military use.",
    takeaways: [
      "DoD labeled Anthropic a supply-chain risk after it refused unrestricted military AI use",
      "Could bar all government contractors from using Claude models",
      "Anthropic cited concerns over mass surveillance and autonomous weapons",
      "Lawsuits filed in both California and Washington DC courts",
    ],
    source: "TLDR AI",
    url: "https://techcrunch.com/2026/03/09/anthropic-sues-defense-department-over-supply-chain-risk-designation/",
    category: "Policy",
    timeAgo: "Today",
  },
  {
    id: "3",
    title: "Microsoft Launches Copilot Cowork — Autonomous Workflow Agent for M365",
    summary: "Copilot Cowork automates tasks across Microsoft 365, coordinating emails, meetings, and files. It can reschedule meetings and prepare documents while maintaining user control.",
    takeaways: [
      "Copilot Cowork uses 'Work IQ' to coordinate across M365 apps autonomously",
      "Handles rescheduling, document prep, and email triage with user oversight",
      "Currently in Research Preview, broad availability expected March 2026",
      "Positions Microsoft's AI as a proactive workflow coordinator, not just a chatbot",
    ],
    source: "TLDR AI",
    url: "https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/copilot-cowork-a-new-way-of-getting-work-done/",
    category: "Industry",
    timeAgo: "Today",
  },
  {
    id: "4",
    title: "AI Assistants Now Equal 56% of Global Search Engine Volume",
    summary: "AI assistants generate 45 billion monthly sessions, with 83% occurring in mobile apps. ChatGPT dominates at 89% of global AI sessions, while combined search + AI usage grew 26% since 2023.",
    takeaways: [
      "45 billion monthly AI assistant sessions globally — 56% of search volume",
      "83% of AI usage happens in mobile apps, not browsers",
      "ChatGPT holds 89% of global AI sessions",
      "Search engine activity still growing alongside AI — not being replaced",
    ],
    source: "TLDR AI",
    url: "https://searchengineland.com/ai-assistants-global-search-engine-volume-study-471118",
    category: "Research",
    timeAgo: "Today",
  },
  {
    id: "5",
    title: "Google Teaches LLMs to Reason Like Bayesians",
    summary: "Google researchers trained LLMs to mimic optimal Bayesian model predictions, significantly improving recommendation tasks and enabling generalization to other domains.",
    takeaways: [
      "LLMs trained to approximate Bayesian inference for sequential reasoning",
      "Significant improvement on recommendation and preference-learning tasks",
      "Method generalizes to tasks beyond recommendations",
      "Could optimize multi-turn AI interactions by better modeling user intent",
    ],
    source: "TLDR AI",
    url: "https://research.google/blog/teaching-llms-to-reason-like-bayesians/",
    category: "Research",
    timeAgo: "Today",
  },
  {
    id: "6",
    title: "The Top 100 Gen AI Consumer Apps — a16z's Sixth Edition",
    summary: "ChatGPT remains the leading AI product globally, but Gemini and Claude are gaining traction. The landscape is diversifying with notable developments in video generation and agentic AI.",
    takeaways: [
      "CapCut, Canva, and Notion now integrate AI as core product features",
      "Gemini and Claude gaining ground in US paid subscriptions",
      "Video generation and agentic AI are the fastest-growing categories",
      "OpenClaw noted as a significant new entrant in the agentic space",
    ],
    source: "TLDR AI",
    url: "https://a16z.com/100-gen-ai-apps-6/",
    category: "Industry",
    timeAgo: "Today",
  },
  {
    id: "7",
    title: "Claude Code Review: Multi-Agent PR Analysis Launches",
    summary: "Code Review for Claude Code enables automated PR reviews that catch logic errors, security vulnerabilities, and regressions. Reviews average $15-$25 per analysis.",
    takeaways: [
      "Multi-agent analysis catches logic errors, security issues, and regressions",
      "Posts findings as inline comments on GitHub PRs",
      "Does not approve or block PRs — integrates with existing review workflows",
      "Billed on token usage, averaging $15-$25 per review",
    ],
    source: "TLDR AI",
    url: "https://code.claude.com/docs/en/code-review",
    category: "LLMs",
    timeAgo: "Today",
  },
  {
    id: "8",
    title: "Tencent Releases Penguin-VL: Efficient Vision-Language Models",
    summary: "Penguin-VL introduces a compact VLM family with a redesigned vision encoder initialized from a text-only LLM to align visual features with language representations.",
    takeaways: [
      "Vision encoder initialized from text-only LLM for better multimodal alignment",
      "Designed for efficiency — compact model size with strong performance",
      "Improves data-efficient multimodal reasoning",
      "Open source on GitHub from Tencent AI Lab",
    ],
    source: "TLDR AI",
    url: "https://github.com/tencent-ailab/Penguin-VL",
    category: "Research",
    timeAgo: "Today",
  },
];

export interface CommunityPost {
  id: string;
  title: string;
  source: "github" | "reddit";
  subreddit?: string;
  repo?: string;
  description: string;
  howItHelps: string;
  author: string;
  timeAgo: string;
  upvotes?: number;
  stars?: number;
  comments: number;
  url: string;
}

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: "c1",
    title: "AutoGPT v0.6 released — multi-agent orchestration, tool-use improvements",
    source: "github",
    repo: "Significant-Gravitas/AutoGPT",
    description: "Major release adding multi-agent orchestration, improved tool-use patterns, and a revamped plugin system. Performance benchmarks show 40% faster task completion.",
    howItHelps: "You could use AutoGPT to automate repetitive business tasks — like researching competitors, drafting reports, or managing data pipelines — without writing custom code. Think of it as a digital employee that follows multi-step instructions on its own.",
    author: "Significant-Gravitas",
    timeAgo: "3h ago",
    stars: 1240,
    comments: 89,
    url: "https://github.com/Significant-Gravitas/AutoGPT",
  },
  {
    id: "c2",
    title: "I built an AI agent that automates my entire deployment pipeline — here's how",
    source: "reddit",
    subreddit: "r/AIAgents",
    description: "Walkthrough of building a multi-step AI agent using LangChain and GPT-4 that handles CI/CD, monitoring, and rollback decisions autonomously.",
    howItHelps: "If your team ships software, this approach can eliminate hours of manual deployment work. The AI handles testing, deploying, and rolling back if something breaks — meaning fewer late-night emergencies and faster product releases.",
    author: "u/devops_wizard",
    timeAgo: "4h ago",
    upvotes: 2847,
    comments: 312,
    url: "https://www.reddit.com/r/AIAgents/",
  },
  {
    id: "c3",
    title: "CrewAI adds native support for MCP servers and tool composition",
    source: "github",
    repo: "joaomdmoura/crewAI",
    description: "CrewAI now natively supports Model Context Protocol servers, enabling agents to dynamically discover and use tools from any MCP-compatible service.",
    howItHelps: "CrewAI lets you build teams of AI agents that collaborate — e.g., one agent researches, another writes, a third reviews. With MCP support, these agents can now plug into any compatible tool automatically, making it much easier to build complex AI workflows for your business.",
    author: "joaomdmoura",
    timeAgo: "5h ago",
    stars: 876,
    comments: 45,
    url: "https://github.com/joaomdmoura/crewAI",
  },
  {
    id: "c4",
    title: "The agent framework landscape is getting wild — comparison of 12 frameworks",
    source: "reddit",
    subreddit: "r/MachineLearning",
    description: "Comprehensive comparison of CrewAI, LangGraph, AutoGen, Mastra, and 8 others. Benchmarks on task completion, latency, and developer experience.",
    howItHelps: "If you're evaluating which AI agent tool to invest in, this comparison saves you weeks of research. It benchmarks speed, reliability, and ease of use — helping you pick the right framework for your team's specific needs without costly trial-and-error.",
    author: "u/ml_researcher_42",
    timeAgo: "6h ago",
    upvotes: 4120,
    comments: 567,
    url: "https://www.reddit.com/r/MachineLearning/",
  },
  {
    id: "c5",
    title: "LangGraph v0.4 — stateful multi-agent workflows with human-in-the-loop",
    source: "github",
    repo: "langchain-ai/langgraph",
    description: "New version adds persistent state management, human-in-the-loop approval flows, and improved debugging tools for complex agent graphs.",
    howItHelps: "LangGraph lets you build AI workflows where a human approves key decisions before the AI continues. Perfect for sensitive operations like financial approvals or legal reviews — you get AI speed with human judgment at critical checkpoints.",
    author: "langchain-ai",
    timeAgo: "8h ago",
    stars: 2100,
    comments: 134,
    url: "https://github.com/langchain-ai/langgraph",
  },
  {
    id: "c6",
    title: "My AI coding agent just mass-refactored our 200k LOC codebase overnight",
    source: "reddit",
    subreddit: "r/LocalLLaMA",
    description: "Using a fine-tuned Llama model with a custom agent loop, the author automated a massive codebase refactor. Post includes metrics, failure modes, and lessons learned.",
    howItHelps: "This shows that AI can now handle large-scale code maintenance that would take a team of developers weeks. If you have legacy systems or technical debt, AI-assisted refactoring could dramatically reduce modernization costs and timelines.",
    author: "u/llama_whisperer",
    timeAgo: "9h ago",
    upvotes: 3560,
    comments: 423,
    url: "https://www.reddit.com/r/LocalLLaMA/",
  },
];
