import { Terminal, Menu, X, History, FolderOpen, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import cyberGuardianLogo from '@/assets/cyber-guardian-logo.png';

const navLinks = [
  { path: '/', label: 'Dashboard', icon: null },
  { path: '/terminal', label: 'Terminal', icon: Terminal },
  { path: '/files', label: 'Files', icon: FolderOpen },
  { path: '/history', label: 'History', icon: History },
  { path: '/documentation', label: 'Docs', icon: BookOpen },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src={cyberGuardianLogo} 
                alt="Cyber Guardian 360" 
                className="h-12 w-auto transition-all duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
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
                    ? "bg-primary/20 text-primary cyber-glow border border-primary/30"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20"
                )}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User & Sign Out */}
          <div className="hidden md:flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground truncate max-w-[150px]">
              {user?.email}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-mono text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary/20 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all",
                  location.pathname === link.path
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                )}
              >
                {link.icon && <link.icon className="h-5 w-5" />}
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
