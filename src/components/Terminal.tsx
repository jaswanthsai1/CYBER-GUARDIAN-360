import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { tools } from '@/lib/tools';
import { generateRealisticOutput } from '@/lib/realistic-outputs';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info' | 'success';
  content: string;
  timestamp: Date;
}

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'info', content: '╔══════════════════════════════════════════════════════════════════════╗', timestamp: new Date() },
    { type: 'info', content: '║                    CYBER GUARD 360 - TERMINAL v2.1                   ║', timestamp: new Date() },
    { type: 'info', content: '║              Professional Bug Bounty & Pentest Toolkit               ║', timestamp: new Date() },
    { type: 'info', content: '╠══════════════════════════════════════════════════════════════════════╣', timestamp: new Date() },
    { type: 'info', content: '║  Type "help" for commands  |  Type "tools" to list available tools   ║', timestamp: new Date() },
    { type: 'info', content: '╚══════════════════════════════════════════════════════════════════════╝', timestamp: new Date() },
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

  const addLines = (type: TerminalLine['type'], content: string) => {
    const newLines = content.split('\n').map((line) => ({
      type,
      content: line,
      timestamp: new Date(),
    }));
    setLines((prev) => [...prev, ...newLines]);
  };

  const processCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (command === 'help') {
      addLine('info', '');
      addLine('success', '┌─────────────────────── AVAILABLE COMMANDS ───────────────────────┐');
      addLine('info', '│                                                                   │');
      addLine('info', '│  help              - Display this help menu                       │');
      addLine('info', '│  clear / cls       - Clear the terminal screen                    │');
      addLine('info', '│  tools             - List all available security tools            │');
      addLine('info', '│  history           - Show command history                         │');
      addLine('info', '│  whoami            - Display current user info                    │');
      addLine('info', '│  date              - Show current date and time                   │');
      addLine('info', '│  banner            - Display ASCII banner                         │');
      addLine('info', '│  <tool> <target>   - Execute a tool (e.g., nmap example.com)     │');
      addLine('info', '│                                                                   │');
      addLine('success', '└───────────────────────────────────────────────────────────────────┘');
      return;
    }

    if (command === 'clear' || command === 'cls') {
      setLines([]);
      return;
    }

    if (command === 'whoami') {
      addLine('output', 'cyberguard@360-terminal');
      addLine('info', 'Role: Security Analyst');
      addLine('info', 'Access Level: Full');
      return;
    }

    if (command === 'date') {
      addLine('output', new Date().toString());
      return;
    }

    if (command === 'banner') {
      addLine('success', '');
      addLine('success', '   ██████╗██╗   ██╗██████╗ ███████╗██████╗      ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗ ');
      addLine('success', '  ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗    ██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗');
      addLine('success', '  ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝    ██║  ███╗██║   ██║███████║██████╔╝██║  ██║');
      addLine('success', '  ██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗    ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║');
      addLine('success', '  ╚██████╗   ██║   ██████╔╝███████╗██║  ██║    ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝');
      addLine('success', '   ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ');
      addLine('info', '                              [ 360 SECURITY TOOLKIT ]');
      addLine('success', '');
      return;
    }

    if (command === 'tools') {
      addLine('info', '');
      addLine('success', '┌─────────────────────── AVAILABLE TOOLS ──────────────────────────┐');
      addLine('info', '│                                                                   │');
      
      const categories = ['recon', 'scanning', 'exploitation', 'fuzzing', 'osint'];
      categories.forEach((cat) => {
        const catTools = tools.filter((t) => t.category === cat);
        if (catTools.length > 0) {
          addLine('info', `│  [${cat.toUpperCase()}]`);
          catTools.forEach((tool) => {
            const paddedName = tool.id.padEnd(15);
            const desc = tool.description.substring(0, 42).padEnd(42);
            addLine('info', `│    ${paddedName} - ${desc}│`);
          });
          addLine('info', '│                                                                   │');
        }
      });
      
      addLine('success', '└───────────────────────────────────────────────────────────────────┘');
      addLine('info', '');
      addLine('info', 'Usage: <tool_name> <target>');
      addLine('info', 'Example: subfinder example.com');
      return;
    }

    if (command === 'history') {
      addLine('info', '');
      addLine('success', '┌─────────────────────── COMMAND HISTORY ──────────────────────────┐');
      history.slice(-15).forEach((h, i) => {
        addLine('info', `│  ${(i + 1).toString().padStart(2)}. ${h.padEnd(60)}│`);
      });
      if (history.length === 0) {
        addLine('info', '│  No commands in history                                          │');
      }
      addLine('success', '└───────────────────────────────────────────────────────────────────┘');
      return;
    }

    // Check if it's a tool command
    const tool = tools.find((t) => t.id === command);
    if (tool) {
      if (!args) {
        addLine('error', `[!] Error: Missing target argument`);
        addLine('info', `[*] Usage: ${tool.id} <target>`);
        addLine('info', `[*] Example: ${tool.id} ${tool.placeholder}`);
        return;
      }

      setIsProcessing(true);
      addLine('info', '');
      addLine('info', `[*] Initializing ${tool.name}...`);
      addLine('info', `[*] Target: ${args}`);
      addLine('info', `[*] Please wait...`);

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

        // Simulate realistic execution time
        const execTime = 1500 + Math.random() * 3000;
        await new Promise((resolve) => setTimeout(resolve, execTime));

        // Generate realistic output
        const output = generateRealisticOutput(tool.id, args);
        
        // Update with output
        await supabase
          .from('terminal_sessions')
          .update({ output })
          .eq('id', data.id);

        addLine('info', '');
        addLines('output', output);
        addLine('info', '');
        addLine('success', `[+] ${tool.name} completed successfully`);
        addLine('success', `[+] Output saved to ${tool.id}_output.txt`);

      } catch (err) {
        addLine('error', `[!] Error executing ${tool.name}`);
        addLine('error', `[!] ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    addLine('error', `[!] Command not found: ${command}`);
    addLine('info', '[*] Type "help" for available commands or "tools" to list security tools');
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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete tool names
      const partial = input.toLowerCase();
      const match = tools.find((t) => t.id.startsWith(partial));
      if (match) {
        setInput(match.id + ' ');
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
          <div className="h-3 w-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors cursor-pointer" />
          <div className="h-3 w-3 rounded-full bg-warning/80 hover:bg-warning transition-colors cursor-pointer" />
          <div className="h-3 w-3 rounded-full bg-primary/80 hover:bg-primary transition-colors cursor-pointer" />
        </div>
        <span className="font-mono text-xs text-muted-foreground ml-2 flex-1">
          cyberguard@360:~ — bash
        </span>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <span className="text-xs text-warning animate-pulse">● Processing</span>
          )}
          <span className="text-xs text-muted-foreground">{lines.length} lines</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed"
      >
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={cn(
              "whitespace-pre-wrap break-all",
              line.type === 'input' && "text-secondary",
              line.type === 'output' && "text-primary terminal-text",
              line.type === 'error' && "text-destructive",
              line.type === 'info' && "text-muted-foreground",
              line.type === 'success' && "text-primary text-glow"
            )}
          >
            {line.content}
          </div>
        ))}
        {isProcessing && (
          <div className="text-warning flex items-center gap-2 mt-2">
            <span className="inline-block h-2 w-2 bg-warning rounded-full animate-pulse" />
            <span className="typing-cursor">Processing...</span>
          </div>
        )}
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleSubmit} className="border-t border-border/50 bg-muted/10">
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="text-secondary font-mono text-sm">┌──(cyberguard㉿360)-[~]</span>
        </div>
        <div className="flex items-center gap-2 px-4 pb-3">
          <span className="text-secondary font-mono text-sm">└─$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder={isProcessing ? "Processing..." : "Enter command... (Tab to autocomplete)"}
            className={cn(
              "flex-1 bg-transparent font-mono text-sm text-foreground",
              "placeholder:text-muted-foreground/30",
              "focus:outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            autoFocus
          />
        </div>
      </form>
    </div>
  );
}