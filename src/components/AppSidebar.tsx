import { LayoutDashboard, Newspaper, GitBranch, Bookmark, Settings, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "briefing" | "news" | "usecases" | "community" | "saved";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  tab?: Tab;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Daily Brief", tab: "briefing" },
  { icon: Newspaper, label: "Latest News", tab: "news" },
  { icon: Lightbulb, label: "Use Cases", tab: "usecases" },
  { icon: GitBranch, label: "Community", tab: "community" },
  { icon: Bookmark, label: "Saved", tab: "saved" },
  { icon: Settings, label: "Settings" },
];

interface AppSidebarProps {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

export function AppSidebar({ activeTab = "briefing", onTabChange }: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[220px] border-r border-foreground/10 bg-background shrink-0">
      <div className="px-6 pt-7 pb-6 border-b border-foreground/10">
        <p className="font-display text-xl font-bold text-foreground tracking-tight">
          MV Intelligence
        </p>
        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
          Independent purchase decision engine
        </p>
        <div className="mt-4 p-3 border border-primary/20 bg-primary/5 rounded-lg">
          <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Review your scenario</p>
          <p className="text-[11px] text-foreground leading-relaxed italic">
            "Optimize cloud infrastructure for scalability"
          </p>
        </div>
      </div>

      <nav className="flex flex-col py-4 flex-1 px-4">
        {navItems.map((item) => {
          const isActive = item.tab === activeTab;
          return (
            <button
              key={item.label}
              onClick={() => item.tab && onTabChange?.(item.tab)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-[13px] transition-all text-left",
                isActive
                  ? "text-foreground font-semibold border-l-2 border-foreground -ml-px"
                  : "text-muted-foreground hover:text-foreground",
                !item.tab && "opacity-30 cursor-not-allowed"
              )}
              disabled={!item.tab}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-foreground/10">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          ©2026 · Updated hourly
        </p>
      </div>
    </aside>
  );
}
