import { Shield, Terminal, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navLinks = [
  { path: '/', label: 'Dashboard', icon: Shield },
  { path: '/terminal', label: 'Terminal', icon: Terminal },
  { path: '/history', label: 'History', icon: Shield },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary transition-all duration-300 group-hover:text-secondary" />
              <div className="absolute inset-0 blur-lg bg-primary/30 group-hover:bg-secondary/30 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-cyber text-lg font-bold tracking-wider text-primary text-glow">
                CYBER GUARD
              </span>
              <span className="font-cyber text-xs text-secondary tracking-widest">
                360
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300",
                  location.pathname === link.path
                    ? "bg-primary/20 text-primary cyber-glow"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs text-primary">ONLINE</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all",
                  location.pathname === link.path
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}