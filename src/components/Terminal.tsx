import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { tools } from '@/lib/tools';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
  timestamp: Date;
}

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'info', content: '╔══════════════════════════════════════════════════════════════╗', timestamp: new Date() },
    { type: 'info', content: '║           CYBER GUARD 360 - TERMINAL INTERFACE               ║', timestamp: new Date() },
    { type: 'info', content: '║     Type "help" for available commands or tool names         ║', timestamp: new Date() },
    { type: 'info', content: '╚══════════════════════════════════════════════════════════════╝', timestamp: new Date() },
    { type: 'output', content: '', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (type: TerminalLine['type'], content: string) => {
    setLines((prev) => [...prev, { type, content, timestamp: new Date() }]);
  };

  const processCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(' ');
    const command = parts[0];
    const args = parts.slice(1).join(' ');

    if (command === 'help') {
      addLine('info', '');
      addLine('info', '┌─ Available Commands ─────────────────────────────────────────┐');
      addLine('info', '│ help          - Show this help message                       │');
      addLine('info', '│ clear         - Clear terminal                               │');
      addLine('info', '│ tools         - List all available tools                     │');
      addLine('info', '│ history       - Show command history                         │');
      addLine('info', '│ <tool> <target> - Execute a tool (e.g., nmap example.com)   │');
      addLine('info', '└──────────────────────────────────────────────────────────────┘');
      return;
    }

    if (command === 'clear') {
      setLines([]);
      return;
    }

    if (command === 'tools') {
      addLine('info', '');
      addLine('info', '┌─ Available Tools ────────────────────────────────────────────┐');
      tools.forEach((tool) => {
        addLine('info', `│ ${tool.id.padEnd(15)} - ${tool.description.substring(0, 42).padEnd(42)} │`);
      });
      addLine('info', '└──────────────────────────────────────────────────────────────┘');
      return;
    }

    if (command === 'history') {
      addLine('info', '');
      addLine('info', '┌─ Command History ────────────────────────────────────────────┐');
      history.slice(-10).forEach((h, i) => {
        addLine('info', `│ ${(i + 1).toString().padStart(2)}. ${h.padEnd(57)} │`);
      });
      addLine('info', '└──────────────────────────────────────────────────────────────┘');
      return;
    }

    // Check if it's a tool command
    const tool = tools.find((t) => t.id === command);
    if (tool) {
      if (!args) {
        addLine('error', `[!] Usage: ${tool.id} <target>`);
        addLine('error', `[!] Example: ${tool.id} ${tool.placeholder}`);
        return;
      }

      setIsProcessing(true);
      addLine('info', `[*] Executing ${tool.name}...`);

      try {
        const fullCommand = tool.command.replace('{target}', args);
        
        // Save to database
        const { data, error } = await supabase
          .from('terminal_sessions')
          .insert({
            command: fullCommand,
            output: null,
          })
          .select()
          .single();

        if (error) throw error;

        // Simulate execution
        await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 2000));

        const output = generateOutput(tool.id, args);
        
        // Update with output
        await supabase
          .from('terminal_sessions')
          .update({ output })
          .eq('id', data.id);

        output.split('\n').forEach((line) => {
          addLine('output', line);
        });

      } catch (err) {
        addLine('error', `[!] Error executing ${tool.name}`);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    addLine('error', `[!] Unknown command: ${command}`);
    addLine('error', '[!] Type "help" for available commands');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmd = input.trim();
    addLine('input', `┌──(cyberguard㉿360)-[~]`);
    addLine('input', `└─$ ${cmd}`);
    
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');

    await processCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="h-full flex flex-col bg-cyber-darker rounded-xl border border-border/50 overflow-hidden scan-lines"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-destructive/80" />
          <div className="h-3 w-3 rounded-full bg-warning/80" />
          <div className="h-3 w-3 rounded-full bg-primary/80" />
        </div>
        <span className="font-mono text-xs text-muted-foreground ml-2">
          cyberguard@360:~
        </span>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-auto font-mono text-sm"
      >
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={cn(
              "whitespace-pre-wrap break-all",
              line.type === 'input' && "text-secondary",
              line.type === 'output' && "text-primary terminal-text",
              line.type === 'error' && "text-destructive",
              line.type === 'info' && "text-muted-foreground"
            )}
          >
            {line.content}
          </div>
        ))}
        {isProcessing && (
          <div className="text-warning typing-cursor">Processing...</div>
        )}
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleSubmit} className="border-t border-border/50 p-2">
        <div className="flex items-center gap-2 px-2">
          <span className="text-secondary font-mono text-sm">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder={isProcessing ? "Processing..." : "Enter command..."}
            className={cn(
              "flex-1 bg-transparent font-mono text-sm text-foreground",
              "placeholder:text-muted-foreground/30",
              "focus:outline-none",
              "disabled:opacity-50"
            )}
            autoFocus
          />
        </div>
      </form>
    </div>
  );
}

function generateOutput(toolId: string, target: string): string {
  const outputs: Record<string, string[]> = {
    subfinder: [
      `[INF] Enumerating subdomains for ${target}`,
      `api.${target}`,
      `www.${target}`,
      `mail.${target}`,
      `admin.${target}`,
      `dev.${target}`,
      `[INF] Found 5 subdomains`,
    ],
    nmap: [
      `Starting Nmap 7.94 scan`,
      `Scanning ${target}...`,
      `PORT     STATE SERVICE`,
      `22/tcp   open  ssh`,
      `80/tcp   open  http`,
      `443/tcp  open  https`,
      `Nmap done: 1 IP scanned`,
    ],
    sqlmap: [
      `[*] Testing SQL injection`,
      `[*] Target URL: ${target}`,
      `[+] Parameter vulnerable`,
      `[*] Database: MySQL`,
    ],
  };

  return (outputs[toolId] || [
    `[*] Running ${toolId} on ${target}`,
    `[*] Scan complete`,
    `[+] Results saved`,
  ]).join('\n');
}