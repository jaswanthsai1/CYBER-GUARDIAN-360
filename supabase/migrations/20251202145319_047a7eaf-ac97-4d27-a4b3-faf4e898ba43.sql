-- Create tool_executions table to store all tool runs
CREATE TABLE public.tool_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_name TEXT NOT NULL,
  category TEXT NOT NULL,
  target TEXT NOT NULL,
  command TEXT NOT NULL,
  output TEXT,
  status TEXT NOT NULL DEFAULT 'running',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create terminal_sessions table for terminal history
CREATE TABLE public.terminal_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  command TEXT NOT NULL,
  output TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access for now (no auth required)
ALTER TABLE public.tool_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terminal_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for tool_executions
CREATE POLICY "Allow public access to tool_executions" 
ON public.tool_executions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Allow public read/write for terminal_sessions
CREATE POLICY "Allow public access to terminal_sessions" 
ON public.terminal_sessions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.tool_executions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.terminal_sessions;