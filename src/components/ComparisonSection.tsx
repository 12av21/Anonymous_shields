import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, Shield, Clock, Zap, FileText, AlertCircle, ArrowRight } from 'lucide-react';

interface ComparisonSectionProps {
  onOpenDemo: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onOpenDemo }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'speed' | 'accuracy' | 'cost'>('all');

  const rows = [
    {
      category: 'speed',
      feature: 'Cadence & Testing Frequency',
      legacy: 'Once or twice a year episodic snapshot',
      anonymous: '24/7 continuous autonomous testing across all perimeters',
    },
    {
      category: 'speed',
      feature: 'Turnaround Time for New Vulnerabilities',
      legacy: '3 to 6 weeks to schedule, test, and write report',
      anonymous: 'Seconds from code commit or asset deployment',
    },
    {
      category: 'accuracy',
      feature: 'Exploitability Verification',
      legacy: 'Theoretical scanner flags and signature guessing',
      anonymous: 'Cryptographic proof-of-exploit with real payload replication',
    },
    {
      category: 'accuracy',
      feature: 'False Positive Rate',
      legacy: 'Up to 40% noise wasting developer triage time',
      anonymous: 'Zero false positives mathematically verified',
    },
    {
      category: 'speed',
      feature: 'DevSecOps & CI/CD Gating',
      legacy: 'Disconnected from pull requests and pipeline builds',
      anonymous: 'Native GitHub/GitLab integration gating risky deployments',
    },
    {
      category: 'cost',
      feature: 'Re-Testing Patched Vulnerabilities',
      legacy: 'Requires expensive re-engagement consulting fee',
      anonymous: 'Instant 1-click re-testing at no additional cost',
    },
    {
      category: 'cost',
      feature: 'Compliance Audit Readiness',
      legacy: 'Scrambling for weeks before auditors arrive',
      anonymous: 'Always-on live telemetry mapped to NIS2, DORA & SOC 2',
    },
  ];

  const filteredRows = rows.filter((r) => activeTab === 'all' || r.category === activeTab);

  return (
    <section className="py-20 md:py-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>The Paradigm Shift</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Legacy Penetration Testing vs. Anonymousshields
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Why leading security teams are retiring static annual PDFs in favor of continuous autonomous exposure validation.
          </p>

          {/* Filter segment */}
          <div className="mt-6 inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Dimensions
            </button>
            <button
              onClick={() => setActiveTab('speed')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'speed'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Speed & Cadence
            </button>
            <button
              onClick={() => setActiveTab('accuracy')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'accuracy'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Accuracy & Exploitation
            </button>
            <button
              onClick={() => setActiveTab('cost')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'cost'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cost & Compliance
            </button>
          </div>
        </div>

        {/* Comparison Table / Cards */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider">
            <div className="md:col-span-4 p-4 text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-900/80">
              Capability & Workflow
            </div>
            <div className="md:col-span-4 p-4 text-slate-500 dark:text-slate-400 bg-rose-50/40 dark:bg-rose-950/20 border-l border-slate-200 dark:border-slate-800">
              Legacy Annual Pentest
            </div>
            <div className="md:col-span-4 p-4 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 border-l border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span>Anonymousshields Autonomous</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono">
                Continuous
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-xs">
            {filteredRows.map((row, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-12 hover:bg-white dark:hover:bg-slate-900/80 transition-colors"
              >
                <div className="md:col-span-4 p-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{row.feature}</span>
                </div>
                <div className="md:col-span-4 p-4 text-slate-500 dark:text-slate-400 md:border-l border-slate-200 dark:border-slate-800 flex items-start gap-2 bg-rose-50/10 dark:bg-rose-950/5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{row.legacy}</span>
                </div>
                <div className="md:col-span-4 p-4 text-slate-900 dark:text-slate-100 font-medium md:border-l border-slate-200 dark:border-slate-800 flex items-start gap-2 bg-emerald-50/20 dark:bg-emerald-950/10">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{row.anonymous}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA banner below comparison */}
        <div className="mt-8 text-center">
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-950 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
          >
            <span>Replace Your Annual Pentest Today</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
