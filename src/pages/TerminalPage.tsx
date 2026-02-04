import { Header } from '@/components/Header';
import { Terminal } from '@/components/terminal';

export default function TerminalPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-6">
        <div className="mb-4">
          <h1 className="font-mono text-xl font-bold text-[#50fa7b] tracking-wider flex items-center gap-2">
            <span className="text-[#ff79c6]">$</span> NETHUNTER 
            <span className="text-[#bd93f9]">TERMINAL</span>
          </h1>
          <p className="text-[#6272a4] text-sm mt-1 font-mono">
            Execute security tools and Linux commands. Type "help" for available commands.
          </p>
        </div>
        
        <div className="h-[calc(100vh-180px)] min-h-[500px]">
          <Terminal />
        </div>
      </main>
    </div>
  );
}