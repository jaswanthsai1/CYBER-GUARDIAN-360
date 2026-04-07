
-- Drop user-scoped policies
DROP POLICY IF EXISTS "Users can manage own executions" ON public.tool_executions;
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.terminal_sessions;

-- Restore public access policies
CREATE POLICY "Allow public access to tool_executions"
ON public.tool_executions
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public access to terminal_sessions"
ON public.terminal_sessions
FOR ALL
TO public
USING (true)
WITH CHECK (true);
