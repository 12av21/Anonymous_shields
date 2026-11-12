import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Terminal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Cpu,
  Lock,
  Globe,
  ArrowRight,
  Code2,
} from 'lucide-react';

interface AttackScenario {
  id: string;
  name: string;
  target: string;
  description: string;
  cve: string;
  cvss: number;
  steps: {
    title: string;
    detail: string;
    status: 'pending' | 'running' | 'success' | 'alert';
    log: string;
  }[];
  proofSnippet: string;
  remediationSnippet: string;
}

const SCENARIOS: AttackScenario[] = [
  {
    id: 'api-bola',
    name: 'BOLA / Broken Object Auth',
    target: 'api.production.perimeter/v2/tenants/984/keys',
    description: 'Autonomous agent tests multi-tenant authorization barriers across API endpoints.',
    cve: 'OWASP API1:2023',
    cvss: 8.6,
    steps: [
      {
        title: 'Recon & Endpoint Discovery',
        detail: 'Mapped 14 undocumented REST endpoints from OpenAPI specs and certificate logs.',
        status: 'success',
        log: '>> [RECON] Discovered /v2/tenants/{id}/keys via route enumeration. Response 200 OK.',
      },
      {
        title: 'Adversarial Token Mutation',
        detail: 'Simulated lateral privilege escalation by swapping user context JWT.',
        status: 'success',
        log: '>> [EXPLOIT] Swapped bearer token context to Tenant-002; bypassed auth check.',
      },
      {
        title: 'Cryptographic Proof Generated',
        detail: 'Confirmed real exploitability with curl payload. Zero false positives.',
        status: 'alert',
        log: '>> [VALIDATED] Unauthorized tenant metadata leaked. Severity: HIGH (CVSS 8.6).',
      },
      {
        title: 'Remediation Rule Dispatched',
        detail: 'Synthesized policy patch for API gateway authorization filter.',
        status: 'success',
        log: '>> [FIX] Generated Envoy RBAC filter patch & GitHub PR check.',
      },
    ],
    proofSnippet: `curl -X GET "https://api.perimeter.io/v2/tenants/002/keys" \\
  -H "Authorization: Bearer <tenant_001_token>"
# HTTP/2 200 OK -> Leaked private tenant telemetry`,
    remediationSnippet: `// Enforce tenant isolation middleware
if (claims.tenantId !== req.params.tenantId) {
  throw new ForbiddenException("Cross-tenant access violation");
}`,
  },
  {
    id: 'dmarc-spoof',
    name: 'Mail Spoofing & Phishing',
    target: '_dmarc.corporate-mail.net',
    description: 'Evaluates corporate email perimeter for executive impersonation and BEC exposure.',
    cve: 'RFC 7489 / CIS 9.5',
    cvss: 7.5,
    steps: [
      {
        title: 'DoH Record Inspection',
        detail: 'Queried Cloudflare DNS-over-HTTPS for SPF and DMARC TXT records.',
        status: 'success',
        log: '>> [DNS] _dmarc TXT: "v=DMARC1; p=none;" detected.',
      },
      {
        title: 'Simulated Envelope Delivery',
        detail: 'Simulated spoofed email delivery using forged header envelope addresses.',
        status: 'success',
        log: '>> [TEST] Dispatched unauthenticated test packet mimicking ceo@target.com.',
      },
      {
        title: 'Exploit Confirmed',
        detail: 'Permissive p=none policy allows fraudulent emails to reach inboxes.',
        status: 'alert',
        log: '>> [ALERT] Receiving gateway delivered spoofed mail without quarantine.',
      },
      {
        title: 'Strict DNS Policy Formatted',
        detail: 'Generated hardened DMARC reject record with reporting telemetry.',
        status: 'success',
        log: '>> [REMEDIATION] Output strict DNS TXT record for Cloudflare/Route53.',
      },
    ],
    proofSnippet: `_dmarc.target.com. IN TXT "v=DMARC1; p=none;"
# Vulnerability: Spoofed emails bypass gateway quarantine`,
    remediationSnippet: `_dmarc.target.com. IN TXT "v=DMARC1; p=reject; rua=mailto:reports@target.com; pct=100;"`,
  },
  {
    id: 'shadow-it',
    name: 'Rogue Staging & Open Ports',
    target: 'staging-db-replica.cloud-perimeter.io',
    description: 'Scans for forgotten staging subdomains with exposed administrative debuggers.',
    cve: 'OWASP A05:2021',
    cvss: 7.8,
    steps: [
      {
        title: 'CT Log Stream Monitor',
        detail: 'Detected freshly issued SSL certificate for unmonitored staging subdomain.',
        status: 'success',
        log: '>> [MONITOR] Certificate Transparency stream detected staging-db-replica.',
      },
      {
        title: 'Perimeter Port Audit',
        detail: 'Discovered open TCP port 5432 (Postgres) and 9200 (Elasticsearch).',
        status: 'success',
        log: '>> [PORT] TCP 5432 and 9200 exposed without IP allowlisting.',
      },
      {
        title: 'Proof-of-Exposure Verified',
        detail: 'Extracted development database schema without authentication handshake.',
        status: 'alert',
        log: '>> [RISK] Unauthenticated staging cluster reachable from public internet.',
      },
      {
        title: 'Cloud Firewall Isolation',
        detail: 'Created security group rule restricting access to private VPN.',
        status: 'success',
        log: '>> [ISOLATION] Ingress rule applied: Drop all 0.0.0.0/0 traffic.',
      },
    ],
    proofSnippet: `nc -zv staging-db-replica.cloud-perimeter.io 5432
# Connection to 5432 port [tcp/postgresql] succeeded!`,
    remediationSnippet: `aws ec2 revoke-security-group-ingress \\
  --group-id sg-0123456789abcdef0 \\
  --protocol tcp --port 5432 --cidr 0.0.0.0/0`,
  },
];

