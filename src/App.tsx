import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { MarketingView } from './components/MarketingView';
import { LiveScannerView } from './components/LiveScannerView';
import { DashboardView } from './components/DashboardView';
import { DemoModal } from './components/DemoModal';

export default function App() {
  const [activeView, setActiveView] = useState<'marketing' | 'scanner' | 'dashboard'>('marketing');
  const [targetDomain, setTargetDomain] = useState<string>('anonymousshields.com');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleStartScan = (domain: string) => {
    setTargetDomain(domain);
    setActiveView('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenDemo={() => setIsDemoModalOpen(true)}
          onOpenQuickScan={() => {
            setActiveView('scanner');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <main className="flex-1 w-full">
          {activeView === 'marketing' && (
            <MarketingView
              onStartScan={handleStartScan}
              onOpenDashboard={() => {
                setActiveView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDemo={() => setIsDemoModalOpen(true)}
            />
          )}

          {activeView === 'scanner' && (
            <LiveScannerView
              initialDomain={targetDomain}
              onOpenDemo={() => setIsDemoModalOpen(true)}
              onOpenDashboard={() => {
                setActiveView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeView === 'dashboard' && (
            <DashboardView
              onScanTarget={handleStartScan}
              onOpenDemo={() => setIsDemoModalOpen(true)}
            />
          )}
        </main>

        <DemoModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}
