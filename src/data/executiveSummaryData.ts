export interface BriefingItem {
  id: string;
  title: string;
  analysis: string;
  mvImplication: string;
  sources: string[];
  sourceUrls: string[];
}

export interface ExecutiveBriefing {
  date: string;
  globalItems: BriefingItem[];
  africaItems: BriefingItem[] | null;
  africaNoUpdate: boolean;
}

export const todayBriefing: ExecutiveBriefing = {
  date: "March 11, 2026",
  globalItems: [
    {
      id: "g1",
      title: "OpenAI Acquires Promptfoo to Build Enterprise AI Safety Layer",
      analysis:
        "OpenAI acquired Promptfoo, the leading open-source AI red-teaming and evaluation platform. The tool will remain open source while being integrated into OpenAI's enterprise infrastructure. This signals OpenAI's pivot from pure model development toward enterprise-grade compliance and safety tooling — a critical differentiator as regulated industries adopt AI at scale.",
      mvImplication:
        "Enterprise AI governance is becoming table stakes. Companies deploying LLMs without systematic evaluation frameworks face mounting regulatory and reputational risk. This acquisition compresses the timeline for AI safety tooling to become a procurement requirement.",
      sources: ["Financial Times", "TechCrunch", "OpenAI Blog"],
      sourceUrls: [
        "https://www.ft.com/artificial-intelligence",
        "https://techcrunch.com/category/artificial-intelligence/",
        "https://www.promptfoo.dev/blog/promptfoo-joining-openai/",
      ],
    },
    {
      id: "g2",
      title: "Anthropic Sues U.S. Defense Department Over Supply-Chain Risk Designation",
      analysis:
        "Anthropic filed federal lawsuits after the DoD classified the company as a supply-chain risk, effectively barring government contractors from using Claude models. The designation followed Anthropic's refusal to permit unrestricted military applications, citing concerns over mass surveillance and autonomous weapons systems.",
      mvImplication:
        "The AI-defense relationship is fracturing along ethical lines. Companies choosing Claude for government-adjacent work face sudden procurement risk. This creates an opening for competitors willing to accept broader military use cases — and a reputational premium for those who refuse.",
      sources: ["Reuters", "TechCrunch", "Bloomberg"],
      sourceUrls: [
        "https://www.reuters.com/technology/artificial-intelligence/",
        "https://techcrunch.com/2026/03/09/anthropic-sues-defense-department-over-supply-chain-risk-designation/",
        "https://www.bloomberg.com/technology",
      ],
    },
    {
      id: "g3",
      title: "Microsoft Launches Copilot Cowork — Autonomous Workflow Orchestration for M365",
      analysis:
        "Microsoft unveiled Copilot Cowork, an autonomous agent layer across Microsoft 365 that proactively coordinates emails, meetings, documents, and task scheduling. Unlike previous Copilot features that responded to prompts, Cowork operates continuously with configurable user oversight. Research Preview is live; general availability expected late March 2026.",
      mvImplication:
        "Microsoft is shifting from AI-as-assistant to AI-as-autonomous-coordinator. This fundamentally changes the competitive landscape for enterprise productivity — and raises the bar for any SaaS tool competing in the M365 ecosystem. Expect rapid adoption in organizations already deep in the Microsoft stack.",
      sources: ["The Verge", "Microsoft Blog", "Bloomberg"],
      sourceUrls: [
        "https://www.theverge.com/ai-artificial-intelligence",
        "https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/copilot-cowork-a-new-way-of-getting-work-done/",
        "https://www.bloomberg.com/technology",
      ],
    },
    {
      id: "g4",
      title: "AI Assistants Now Generate 56% of Global Search Volume",
      analysis:
        "New data shows AI assistants produce 45 billion monthly sessions globally — 56% of traditional search engine volume. 83% of AI usage occurs in mobile apps. ChatGPT dominates with 89% share of global AI sessions, but combined search + AI usage grew 26% since 2023, suggesting AI is expanding the market rather than cannibalizing it.",
      mvImplication:
        "The AI-search relationship is additive, not zero-sum — for now. Brands dependent on SEO-driven traffic must accelerate AI visibility strategies. The 83% mobile concentration means AI-first experiences must be designed for mobile contexts, not desktop interfaces.",
      sources: ["Reuters", "Financial Times", "Search Engine Land"],
      sourceUrls: [
        "https://www.reuters.com/technology/artificial-intelligence/",
        "https://www.ft.com/artificial-intelligence",
        "https://searchengineland.com/ai-assistants-global-search-engine-volume-study-471118",
      ],
    },
    {
      id: "g5",
      title: "Claude Code Review Ships Multi-Agent PR Analysis",
      analysis:
        "Anthropic launched Code Review for Claude Code, enabling automated multi-agent pull request analysis that identifies logic errors, security vulnerabilities, and regressions. The system posts inline findings on GitHub PRs without blocking or approving merges. Per-review cost averages $15–$25 based on token usage.",
      mvImplication:
        "AI-assisted code review is transitioning from experimental to standard engineering practice. At $15–$25 per review, it's cost-competitive with senior engineer time. Development teams not adopting these tools within 12 months will face velocity disadvantages.",
      sources: ["TechCrunch", "The Verge", "Anthropic Blog"],
      sourceUrls: [
        "https://techcrunch.com/category/artificial-intelligence/",
        "https://www.theverge.com/ai-artificial-intelligence",
        "https://code.claude.com/docs/en/code-review",
      ],
    },
  ],
  africaItems: [
    {
      id: "a1",
      title: "Nigeria's NITDA Releases Draft AI Governance Framework for Public Comment",
      analysis:
        "Nigeria's National Information Technology Development Agency published a comprehensive draft AI governance framework, covering data sovereignty, algorithmic accountability, and sector-specific guidelines for fintech and healthcare. The 60-day public comment period opens March 15. If enacted, Nigeria would become the second African nation (after Rwanda) with a formal AI regulatory framework.",
      mvImplication:
        "Nigeria is positioning itself as a regulatory leader in African AI governance. Companies operating in Nigerian fintech and healthtech should begin compliance planning now. The framework's data sovereignty provisions could impact cross-border AI deployments across West Africa.",
      sources: ["TechCabal", "African Business", "NITDA Official Release"],
      sourceUrls: [
        "https://techcabal.com/category/artificial-intelligence/",
        "https://african.business/category/technology",
        "https://nitda.gov.ng/",
      ],
    },
    {
      id: "a2",
      title: "Kenya's Konza Technopolis Signs AI Research Partnership with Google DeepMind",
      analysis:
        "Kenya's Konza Technopolis Development Authority signed a research partnership with Google DeepMind focused on climate modeling and agricultural AI applications. The three-year agreement includes $12M in compute credits, talent exchanges, and the establishment of a satellite research lab in Konza by Q4 2026.",
      mvImplication:
        "This partnership elevates East Africa's positioning in the global AI research landscape. Kenyan AI talent now has a direct pathway to frontier research collaboration. Agricultural AI applications developed here could scale across the continent's farming economies.",
      sources: ["Reuters Africa", "TechCabal", "Smart Africa"],
      sourceUrls: [
        "https://www.reuters.com/world/africa/",
        "https://techcabal.com/category/artificial-intelligence/",
        "https://smartafrica.org/",
      ],
    },
    {
      id: "a3",
      title: "South Africa's CSIR Launches Open-Source Multilingual NLP Toolkit for 11 Official Languages",
      analysis:
        "South Africa's Council for Scientific and Industrial Research released an open-source NLP toolkit supporting all 11 official South African languages, including isiZulu, isiXhosa, and Sesotho. The toolkit includes pre-trained language models, translation APIs, and sentiment analysis tools. It is the most comprehensive multilingual AI resource for Southern African languages to date.",
      mvImplication:
        "Multilingual AI infrastructure is the unlock for mass-market AI adoption in Africa. This toolkit enables developers to build products that serve 80%+ of South Africa's population in their home language. Companies building for African markets should integrate these resources immediately.",
      sources: ["Disrupt Africa", "African Business", "CSIR Official Release"],
      sourceUrls: [
        "https://disrupt-africa.com/",
        "https://african.business/category/technology",
        "https://www.csir.co.za/",
      ],
    },
    {
      id: "a4",
      title: "African Development Bank Allocates $200M to Continental AI Infrastructure Fund",
      analysis:
        "The African Development Bank announced a $200M allocation to a new Continental AI Infrastructure Fund, targeting GPU compute clusters, data center development, and AI training facilities across five regional hubs: Lagos, Nairobi, Kigali, Cape Town, and Cairo. First disbursements expected Q3 2026.",
      mvImplication:
        "This is the largest institutional commitment to AI compute infrastructure in Africa to date. The five-hub model signals a deliberate strategy to distribute AI capabilities rather than concentrate them. Companies planning African AI operations should align with these hub cities for infrastructure access.",
      sources: ["African Development Bank", "Reuters Africa", "African Business"],
      sourceUrls: [
        "https://www.afdb.org/en",
        "https://www.reuters.com/world/africa/",
        "https://african.business/category/technology",
      ],
    },
    {
      id: "a5",
      title: "Egypt Launches National AI Strategy 2.0 with $150M Investment in AI Education",
      analysis:
        "Egypt's Ministry of Communications and Information Technology unveiled the second phase of its National AI Strategy, committing $150M over three years to AI education, establishing 10 new AI research centers at public universities, and launching a national AI certification program. The strategy targets training 100,000 AI practitioners by 2028.",
      mvImplication:
        "Egypt is making the largest single-country investment in AI human capital on the continent. This positions Cairo as a talent hub for Arabic-language AI development and creates a pipeline for North African AI startups. Companies seeking Arabic NLP talent should monitor this ecosystem closely.",
      sources: ["African Business", "Reuters Africa", "Egypt Ministry of ICT"],
      sourceUrls: [
        "https://african.business/category/technology",
        "https://www.reuters.com/world/africa/",
        "https://mcit.gov.eg/en",
      ],
    },
  ],
  africaNoUpdate: false,
};
