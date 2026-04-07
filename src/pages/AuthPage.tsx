import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff, Shield } from 'lucide-react';
import cyberGuardianLogo from '@/assets/cyber-guardian-logo.png';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back!');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success('Check your email to verify your account');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={cyberGuardianLogo}
            alt="Cyber Guardian 360"
            className="h-32 w-auto mx-auto mb-4 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          />
          <p className="text-muted-foreground text-sm">
            {isLogin ? 'Sign in to access your toolkit' : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl glass border border-primary/20 space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-mono text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@cyberguard.io"
              className={cn(
                "w-full px-4 py-3 rounded-lg font-mono text-sm",
                "bg-input border border-border/50 text-foreground placeholder:text-muted-foreground/50",
                "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-mono text-muted-foreground flex items-center gap-2">
              <Lock className="h-4 w-4" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  "w-full px-4 py-3 pr-12 rounded-lg font-mono text-sm",
                  "bg-input border border-border/50 text-foreground placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-3 rounded-lg font-mono text-sm font-semibold",
              "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
              "hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create Account
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:text-primary/80 font-mono transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Secured with end-to-end encryption</span>
        </div>
      </div>
    </div>
  );
}
