import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { FileText, Download, Eye, Trash2, Search, Filter, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface OutputFile {
  id: string;
  tool_name: string;
  category: string;
  target: string;
  output: string | null;
  created_at: string;
  filename: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<OutputFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<OutputFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('tool_executions')
      .select('*')
      .not('output', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load files');
    } else {
      const filesWithNames = (data || []).map((item) => ({
        ...item,
        filename: `${item.tool_name.toLowerCase()}_${item.target.replace(/[^a-zA-Z0-9]/g, '_')}_output.txt`,
      }));
      setFiles(filesWithNames);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('tool_executions')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete file');
    } else {
      toast.success('File deleted');
      setFiles(files.filter((f) => f.id !== id));
      if (selectedFile?.id === id) setSelectedFile(null);
    }
  };

  const handleDownload = (file: OutputFile) => {
    if (!file.output) return;
    const blob = new Blob([file.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  const handleDownloadAll = () => {
    const filteredFiles = getFilteredFiles();
    if (filteredFiles.length === 0) return;
    
    const content = filteredFiles.map((f) => 
      `${'='.repeat(60)}\nFile: ${f.filename}\nTool: ${f.tool_name}\nTarget: ${f.target}\nDate: ${f.created_at}\n${'='.repeat(60)}\n\n${f.output}\n\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberguard360_all_outputs_${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('All files downloaded');
  };

  const categories = ['all', ...new Set(files.map((f) => f.category))];

  const getFilteredFiles = () => {
    return files.filter((f) => {
      const matchesSearch = 
        f.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tool_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredFiles = getFilteredFiles();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-cyber text-2xl font-bold text-foreground tracking-wider">
            OUTPUT <span className="text-primary text-glow">FILES</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            View and download all scan outputs and results
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg font-mono text-sm",
                "bg-input border border-border/50 text-foreground placeholder:text-muted-foreground/50",
                "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              )}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={cn(
                  "pl-10 pr-8 py-2 rounded-lg font-mono text-sm appearance-none",
                  "bg-input border border-border/50 text-foreground",
                  "focus:outline-none focus:border-primary"
                )}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleDownloadAll}
              disabled={filteredFiles.length === 0}
              className={cn(
                "px-4 py-2 rounded-lg font-mono text-sm",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 disabled:opacity-50",
                "flex items-center gap-2"
              )}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download All</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl border border-border/50 bg-card/50">
            <div className="text-2xl font-cyber text-primary">{files.length}</div>
            <div className="text-xs text-muted-foreground">Total Files</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/50">
            <div className="text-2xl font-cyber text-secondary">{filteredFiles.length}</div>
            <div className="text-xs text-muted-foreground">Showing</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/50">
            <div className="text-2xl font-cyber text-foreground">{categories.length - 1}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/50">
            <div className="text-2xl font-cyber text-accent">
              {(files.reduce((acc, f) => acc + (f.output?.length || 0), 0) / 1024).toFixed(1)}KB
            </div>
            <div className="text-xs text-muted-foreground">Total Size</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Files List */}
          <div className="space-y-2 max-h-[600px] overflow-auto pr-2">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                Loading files...
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-border/50 rounded-xl bg-card/30">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No output files found</p>
                <p className="text-sm">Run some tools to generate output files</p>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all duration-300",
                    "flex items-center gap-4",
                    selectedFile?.id === file.id
                      ? "border-primary bg-primary/10 cyber-glow"
                      : "border-border/50 bg-card/50 hover:border-primary/50"
                  )}
                >
                  <div className="p-2 rounded-lg bg-muted/50">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono text-sm text-foreground truncate">
                      {file.filename}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="capitalize px-2 py-0.5 rounded bg-muted/50">{file.category}</span>
                      <span>•</span>
                      <span>{format(new Date(file.created_at), 'MMM d, HH:mm')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                      }}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                      className="p-2 text-muted-foreground hover:text-secondary transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* File Viewer */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 bg-muted/30 flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-sm text-foreground">
                    {selectedFile ? selectedFile.filename : 'File Viewer'}
                  </h3>
                  {selectedFile && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedFile.tool_name} • {selectedFile.target}
                    </div>
                  )}
                </div>
                {selectedFile && (
                  <button
                    onClick={() => handleDownload(selectedFile)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="p-4 min-h-[500px] max-h-[600px] overflow-auto scan-lines">
                {selectedFile ? (
                  <pre className="font-mono text-xs text-primary whitespace-pre-wrap terminal-text leading-relaxed">
                    {selectedFile.output}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Select a file to view its contents</p>
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