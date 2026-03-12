import { LayoutDashboard, Newspaper, GitBranch, Bookmark, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "briefing" | "news" | "community";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  tab?: Tab;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Overview", tab: "briefing" },
  { icon: Newspaper, label: "AI News", tab: "news" },
  { icon: GitBranch, label: "Community", tab: "community" },
  { icon: Bookmark, label: "Saved" },
  { icon: Settings, label: "Settings" },
];

interface AppSidebarProps {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

export function AppSidebar({ activeTab = "briefing", onTabChange }: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[200px] border-r border-border bg-sidebar shrink-0">
      <div className="px-6 pt-6 pb-6 border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          MV Intelligence
        </p>
      </div>

      <nav className="flex flex-col py-3 flex-1">
        {navItems.map((item) => {
          const isActive = item.tab === activeTab;
          return (
            <button
              key={item.label}
              onClick={() => item.tab && onTabChange?.(item.tab)}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 text-[11px] uppercase tracking-[0.15em] transition-all text-left font-medium",
                isActive
                  ? "text-foreground bg-secondary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                !item.tab && "opacity-40 cursor-not-allowed"
              )}
              disabled={!item.tab}
            >
              <item.icon className="h-[14px] w-[14px]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-border">
        <p className="text-[8px] text-muted-foreground uppercase tracking-[0.35em] font-medium leading-relaxed">
          ©2026 · Daily · 7:00 AM EST
        </p>
      </div>
    </aside>
  );
}
