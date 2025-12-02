import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Clock, Terminal, Play, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Execution {
  id: string;
  tool_name: string;
  category: string;
  target: string;
  command: string;
  output: string | null;
  status: string;
  created_at: string;
}

export default function HistoryPage() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchExecutions();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('executions-history')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tool_executions',
        },
        () => {
          fetchExecutions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchExecutions = async () => {
    const { data, error } = await supabase
      .from('tool_executions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      toast.error('Failed to load history');
    } else {
      setExecutions(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('tool_executions')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Deleted');
      if (selectedId === id) setSelectedId(null);
    }
  };

  const handleDownload = (exec: Execution) => {
    if (!exec.output) return;
    const blob = new Blob([exec.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exec.tool_name}_${exec.target}_output.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedExecution = executions.find((e) => e.id === selectedId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-cyber text-2xl font-bold text-foreground tracking-wider">
            EXECUTION <span className="text-primary text-glow">HISTORY</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            View all previous tool executions and their outputs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Executions List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                Loading history...
              </div>
            ) : executions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-border/50 rounded-xl bg-card/30">
                <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No executions yet</p>
                <p className="text-sm">Run a tool to see results here</p>
              </div>
            ) : (
              executions.map((exec) => (
                <div
                  key={exec.id}
                  onClick={() => setSelectedId(exec.id)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all duration-300",
                    selectedId === exec.id
                      ? "border-primary bg-primary/10 cyber-glow"
                      : "border-border/50 bg-card/50 hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        exec.status === 'completed' ? "bg-primary" : "bg-warning animate-pulse"
                      )} />
                      <div>
                        <h3 className="font-mono font-semibold text-foreground">
                          {exec.tool_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{exec.target}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground capitalize px-2 py-1 rounded bg-muted/50">
                        {exec.category}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(exec.created_at), 'MMM d, HH:mm')}
                    </div>
                    <div className="flex items-center gap-1">
                      {exec.output && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(exec);
                          }}
                          className="p-1 hover:text-primary transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(exec.id);
                        }}
                        className="p-1 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Output Viewer */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                <h3 className="font-mono text-sm text-foreground">
                  {selectedExecution ? selectedExecution.tool_name : 'Output Viewer'}
                </h3>
                {selectedExecution && (
                  <code className="text-xs text-secondary block mt-1">
                    $ {selectedExecution.command}
                  </code>
                )}
              </div>
              <div className="p-4 min-h-[400px] max-h-[600px] overflow-auto scan-lines">
                {selectedExecution ? (
                  <pre className="font-mono text-sm text-primary whitespace-pre-wrap terminal-text">
                    {selectedExecution.output || 'No output available'}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <div className="text-center">
                      <Play className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Select an execution to view output</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}