export const AgentSimulator: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<AttackScenario>(SCENARIOS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'flow' | 'terminal' | 'proof'>('flow');

  const runSimulation = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);

    const timer1 = setTimeout(() => setCurrentStepIndex(1), 600);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 1400);
    const timer3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setIsRunning(false);
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden transition-all text-left">
      {/* Console Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-400 font-mono">
            Anonymousshields HackBot Agent Engine v4.2
          </span>
          <span className="hidden sm:inline-block text-slate-600">·</span>
          <span className="hidden sm:flex items-center gap-1 text-emerald-400 font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Continuous Agent Active
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveViewMode('flow')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              activeViewMode === 'flow'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Agent Workflow
          </button>
          <button
            onClick={() => setActiveViewMode('terminal')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              activeViewMode === 'terminal'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Logs
          </button>
          <button
            onClick={() => setActiveViewMode('proof')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              activeViewMode === 'proof'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Proof-of-Exploit
          </button>
        </div>
      </div>

      {/* Scenario Selection Tabs */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto text-xs">
        <span className="text-slate-500 font-mono shrink-0">Attack Vectors:</span>
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => {
              setActiveScenario(scenario);
              setCurrentStepIndex(3);
            }}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeScenario.id === scenario.id
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>{scenario.name}</span>
          </button>
        ))}

        <div className="ml-auto pl-2 shrink-0">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-md transition-colors"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-3 h-3 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Re-run Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Target Banner */}
      <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-500">Target Asset:</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/60">
            {activeScenario.target}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-slate-400">Classification: {activeScenario.cve}</span>
          <span>·</span>
          <span className="text-amber-400 font-bold">CVSS {activeScenario.cvss}</span>
        </div>
      </div>

      {/* Main Interactive Screen */}
      <div className="p-6 min-h-[300px]">
        {/* VIEW 1: Agent Workflow Nodes */}
        {activeViewMode === 'flow' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {activeScenario.steps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex || currentStepIndex === 3;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className={`p-4 rounded-xl border transition-all duration-300 relative ${
                      isActive
                        ? 'bg-slate-800/90 border-emerald-500/80 shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)]'
                        : isPassed
                        ? 'bg-slate-900/90 border-slate-700/80'
                        : 'bg-slate-950/50 border-slate-800/50 opacity-60'
                    }`}
                  >
                    {/* Top step badge */}
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-mono text-slate-500">0{idx + 1}.</span>
                      {step.status === 'alert' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-950/80 text-rose-400 border border-rose-800/80">
                          Exploit Proven
                        </span>
                      ) : isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isActive ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5 font-display">
                      {step.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.detail}
                    </p>

                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute -bottom-1 left-4 right-4 h-0.5 bg-emerald-400 rounded-full"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom active log teaser */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <Terminal className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate text-slate-300">
                  {activeScenario.steps[currentStepIndex]?.log || activeScenario.steps[3].log}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0 font-sans font-semibold">
                Agent Telemetry
              </span>
            </div>
          </div>
        )}

        {/* VIEW 2: Terminal Logs */}
        {activeViewMode === 'terminal' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 text-slate-300 overflow-x-auto min-h-[220px]">
            <div className="text-slate-600">// Anonymousshields Autonomous Agent Execution Pipeline</div>
            <div className="text-slate-500">&gt; Session initialized with target {activeScenario.target}</div>
            <div className="text-slate-500">&gt; Starting continuous exposure validation harness...</div>
            {activeScenario.steps.map((st, i) => (
              <div
                key={i}
                className={i <= currentStepIndex ? (st.status === 'alert' ? 'text-rose-400' : 'text-emerald-400') : 'text-slate-600'}
              >
                {st.log}
              </div>
            ))}
            {currentStepIndex === 3 && (
              <div className="text-emerald-400 pt-2 border-t border-slate-800">
                &gt;&gt; [SUCCESS] Audit run completed in 1.48s. Proof-of-exploit verified without human fatigue.
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: Proof-of-Exploit Code */}
        {activeViewMode === 'proof' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-950/80 space-y-2">
              <div className="flex items-center justify-between text-rose-400 font-bold pb-2 border-b border-rose-900/40">
                <span>Verified Proof-of-Exploit</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/40 border border-rose-800">
                  Zero False Positive
                </span>
              </div>
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                {activeScenario.proofSnippet}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-950/80 space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold pb-2 border-b border-emerald-900/40">
                <span>Synthesized Code Remediation</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/40 border border-emerald-800">
                  Patch Ready
                </span>
              </div>
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                {activeScenario.remediationSnippet}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer Strip */}
      <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Every alert is mathematically proven with exploit replication.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
          <span>Latency: ~1.2s</span>
          <span>·</span>
          <span>Accuracy: 99.4%</span>
        </div>
      </div>
    </div>
  );
};
