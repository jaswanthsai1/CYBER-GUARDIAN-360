import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info' | 'success' | 'warning' | 'prompt';
  content: string;
  timestamp: Date;
}

interface TerminalOutputProps {
  lines: TerminalLine[];
  isProcessing: boolean;
  currentDir: string;
}

export const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  ({ lines, isProcessing, currentDir }, ref) => {
    return (
      <div 
        ref={ref}
        className="flex-1 p-3 overflow-auto font-mono text-[13px] leading-relaxed bg-[#0d1117] scrollbar-thin scrollbar-thumb-[#2d2d44] scrollbar-track-transparent"
      >
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={cn(
              "whitespace-pre-wrap break-all min-h-[1.3em]",
              line.type === 'input' && "text-[#50fa7b]",
              line.type === 'output' && "text-[#f8f8f2]",
              line.type === 'error' && "text-[#ff5555]",
              line.type === 'info' && "text-[#6272a4]",
              line.type === 'success' && "text-[#50fa7b]",
              line.type === 'warning' && "text-[#ffb86c]",
              line.type === 'prompt' && "text-[#bd93f9]"
            )}
          >
            {line.content}
          </div>
        ))}
        {isProcessing && (
          <div className="text-[#ffb86c] flex items-center gap-2 mt-1">
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 bg-[#ffb86c] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 bg-[#ffb86c] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 bg-[#ffb86c] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span>Executing...</span>
          </div>
        )}
      </div>
    );
  }
);

TerminalOutput.displayName = 'TerminalOutput';
