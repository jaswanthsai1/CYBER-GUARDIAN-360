import { useState } from 'react';
import { Header } from '@/components/Header';
import { ToolCard } from '@/components/ToolCard';
import { OutputPanel } from '@/components/OutputPanel';
import { CategoryFilter } from '@/components/CategoryFilter';
import { tools, categories, Category, Tool } from '@/lib/tools';
import { Shield, Zap, Terminal, Database } from 'lucide-react';
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
        <section className="mb-12 text-center">
          <div className="relative inline-block mb-6">
            <Shield className="h-20 w-20 text-primary mx-auto animate-glow-pulse" />
            <div className="absolute inset-0 blur-2xl bg-primary/20" />
          </div>
          <h1 className="font-cyber text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-wider">
            CYBER GUARD <span className="text-primary text-glow">360</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Professional bug bounty and penetration testing toolkit. Execute 20+ security tools 
            directly from your browser. Mobile-ready for on-the-go reconnaissance.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/50">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm">{tools.length} Tools</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/50">
              <Database className="h-4 w-4 text-secondary" />
              <span className="font-mono text-sm">{categories.length} Categories</span>
            </div>
            <Link 
              to="/terminal"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors"
            >
              <Terminal className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-primary">Open Terminal</span>
            </Link>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-8">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </section>

        {/* Tools Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-lg text-foreground">
              {selectedCategory === 'all' 
                ? 'All Tools' 
                : categories.find((c) => c.id === selectedCategory)?.name}
              <span className="ml-2 text-muted-foreground text-sm">
                ({filteredTools.length})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                onExecute={handleExecute}
              />
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