import { useState, useRef, useEffect, useCallback } from 'react';
import { TerminalHeader } from './TerminalHeader';
import { TerminalOutput, TerminalLine } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';
import { linuxCommands, resolvePath } from './linuxCommands';
import { supabase } from '@/integrations/supabase/client';
import { tools } from '@/lib/tools';

// Security tools that trigger backend execution
const securityToolNames = [
  'nmap', 'subfinder', 'amass', 'sublist3r', 'waybackurls', 'gau', 'masscan', 
  'rustscan', 'httpprobe', 'nuclei', 'nikto', 'whatweb', 'sqlmap', 'xsstrike', 
  'commix', 'gobuster', 'ffuf', 'dirsearch', 'wfuzz', 'arjun', 'paramspider', 
  'dnsenum', 'dnsrecon', 'ipinfo', 'whois', 'httpx'
];

const BANNER = `
┌──────────────────────────────────────────────────────────────────────┐
│      _  __     _   _   _             _                               │
│     | |/ /__ _| | (_) | |    (_)_ __  _   ___  __                    │
│     | ' // _\` | | | | | |    | | '_ \\| | | \\ \\/ /                    │
│     | . \\ (_| | | | | | |____| | | | | |_| |>  <                     │
│     |_|\\_\\__,_|_|_|_| |______|_|_| |_|\\__,_/_/\\_\\                    │
│                                                                      │
│                    NetHunter Terminal v3.0                           │
│             Professional Penetration Testing Suite                   │
├──────────────────────────────────────────────────────────────────────┤
│  Type 'help' for commands  │  Type 'tools' to list security tools   │
└──────────────────────────────────────────────────────────────────────┘
`;

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState('/home/kali');
  const { user } = useAuth();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initialize with banner
  useEffect(() => {
    const bannerLines = BANNER.split('\n').map(line => ({
      type: 'success' as const,
      content: line,
      timestamp: new Date(),
    }));
    setLines(bannerLines);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = useCallback((type: TerminalLine['type'], content: string) => {
    setLines(prev => [...prev, { type, content, timestamp: new Date() }]);
  }, []);

  const addLines = useCallback((type: TerminalLine['type'], content: string) => {
    const newLines = content.split('\n').map(line => ({
      type,
      content: line,
      timestamp: new Date(),
    }));
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const clearTerminal = useCallback(() => {
    setLines([]);
  }, []);

  const isSecurityTool = (cmd: string): boolean => {
    return securityToolNames.includes(cmd.toLowerCase());
  };

  const formatPrompt = (dir: string): string => {
    const displayDir = dir.replace('/home/kali', '~');
    return `┌──(kali㉿nethunter)-[${displayDir}]\n└─$ `;
  };

  const processCommand = useCallback(async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Handle clear command specially
    if (command === 'clear' || command === 'cls') {
      clearTerminal();
      return;
    }

    // Handle banner command
    if (command === 'banner') {
      addLines('success', BANNER);
      return;
    }

    // Handle tools command
    if (command === 'tools') {
      const output = `
┌─────────────────────── SECURITY TOOLS ──────────────────────────┐
│                                                                 │
│  [RECONNAISSANCE]                                               │
│    subfinder      - Fast passive subdomain enumeration          │
│    amass          - In-depth DNS enumeration                    │
│    sublist3r      - Subdomain enumeration via search engines    │
│    waybackurls    - Fetch URLs from Wayback Machine             │
│    gau            - GetAllUrls from AlienVault                  │
│                                                                 │
│  [SCANNING]                                                     │
│    nmap           - Network discovery and security auditing     │
│    masscan        - Fast port scanner for large networks        │
│    rustscan       - Modern port scanner in Rust                 │
│    nuclei         - Vulnerability scanner with templates        │
│    nikto          - Web server scanner                          │
│    whatweb        - Web technology fingerprinting               │
│                                                                 │
│  [EXPLOITATION]                                                 │
│    sqlmap         - SQL injection and database takeover         │
│    xsstrike       - Advanced XSS detection                      │
│    commix         - Command injection exploiter                 │
│                                                                 │
│  [FUZZING]                                                      │
│    gobuster       - Directory/DNS/VHost busting                 │
│    ffuf           - Fast web fuzzer                             │
│    dirsearch      - Web path discovery                          │
│    wfuzz          - Web application fuzzer                      │
│    arjun          - HTTP parameter discovery                    │
│                                                                 │
│  [OSINT]                                                        │
│    paramspider    - Mining parameters from web archives         │
│    ipinfo         - IP geolocation and network info             │
│    dnsenum        - DNS enumeration                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Usage: <tool_name> <target>
Example: nmap -sV -O example.com
         subfinder -d example.com
         gobuster dir -u https://example.com -w wordlist.txt
`.trim();
      addLines('info', output);
      return;
    }

    // Handle history command with actual history
    if (command === 'history') {
      if (history.length === 0) {
        addLine('info', '  (no history)');
        return;
      }
      const historyOutput = history.slice(-20).map((h, i) => 
        `  ${(i + 1).toString().padStart(4)}  ${h}`
      ).join('\n');
      addLines('info', historyOutput);
      return;
    }

    // Check if it's a built-in Linux command
    if (linuxCommands[command]) {
      const result = linuxCommands[command](args, currentDir, setCurrentDir);
      if (result === '__CLEAR__') {
        clearTerminal();
        return;
      }
      if (result) {
        addLines('output', result);
      }
      return;
    }

    // Check if it's a security tool
    if (isSecurityTool(command)) {
      const target = args.find(a => !a.startsWith('-'));
      
      if (!target) {
        const tool = tools.find(t => t.id === command);
        addLine('error', `[!] Error: Missing target argument`);
        addLine('info', `[*] Usage: ${command} <options> <target>`);
        addLine('info', `[*] Example: ${tool?.command.replace('{target}', tool?.placeholder || 'example.com') || `${command} example.com`}`);
        return;
      }

      setIsProcessing(true);
      addLine('info', `[*] Initializing ${command}...`);
      addLine('info', `[*] Target: ${target}`);
      addLine('info', `[*] Command: ${trimmed}`);
      addLine('info', `[*] Connecting to security backend...`);

      try {
        // Save to database
        const { data: sessionData, error: sessionError } = await supabase
          .from('terminal_sessions')
          .insert({ command: trimmed, output: null, user_id: user?.id })
          .select()
          .single();

        if (sessionError) throw sessionError;

        // Call edge function
        const { data: result, error: fnError } = await supabase.functions.invoke('security-tools', {
          body: { 
            toolId: command,
            target,
            command: trimmed
          }
        });

        if (fnError) throw fnError;

        if (result?.success && result?.output) {
          addLine('info', '');
          addLines('output', result.output);
          addLine('info', '');
          addLine('success', `[✓] Scan completed successfully`);
          
          // Update database with output
          await supabase
            .from('terminal_sessions')
            .update({ output: result.output })
            .eq('id', sessionData.id);
        } else {
          throw new Error(result?.error || 'Unknown error from security backend');
        }
      } catch (err) {
        addLine('error', `[!] Error executing command`);
        addLine('error', `[!] ${err instanceof Error ? err.message : 'Unknown error'}`);
        addLine('info', `[*] Tip: Check your target format and try again`);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Unknown command
    addLine('error', `bash: ${command}: command not found`);
    addLine('info', `Type 'help' for available commands or 'tools' for security tools`);
  }, [currentDir, history, addLine, addLines, clearTerminal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmd = input.trim();
    
    // Add prompt and command to output
    const displayDir = currentDir.replace('/home/kali', '~');
    addLine('prompt', `┌──(kali㉿nethunter)-[${displayDir}]`);
    addLine('input', `└─$ ${cmd}`);
    
    // Update history
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');

    await processCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete with tools and commands
      const partial = input.toLowerCase();
      if (partial) {
        // First try security tools
        const toolMatch = [...securityToolNames, ...Object.keys(linuxCommands)]
          .find(t => t.startsWith(partial));
        if (toolMatch) {
          setInput(toolMatch + ' ');
        }
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      if (isProcessing) {
        setIsProcessing(false);
        addLine('error', '^C');
      } else {
        addLine('prompt', `┌──(kali㉿nethunter)-[${currentDir.replace('/home/kali', '~')}]`);
        addLine('input', `└─$ ${input}^C`);
        setInput('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clearTerminal();
    }
  };

  return (
    <div 
      className="h-full flex flex-col bg-[hsl(220,50%,5%)] rounded-xl border border-[hsl(205,100%,55%,0.2)] overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)]"
      onClick={() => inputRef.current?.focus()}
    >
      <TerminalHeader 
        isProcessing={isProcessing}
        linesCount={lines.length}
        hostname="kali@nethunter"
      />
      
      <TerminalOutput 
        ref={terminalRef}
        lines={lines}
        isProcessing={isProcessing}
        currentDir={currentDir}
      />
      
      <TerminalInput 
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
        isProcessing={isProcessing}
        currentDir={currentDir.replace('/home/kali', '~')}
        username="kali"
        hostname="nethunter"
      />
    </div>
  );
}

export default Terminal;
