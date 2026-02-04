import { useState } from 'react';
import { Header } from '@/components/Header';
import { ToolCard } from '@/components/ToolCard';
import { OutputPanel } from '@/components/OutputPanel';
import { CategoryFilter } from '@/components/CategoryFilter';
import { tools, categories, Category, Tool } from '@/lib/tools';
import { Zap, Terminal, Database, FileText, Activity, Shield, ChevronRight, Cpu, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import cyberGuardianLogo from '@/assets/cyber-guardian-logo.png';

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
        <section className="mb-16 text-center relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
            <div className="absolute inset-0 grid-pattern opacity-30" />
          </div>

          {/* Logo */}
          <div className="relative inline-block mb-8 float">
            <img 
              src={cyberGuardianLogo} 
              alt="Cyber Guardian 360" 
              className="h-48 md:h-64 w-auto mx-auto drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]"
            />
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed font-light">
            Professional <span className="text-primary font-medium">Bug Bounty</span> & 
            <span className="text-secondary font-medium"> Penetration Testing</span> Toolkit
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Execute <span className="text-primary font-semibold">{tools.length}+</span> real security tools directly from your browser.
            Real-time results from industry-standard reconnaissance, scanning, and exploitation tools.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link 
              to="/terminal"
              className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-mono text-sm font-semibold hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300 active:scale-95"
            >
              <Terminal className="h-5 w-5" />
              Launch Terminal
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/files"
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-card border border-primary/30 text-primary font-mono text-sm font-medium hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <FileText className="h-5 w-5" />
              View Output Files
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="group p-5 rounded-xl glass card-hover border border-primary/20">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="font-cyber text-3xl text-foreground mb-1">{tools.length}+</div>
              <div className="text-sm text-muted-foreground">Security Tools</div>
            </div>
            <div className="group p-5 rounded-xl glass card-hover border border-secondary/20">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                <Database className="h-6 w-6 text-secondary" />
              </div>
              <div className="font-cyber text-3xl text-foreground mb-1">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="group p-5 rounded-xl glass card-hover border border-accent/20">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <Activity className="h-6 w-6 text-accent" />
              </div>
              <div className="font-cyber text-3xl text-foreground mb-1">Live</div>
              <div className="text-sm text-muted-foreground">Real Results</div>
            </div>
            <div className="group p-5 rounded-xl glass card-hover border border-primary/20">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="font-cyber text-3xl text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass border border-primary/20 card-hover">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4">
                <Cpu className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-cyber text-lg text-foreground mb-2">Real-Time Execution</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Execute actual security scans with real outputs from crt.sh, DNS resolvers, HTTP probing, and more.
              </p>
            </div>
            <div className="p-6 rounded-2xl glass border border-secondary/20 card-hover">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center mb-4">
                <Globe className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-cyber text-lg text-foreground mb-2">Browser-Based</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No installation required. Access your security toolkit from any device, anywhere in the world.
              </p>
            </div>
            <div className="p-6 rounded-2xl glass border border-accent/20 card-hover">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mb-4">
                <Lock className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-cyber text-lg text-foreground mb-2">Professional Grade</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Industry-standard tools used by professional pentesters and bug bounty hunters worldwide.
              </p>
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
            <h2 className="font-mono text-lg text-foreground flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_hsl(35,100%,55%)]" />
              {selectedCategory === 'all' 
                ? 'All Security Tools' 
                : categories.find((c) => c.id === selectedCategory)?.name}
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                {filteredTools.length} available
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
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
