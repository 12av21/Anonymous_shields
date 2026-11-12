import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  Zap,
  Globe,
  FileCheck2,
  Users,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { AgentSimulator } from './AgentSimulator';
import { ComparisonSection } from './ComparisonSection';
import { InteractiveTopologyMap } from './InteractiveTopologyMap';

interface MarketingViewProps {
  onStartScan: (domain: string) => void;
  onOpenDashboard: () => void;
  onOpenDemo: () => void;
}

const ROTATING_TARGETS = [
  'Attack Surface',
  'Cloud Infrastructure',
  'DevSecOps Pipelines',
  'Multi-Tenant APIs',
  'Enterprise Perimeter',
];

export const MarketingView: React.FC<MarketingViewProps> = ({
  onStartScan,
  onOpenDashboard,
  onOpenDemo,
}) => {
  const [domainInput, setDomainInput] = useState('');
  const [targetIndex, setTargetIndex] = useState(0);
  const [assetCount, setAssetCount] = useState(25);
  const [deploymentsPerWeek, setDeploymentsPerWeek] = useState(8);
  const [currentPentestBudget, setCurrentPentestBudget] = useState(45000);

  const sampleDomains = ['anonymousshields.com', 'cloudflare.com', 'github.com', 'stripe.com'];

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetIndex((prev) => (prev + 1) % ROTATING_TARGETS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleSubmitScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (domainInput.trim()) {
      onStartScan(domainInput.trim());
    }
  };

  // ROI Calculator Calculations
  const estimatedSavings = Math.round(
    currentPentestBudget * 0.62 + (assetCount * 450) + (deploymentsPerWeek * 52 * 45)
  );
  const mttrReductionDays = Math.round(38 - (assetCount > 50 ? 8 : 4));
  const developerHoursSaved = Math.round(deploymentsPerWeek * 3.5 * 4);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 border-b border-slate-200/80 dark:border-slate-800/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(15,23,42,0))]">
        {/* Subtle Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40 dark:opacity-25" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 rounded-full mb-6 shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Next-Gen Autonomous Exposure Validation</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 dark:text-slate-400">Continuous AI Agent Swarms</span>
            </motion.div>

            {/* Rotating Marquee Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
            >
              Autonomous Ethical Hacking to Defend Your{' '}
              <span className="inline-block relative min-w-[280px] sm:min-w-[380px] text-left text-emerald-600 dark:text-emerald-400 font-extrabold">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={targetIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="inline-block"
                  >
                    {ROTATING_TARGETS[targetIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Anonymousshields replaces slow, episodic annual penetration tests with 24/7 continuous adversarial testing and cryptographic proof-of-exploit validation.
            </motion.p>

            {/* Live Domain Audit Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 max-w-xl mx-auto"
            >
              <form
                onSubmit={handleSubmitScan}
                className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 shadow-md focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
              >
                <div className="flex items-center gap-2 px-3 w-full">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="Enter public domain (e.g. yourcompany.com)"
                    className="w-full py-2 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Audit Domain</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Sample Target Badges */}
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span>Try live target:</span>
                {sampleDomains.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => {
                      setDomainInput(domain);
                      onStartScan(domain);
                    }}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 transition-colors cursor-pointer"
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Quick CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex items-center justify-center gap-4 flex-wrap"
            >
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>Open Security Console</span>
              </button>
              <button
                onClick={onOpenDemo}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span>Request Enterprise Demo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Centerpiece Hero Simulator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16"
            >
              <div className="text-center mb-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Interactive Live Agent Simulator · Select vector to observe autonomous testing
                </span>
              </div>
              <AgentSimulator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-20 md:py-28 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Continuous Exposure Validation
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              The Anonymousshields Four-Pillar Security Engine
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Traditional vulnerability scanners drown teams in theoretical alerts. Anonymousshields proves real-world exploitability with automated agentic workflows and zero noise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Autonomous Pentesting (Span 2) */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  01. Autonomous Continuous Penetration Testing
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  Our autonomous agent swarms test applications 24/7 like creative human ethical hackers. By chaining multi-step reconnaissance, token tampering, and input fuzzing, agents confirm whether an exposure can actually be exploited before alerting developers.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Mathematically Verified Proof-of-Exploit
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Zero False Positive Guarantee
                </span>
              </div>
            </div>

            {/* Bento Card 2: Attack Surface Management */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  02. External Attack Surface (ASM)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Continuously crawls DNS-over-HTTPS feeds, certificate transparency logs, and IP spaces to map forgotten assets, rogue APIs, and shadow IT.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span>Instant alerts upon rogue subdomain discovery.</span>
              </div>
            </div>

            {/* Interactive Topology Mesh Sub-Section */}
            <div className="md:col-span-3">
              <InteractiveTopologyMap />
            </div>

            {/* Bento Card 3: DevSecOps CI/CD Pipeline */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  03. Event-Driven CI/CD Gateways
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Triggers ephemeral penetration tests on staging builds and preview URLs directly within GitHub Actions, GitLab CI, and Jenkins before deployment.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span>Stops security regressions before reaching production.</span>
              </div>
            </div>

            {/* Bento Card 4: Human-in-the-Loop Synergy (Span 2) */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  04. Human Hacker Intuition + AI Agent Scale
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  AI provides 24/7 relentless scale and rapid fuzzing. When complex business logic flaws or multi-tenant permission edge cases arise, vetted ethical hackers step in to validate exploit chains and deliver surgical patch instructions.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  CREST-Certified Methodology
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Direct Security Engineer Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <ComparisonSection onOpenDemo={onOpenDemo} />

      {/* Compliance Deep Dive Section */}
      <section id="compliance" className="py-20 md:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Regulatory Alignment
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Instant Compliance Verification for NIS2, DORA & SOC 2
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              New cybersecurity regulations mandate continuous testing and verifiable supply chain exposure controls. Anonymousshields provides the automated audit trails and technical evidence required by regulators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-slate-900 dark:text-white">NIS2 Directive</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Article 21
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Mandates proactive vulnerability handling, supply chain security audits, and continuous risk management for essential and important entities across the EU.
              </p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Continuous external exposure audit</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Documented remediation workflows</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-slate-900 dark:text-white">DORA Resilience</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Chapter IV
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Requires financial institutions and critical ICT third-party providers to conduct Threat-Led Penetration Testing (TLPT) and continuous digital resilience audits.
              </p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Autonomous threat simulation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>ICT perimeter verification reports</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-slate-900 dark:text-white">SOC 2 & ISO 27001</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  A.12.6.1
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Directly maps technical controls to SOC 2 Trust Services Criteria (CC7.1/CC7.2) and ISO 27001 technical vulnerability management requirements.
              </p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>One-click audit export for compliance officers</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Continuous proof of security monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security ROI & Risk Calculator */}
      <section className="py-20 md:py-24 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Quantifiable Impact
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Calculate Your Exposure Reduction & ROI
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Traditional annual pentests miss vulnerabilities introduced between testing cycles. Calculate how continuous testing lowers remediation costs, saves engineer hours, and protects your bottom line.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <span>Monitored Domains & Cloud Assets</span>
                    <span className="font-mono tabular-nums font-semibold">{assetCount} Assets</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={assetCount}
                    onChange={(e) => setAssetCount(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <span>Engineering Code Releases Per Week</span>
                    <span className="font-mono tabular-nums font-semibold">{deploymentsPerWeek} deploys/wk</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={deploymentsPerWeek}
                    onChange={(e) => setDeploymentsPerWeek(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <span>Annual Penetration Testing Spend ($)</span>
                    <span className="font-mono tabular-nums font-semibold">
                      ${currentPentestBudget.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="150000"
                    step="5000"
                    value={currentPentestBudget}
                    onChange={(e) => setCurrentPentestBudget(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Results Card */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Estimated Net Annual Benefit
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  ${estimatedSavings.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-8">
                  Combines legacy pentest replacement, developer triage time, and breach likelihood mitigation.
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {mttrReductionDays} Days
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      MTTR (Mean Time to Remediate)
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {developerHoursSaved} hrs/mo
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Dev triage time saved
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      0%
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      False-positive noise
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Ready to operationalize continuous exposure management?
                  </span>
                  <button
                    onClick={onOpenDemo}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-950 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span>Schedule Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 md:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Demonstrated Outcomes
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Securing High-Growth & Enterprise Attack Surfaces
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-3xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mb-2">
                  -84%
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Faster Critical Vulnerability Remediation
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  "Anonymousshields’ automated verification gave our developers the exact reproduction curl commands and code fixes. We went from 38 days to under 4 days for critical patch deployment."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">Marcus Vance</div>
                <div className="text-slate-500">VP of Security, Apex FinTech</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-3xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mb-2">
                  128+
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Forgotten Shadow IT Assets Discovered
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  "During our first 48 hours on Anonymousshields, the ASM engine located three unmaintained staging subdomains that still had legacy database ports open to the public internet."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">Elena Rostova</div>
                <div className="text-slate-500">Chief Information Security Officer, CloudScale</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-3xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mb-2">
                  100%
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Audit Readiness for DORA & NIS2
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  "Instead of scrambling for 3 weeks prior to our external regulatory audit, we generated our comprehensive technical resilience packet directly from Anonymousshields in 5 minutes."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">David K. Lindqvist</div>
                <div className="text-slate-500">Head of Governance & Compliance, Nordic Bank</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture / Footer Callout */}
      <section className="py-20 md:py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Protect Your Organization's Perimeter?
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            Test any public domain with our live DNS security analyzer, or schedule an enterprise walkthrough with an Anonymousshields security engineer.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Scan Domain Now
            </button>
            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Book 1-on-1 Architecture Session
            </button>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Anonymousshields</span>
            <span>·</span>
            <span>Autonomous Ethical Hacking & Exposure Management</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onOpenDashboard} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Console
            </button>
            <a href="#capabilities" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#compliance" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Compliance
            </a>
            <button onClick={onOpenDemo} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Book Demo
            </button>
          </div>
          <div>
            © {new Date().getFullYear()} Anonymousshields Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
