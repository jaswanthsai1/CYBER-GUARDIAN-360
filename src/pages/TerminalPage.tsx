import { Header } from '@/components/Header';
import { Terminal } from '@/components/terminal';

export default function TerminalPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="font-cyber text-xl font-bold text-primary tracking-wider flex items-center gap-2">
              <span className="text-accent">$</span> NETHUNTER 
              <span className="text-secondary">TERMINAL</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-mono">
              Execute security tools and Linux commands. Type "help" for available commands.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_hsl(35,100%,55%)]" />
            <span className="font-mono text-xs text-accent font-medium">ACTIVE</span>
          </div>
        </div>
        
        <div className="h-[calc(100vh-180px)] min-h-[500px]">
          <Terminal />
        </div>
      </main>
    </div>
  );
}