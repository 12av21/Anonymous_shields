import React from 'react';
import { Shield, Sun, Moon, ArrowRight, Terminal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeView: 'marketing' | 'scanner' | 'dashboard';
  setActiveView: (view: 'marketing' | 'scanner' | 'dashboard') => void;
  onOpenDemo: () => void;
  onOpenQuickScan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenDemo,
  onOpenQuickScan,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('marketing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            aria-label="Anonymousshields Home"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              Anonymousshields
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveView('marketing')}
            className={`whitespace-nowrap transition-colors focus:outline-none ${
              activeView === 'marketing'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Platform
          </button>
          <a
            href="#capabilities"
            onClick={(e) => {
              if (activeView !== 'marketing') {
                e.preventDefault();
                setActiveView('marketing');
                setTimeout(() => {
                  document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#compliance"
            onClick={(e) => {
              if (activeView !== 'marketing') {
                e.preventDefault();
                setActiveView('marketing');
                setTimeout(() => {
                  document.getElementById('compliance')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap transition-colors"
          >
            Compliance (NIS2/DORA)
          </a>
          <button
            onClick={() => setActiveView('scanner')}
            className={`whitespace-nowrap transition-colors focus:outline-none ${
              activeView === 'scanner'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Live Domain Scanner
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors focus:outline-none ${
              activeView === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Security Console
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus:outline-none"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenDemo}
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            Book Demo
          </button>

          <button
            onClick={onOpenQuickScan}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <span>Scan Domain</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
