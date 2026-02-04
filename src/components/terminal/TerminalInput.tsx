import { forwardRef, KeyboardEvent, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface TerminalInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  currentDir: string;
  username: string;
  hostname: string;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ value, onChange, onKeyDown, onSubmit, isProcessing, currentDir, username, hostname }, ref) => {
    return (
      <form onSubmit={onSubmit} className="border-t border-[#2d2d44] bg-[#0d1117]">
        <div className="flex items-center px-3 py-2">
          <span className="text-[#ff79c6] font-mono text-[13px] font-semibold">┌──(</span>
          <span className="text-[#50fa7b] font-mono text-[13px] font-bold">{username}㉿{hostname}</span>
          <span className="text-[#ff79c6] font-mono text-[13px] font-semibold">)-[</span>
          <span className="text-[#8be9fd] font-mono text-[13px] font-bold">{currentDir}</span>
          <span className="text-[#ff79c6] font-mono text-[13px] font-semibold">]</span>
        </div>
        <div className="flex items-center px-3 pb-3">
          <span className="text-[#ff79c6] font-mono text-[13px] font-semibold">└─</span>
          <span className="text-[#50fa7b] font-mono text-[13px] font-bold mr-2">$</span>
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={isProcessing}
            placeholder={isProcessing ? "Executing..." : ""}
            className={cn(
              "flex-1 bg-transparent font-mono text-[13px] text-[#f8f8f2] caret-[#50fa7b]",
              "placeholder:text-[#44475a]",
              "focus:outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </form>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';
