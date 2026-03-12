import { type NewsCategory } from "@/data/newsData";

const categories: NewsCategory[] = ["LLMs", "Robotics", "Research", "Industry", "Policy"];

interface CategoryFilterProps {
  active: NewsCategory | null;
  onSelect: (cat: NewsCategory | null) => void;
}

export function CategoryFilter({ active, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-[2px]">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
          active === null
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:text-foreground"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(active === cat ? null : cat)}
          className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
            active === cat
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
