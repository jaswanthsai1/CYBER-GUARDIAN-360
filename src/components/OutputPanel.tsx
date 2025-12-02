import { useState, useEffect } from 'react';
import { X, Download, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OutputPanelProps {
  executionId: string | null;
  onClose: () => void;
}

interface Execution {
  id: string;
  tool_name: string;
  target: string;
  command: string;
  output: string | null;
  status: string;
  created_at: string;
}

export function OutputPanel({ executionId, onClose }: OutputPanelProps) {
  const [execution, setExecution] = useState<Execution | null>(null);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!executionId) return;

    const fetchExecution = async () => {
      const { data } = await supabase
        .from('tool_executions')
        .select('*')
        .eq('id', executionId)
        .single();
      
      if (data) setExecution(data);
    };

    fetchExecution();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`execution-${executionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tool_executions',
          filter: `id=eq.${executionId}`,
        },
        (payload) => {
          setExecution(payload.new as Execution);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [executionId]);

  const handleCopy = async () => {
    if (!execution?.output) return;
    await navigator.clipboard.writeText(execution.output);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!execution?.output) return;
    const blob = new Blob([execution.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${execution.tool_name}_${execution.target}_output.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Output downloaded');
  };

  if (!executionId) return null;

  return (
    <div className={cn(
      "fixed z-50 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden",
      "transition-all duration-300",
      expanded
        ? "inset-4 md:inset-8"
        : "bottom-4 right-4 left-4 md:left-auto md:w-[600px] h-[400px]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-2 w-2 rounded-full",
            execution?.status === 'completed' ? "bg-primary" : "bg-warning animate-pulse"
          )} />
          <span className="font-mono text-sm text-foreground">
            {execution?.tool_name || 'Loading...'}
          </span>
          <span className="text-xs text-muted-foreground">
            {execution?.target}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Copy output"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Download output"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title={expanded ? "Minimize" : "Expand"}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Command */}
      <div className="px-4 py-2 border-b border-border/30 bg-muted/20">
        <code className="font-mono text-xs text-secondary">
          $ {execution?.command}
        </code>
      </div>

      {/* Output */}
      <div className="p-4 h-[calc(100%-100px)] overflow-auto scan-lines">
        {execution?.status === 'running' ? (
          <div className="flex items-center gap-2 text-warning">
            <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
            <span className="font-mono text-sm typing-cursor">Executing...</span>
          </div>
        ) : (
          <pre className="font-mono text-sm text-primary whitespace-pre-wrap terminal-text">
            {execution?.output || 'No output'}
          </pre>
        )}
      </div>
    </div>
  );
}