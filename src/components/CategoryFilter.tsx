import { categories, Category } from '@/lib/tools';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: Category | 'all';
  onSelect: (category: Category | 'all') => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          "px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300",
          "border border-border/50",
          selected === 'all'
            ? "bg-primary text-primary-foreground border-primary cyber-glow"
            : "bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/50"
        )}
      >
        All Tools
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300",
            "border border-border/50 flex items-center gap-2",
            selected === cat.id
              ? "bg-primary text-primary-foreground border-primary cyber-glow"
              : "bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/50"
          )}
        >
          <span>{cat.icon}</span>
          <span className="hidden sm:inline">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}