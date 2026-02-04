interface TerminalHeaderProps {
  isProcessing: boolean;
  linesCount: number;
  hostname: string;
}

export function TerminalHeader({ isProcessing, linesCount, hostname }: TerminalHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[hsl(220,50%,8%)] border-b border-[hsl(205,100%,55%,0.2)]">
      <div className="flex gap-1.5">
        <div className="h-3 w-3 rounded-full bg-[#ff5f56] hover:brightness-125 transition-all cursor-pointer shadow-[0_0_8px_rgba(255,95,86,0.5)]" />
        <div className="h-3 w-3 rounded-full bg-[#ffbd2e] hover:brightness-125 transition-all cursor-pointer shadow-[0_0_8px_rgba(255,189,46,0.5)]" />
        <div className="h-3 w-3 rounded-full bg-[#27c93f] hover:brightness-125 transition-all cursor-pointer shadow-[0_0_8px_rgba(39,201,63,0.5)]" />
      </div>
      <span className="font-mono text-xs text-[hsl(210,40%,50%)] ml-2 flex-1">
        {hostname} — bash
      </span>
      <div className="flex items-center gap-3">
        {isProcessing && (
          <span className="text-xs text-[hsl(35,100%,55%)] animate-pulse flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 bg-[hsl(35,100%,55%)] rounded-full animate-ping" />
            Running...
          </span>
        )}
        <span className="text-xs text-[hsl(210,40%,50%)]">{linesCount} lines</span>
      </div>
    </div>
  );
}
