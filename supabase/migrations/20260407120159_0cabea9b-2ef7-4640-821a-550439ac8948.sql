
-- Add user_id to tool_executions
ALTER TABLE public.tool_executions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to terminal_sessions
ALTER TABLE public.terminal_sessions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow public access to tool_executions" ON public.tool_executions;
DROP POLICY IF EXISTS "Allow public access to terminal_sessions" ON public.terminal_sessions;

-- Create user-scoped RLS policies for tool_executions
CREATE POLICY "Users can manage own executions"
ON public.tool_executions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create user-scoped RLS policies for terminal_sessions
CREATE POLICY "Users can manage own sessions"
ON public.terminal_sessions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
