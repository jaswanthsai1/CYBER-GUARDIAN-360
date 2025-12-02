import { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { Tool } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ToolCardProps {
  tool: Tool;
  onExecute: (execution: { id: string; tool: Tool; target: string }) => void;
}

export function ToolCard({ tool, onExecute }: ToolCardProps) {
  const [target, setTarget] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleExecute = async () => {
    if (!target.trim()) {
      toast.error('Please enter a target');
      return;
    }

    setIsRunning(true);

    try {
      const command = tool.command.replace('{target}', target);
      
      // Insert execution record
      const { data, error } = await supabase
        .from('tool_executions')
        .insert({
          tool_name: tool.name,
          category: tool.category,
          target: target,
          command: command,
          status: 'running',
        })
        .select()
        .single();

      if (error) throw error;

      // Simulate tool execution (in production, this would call a backend)
      const simulatedOutput = generateSimulatedOutput(tool, target);
      
      // Update with output after delay
      setTimeout(async () => {
        await supabase
          .from('tool_executions')
          .update({
            output: simulatedOutput,
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', data.id);

        setIsRunning(false);
        onExecute({ id: data.id, tool, target });
        toast.success(`${tool.name} completed`);
      }, 2000 + Math.random() * 3000);

    } catch (error) {
      setIsRunning(false);
      toast.error('Execution failed');
      console.error(error);
    }
  };

  return (
    <div className={cn(
      "group relative p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm",
      "hover:border-primary/50 hover:bg-card transition-all duration-300",
      "hover:shadow-[0_0_30px_hsl(var(--primary)/0.1)]"
    )}>
      {/* Tool Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{tool.icon}</span>
          <div>
            <h3 className="font-mono font-semibold text-foreground group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <p className="text-xs text-muted-foreground">{tool.description}</p>
          </div>
        </div>
      </div>

      {/* Command Preview */}
      <div className="mb-3 p-2 rounded-lg bg-muted/50 font-mono text-xs text-muted-foreground overflow-x-auto">
        <code>{tool.command}</code>
      </div>

      {/* Input and Execute */}
      <div className="flex gap-2">
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={tool.placeholder}
          disabled={isRunning}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg font-mono text-sm",
            "bg-input border border-border/50 text-foreground placeholder:text-muted-foreground/50",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all"
          )}
          onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
        />
        <button
          onClick={handleExecute}
          disabled={isRunning}
          className={cn(
            "px-4 py-2 rounded-lg font-mono text-sm font-medium",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "flex items-center gap-2"
          )}
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isRunning ? 'Running' : 'Run'}
        </button>
      </div>
    </div>
  );
}

// Simulated output generator for demo
function generateSimulatedOutput(tool: Tool, target: string): string {
  const outputs: Record<string, string[]> = {
    subfinder: [
      `[INF] Enumerating subdomains for ${target}`,
      `api.${target}`,
      `www.${target}`,
      `mail.${target}`,
      `admin.${target}`,
      `dev.${target}`,
      `staging.${target}`,
      `[INF] Found 6 subdomains for ${target}`,
    ],
    nmap: [
      `Starting Nmap scan for ${target}`,
      `PORT     STATE SERVICE VERSION`,
      `22/tcp   open  ssh     OpenSSH 8.4`,
      `80/tcp   open  http    nginx 1.18.0`,
      `443/tcp  open  https   nginx 1.18.0`,
      `3306/tcp open  mysql   MySQL 8.0`,
      `Nmap done: 1 IP address (1 host up) scanned`,
    ],
    sqlmap: [
      `[*] Starting SQL injection scan`,
      `[*] Testing connection to the target URL`,
      `[*] Testing for SQL injection on parameter 'id'`,
      `[+] Possible SQL injection found`,
      `[*] Database: MySQL >= 5.0`,
      `[*] Payload: ' OR 1=1--`,
    ],
    nuclei: [
      `[INF] Running nuclei on ${target}`,
      `[low] Missing X-Frame-Options Header`,
      `[medium] Outdated jQuery version detected`,
      `[info] Technology detected: nginx`,
      `[info] WordPress installation found`,
    ],
    gobuster: [
      `Gobuster v3.1.0`,
      `/admin         (Status: 301)`,
      `/api           (Status: 200)`,
      `/backup        (Status: 403)`,
      `/config        (Status: 403)`,
      `/uploads       (Status: 301)`,
      `/.git          (Status: 403)`,
    ],
  };

  const defaultOutput = [
    `[*] Executing ${tool.name} against ${target}`,
    `[*] Scanning in progress...`,
    `[+] Scan completed successfully`,
    `[*] Results saved to output.txt`,
  ];

  return (outputs[tool.id] || defaultOutput).join('\n');
}