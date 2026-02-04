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
        className="flex-1 p-3 overflow-auto font-mono text-[13px] leading-relaxed bg-[hsl(220,50%,5%)] scrollbar-thin scrollbar-thumb-[hsl(205,100%,55%,0.3)] scrollbar-track-transparent"
      >
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={cn(
              "whitespace-pre-wrap break-all min-h-[1.3em]",
              line.type === 'input' && "text-[hsl(205,100%,65%)]",
              line.type === 'output' && "text-[hsl(210,100%,90%)]",
              line.type === 'error' && "text-[hsl(0,85%,60%)]",
              line.type === 'info' && "text-[hsl(210,40%,55%)]",
              line.type === 'success' && "text-[hsl(205,100%,55%)]",
              line.type === 'warning' && "text-[hsl(35,100%,55%)]",
              line.type === 'prompt' && "text-[hsl(195,100%,50%)]"
            )}
          >
            {line.content}
          </div>
        ))}
        {isProcessing && (
          <div className="text-[hsl(35,100%,55%)] flex items-center gap-2 mt-1">
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 bg-[hsl(35,100%,55%)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 bg-[hsl(35,100%,55%)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 bg-[hsl(35,100%,55%)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span>Executing...</span>
          </div>
        )}
      </div>
    );
  }
);

TerminalOutput.displayName = 'TerminalOutput';
