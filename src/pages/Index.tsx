import { useState } from 'react';
import { Header } from '@/components/Header';
import { ToolCard } from '@/components/ToolCard';
import { OutputPanel } from '@/components/OutputPanel';
import { CategoryFilter } from '@/components/CategoryFilter';
import { tools, categories, Category, Tool } from '@/lib/tools';
import { Shield, Zap, Terminal, Database, FileText, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter((t) => t.category === selectedCategory);

  const handleExecute = (execution: { id: string; tool: Tool; target: string }) => {
    setActiveExecutionId(execution.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center relative">
          {/* Background glow */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative inline-block mb-6">
            <Shield className="h-20 w-20 text-primary mx-auto animate-glow-pulse" />
            <div className="absolute inset-0 blur-2xl bg-primary/20" />
          </div>
          <h1 className="font-cyber text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-wider">
            CYBER GUARD <span className="text-primary text-glow-strong">360</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Professional bug bounty and penetration testing toolkit with <span className="text-primary">{tools.length}+ security tools</span>. 
            Execute reconnaissance, scanning, exploitation, and fuzzing directly from your browser. 
            <span className="text-secondary"> Mobile-ready</span> for on-the-go security testing.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link 
              to="/terminal"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm hover:bg-primary/90 transition-all active:scale-95"
            >
              <Terminal className="h-4 w-4" />
              Open Terminal
            </Link>
            <Link 
              to="/files"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/30 font-mono text-sm hover:bg-secondary/20 transition-all"
            >
              <FileText className="h-4 w-4" />
              View Output Files
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-colors">
              <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-cyber text-2xl text-foreground">{tools.length}</div>
              <div className="text-xs text-muted-foreground">Security Tools</div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-secondary/30 transition-colors">
              <Database className="h-5 w-5 text-secondary mx-auto mb-2" />
              <div className="font-cyber text-2xl text-foreground">{categories.length}</div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-accent/30 transition-colors">
              <Activity className="h-5 w-5 text-accent mx-auto mb-2" />
              <div className="font-cyber text-2xl text-foreground">Real</div>
              <div className="text-xs text-muted-foreground">Outputs</div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-warning/30 transition-colors">
              <Shield className="h-5 w-5 text-warning mx-auto mb-2" />
              <div className="font-cyber text-2xl text-foreground">24/7</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-8">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </section>

        {/* Tools Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-lg text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {selectedCategory === 'all' 
                ? 'All Tools' 
                : categories.find((c) => c.id === selectedCategory)?.name}
              <span className="ml-2 text-muted-foreground text-sm font-normal">
                ({filteredTools.length} available)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ToolCard 
                  tool={tool} 
                  onExecute={handleExecute}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Output Panel */}
      <OutputPanel 
        executionId={activeExecutionId} 
        onClose={() => setActiveExecutionId(null)} 
      />
    </div>
  );
}