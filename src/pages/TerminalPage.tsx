import { Header } from '@/components/Header';
import { Terminal } from '@/components/Terminal';

export default function TerminalPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4">
          <h1 className="font-cyber text-2xl font-bold text-foreground tracking-wider">
            TERMINAL <span className="text-primary text-glow">INTERFACE</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Execute commands directly. Type "help" for available commands.
          </p>
        </div>
        
        <div className="h-[calc(100vh-200px)] min-h-[400px]">
          <Terminal />
        </div>
      </main>
    </div>
  );
}