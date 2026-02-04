import { cn } from '@/lib/utils';

interface TerminalHeaderProps {
  isProcessing: boolean;
  linesCount: number;
  hostname: string;
}

export function TerminalHeader({ isProcessing, linesCount, hostname }: TerminalHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] border-b border-[#2d2d44]">
      <div className="flex gap-1.5">
        <div className="h-3 w-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all cursor-pointer" />
        <div className="h-3 w-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all cursor-pointer" />
        <div className="h-3 w-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-all cursor-pointer" />
      </div>
      <span className="font-mono text-xs text-[#6272a4] ml-2 flex-1">
        {hostname} — bash
      </span>
      <div className="flex items-center gap-3">
        {isProcessing && (
          <span className="text-xs text-[#50fa7b] animate-pulse flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-[#50fa7b] rounded-full animate-ping" />
            Running...
          </span>
        )}
        <span className="text-xs text-[#6272a4]">{linesCount} lines</span>
      </div>
    </div>
  );
}
