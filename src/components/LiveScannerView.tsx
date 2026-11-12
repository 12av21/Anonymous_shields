import React, { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  Share2,
  RefreshCw,
  Mail,
  Lock,
  Globe,
  Server,
  FileCode,
  Terminal,
} from 'lucide-react';
import { SecurityScanResult, FindingSeverity } from '../types';
import { runSecurityScan, sanitizeDomain } from '../services/dnsScanner';

interface LiveScannerViewProps {
  initialDomain?: string;
  onOpenDemo?: () => void;
  onOpenDashboard?: () => void;
}

export const LiveScannerView: React.FC<LiveScannerViewProps> = ({
  initialDomain,
  onOpenDemo,
  onOpenDashboard,
}) => {
  const [targetInput, setTargetInput] = useState(initialDomain || 'anonymousshields.com');
  const [activeTab, setActiveTab] = useState<'overview' | 'dns' | 'mail' | 'headers' | 'export'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [result, setResult] = useState<SecurityScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [recordTypeFilter, setRecordTypeFilter] = useState<string>('ALL');

  const popularTargets = ['anonymousshields.com', 'cloudflare.com', 'github.com', 'stripe.com', 'netflix.com'];

  const executeScan = async (domainToScan: string) => {
    setIsLoading(true);
    setError(null);
    setScanStep('Querying DNS-over-HTTPS infrastructure...');

    try {
      setTimeout(() => setScanStep('Auditing Mail Defense (SPF & DMARC)...'), 400);
      setTimeout(() => setScanStep('Evaluating Certificate Authority (CAA) records...'), 800);
      setTimeout(() => setScanStep('Benchmarking HTTP Security Headers...'), 1200);

      const scanResult = await runSecurityScan(domainToScan);
      setResult(scanResult);
    } catch (err: any) {
      setError(err?.message || 'Failed to complete domain security audit. Please verify the hostname.');
    } finally {
      setIsLoading(false);
      setScanStep('');
    }
  };

  useEffect(() => {
    if (initialDomain) {
      setTargetInput(initialDomain);
      executeScan(initialDomain);
    } else if (!result) {
      executeScan('anonymousshields.com');
    }
  }, [initialDomain]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anonymousshields_security_audit_${result.domain}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDnsRecords = result?.dnsRecords.filter((rec) => {
    if (recordTypeFilter === 'ALL') return true;
    return rec.type === recordTypeFilter;
  });

  const getSeverityBadge = (severity: FindingSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900';
      case 'High':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-900';
      case 'Low':
        return 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-900';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    if (grade === 'B') return 'text-sky-500 bg-sky-500/10 border-sky-500/30';
    if (grade === 'C') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Top Header & Search Bar */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>Real-Time Public Security Analyzer</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Domain Exposure & DNS Posture Inspector
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Query live DNS records via DoH, audit mail spoofing protections (SPF & DMARC), and evaluate defensive HTTP security headers without active exploitation.
        </p>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (targetInput.trim()) executeScan(targetInput.trim());
          }}
          className="mt-6 flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
        >
          <div className="flex items-center gap-2 px-3 w-full">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="e.g. acme-corp.com or app.platform.io"
              className="w-full py-2 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:opacity-50 text-white dark:text-slate-950 text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <span>Run Inspection</span>
                <Shield className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick presets */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
          <span>Preset targets:</span>
          {popularTargets.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setTargetInput(d);
                executeScan(d);
              }}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 transition-colors cursor-pointer"
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-8 my-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Analyzing {sanitizeDomain(targetInput)}...
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            {scanStep || 'Executing real-time DoH DNS query...'}
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-6 my-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-start gap-3">
          <XCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold">Inspection Failed</h4>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Results View */}
      {result && !isLoading && (
        <div className="space-y-6">
          {/* Executive Overview Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    {result.domain}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>Audited on {new Date(result.timestamp).toLocaleTimeString()}</span>
                  <span>·</span>
                  <span>{result.dnsRecords.length} DNS Records</span>
                  <span>·</span>
                  <span>{result.findings.length} Security Findings</span>
                </div>
              </div>

              {/* Score & Grade Display */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {result.score}<span className="text-sm text-slate-400">/100</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Posture Score
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl border flex items-center justify-center font-bold font-mono text-2xl ${getGradeColor(result.grade)}`}>
                  {result.grade}
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Email Authentication</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {result.mailSecurity.status === 'pass' ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Protected (DMARC + SPF)
                    </span>
                  ) : result.mailSecurity.status === 'warning' ? (
                    <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Monitoring Only (p=none)
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Vulnerable to Spoofing
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">CAA Certificate Policy</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {result.hasCaa ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Configured ({result.caaRecords.length} records)
                    </span>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                      Not Published
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">IPv6 Dual-Stack</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {result.hasIpv6 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      AAAA Available
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      IPv4 Only
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Security Headers</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white">
                    {result.securityHeaders.filter((h) => h.status === 'pass').length} of {result.securityHeaders.length} Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-x-auto text-xs font-medium border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Findings & Remediation ({result.findings.length})
            </button>
            <button
              onClick={() => setActiveTab('dns')}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'dns'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              DNS Records ({result.dnsRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('mail')}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'mail'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Email Security (SPF & DMARC)
            </button>
            <button
              onClick={() => setActiveTab('headers')}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'headers'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              HTTP Security Headers
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'export'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Export & Share
            </button>
          </div>

          {/* TAB 1: Findings & Remediation */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Identified Exposure Risks & Gaps ({result.findings.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Prioritized by CVSS Severity
                </span>
              </div>

              {result.findings.length === 0 ? (
                <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    No High or Critical Exposures Detected
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    The public perimeter for {result.domain} demonstrates disciplined DNS, mail authentication, and cryptographic defenses.
                  </p>
                </div>
              ) : (
                result.findings.map((finding) => (
                  <div
                    key={finding.id}
                    className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getSeverityBadge(finding.severity)}`}>
                          {finding.severity} · CVSS {finding.cvss.toFixed(1)}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {finding.title}
                        </h4>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {finding.cveOrStandard || finding.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {finding.description}
                    </p>

                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center justify-between">
                        <span>Recommended Remediation:</span>
                        <button
                          onClick={() => handleCopy(finding.remediation, finding.id)}
                          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          {copiedKey === finding.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="font-mono text-[10px]">{copiedKey === finding.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <code className="font-mono text-emerald-600 dark:text-emerald-400 block break-all">
                        {finding.remediation}
                      </code>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: DNS Records Table */}
          {activeTab === 'dns' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Resolved Public DNS Records ({filteredDnsRecords?.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live authoritative records fetched through Cloudflare DoH
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['ALL', 'A', 'AAAA', 'MX', 'TXT', 'CAA', 'NS'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setRecordTypeFilter(t)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors ${
                        recordTypeFilter === t
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase">
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Resolved Data / Value</th>
                      <th className="py-2.5 px-3 text-right">TTL</th>
                      <th className="py-2.5 px-2 text-right">Copy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
                    {filteredDnsRecords && filteredDnsRecords.length > 0 ? (
                      filteredDnsRecords.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {rec.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 max-w-[180px] truncate">
                            {rec.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-900 dark:text-slate-100 break-all font-mono">
                            {rec.data}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums">
                            {rec.ttl}s
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <button
                              onClick={() => handleCopy(rec.data, `rec-${idx}`)}
                              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                              title="Copy data"
                            >
                              {copiedKey === `rec-${idx}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500">
                          No {recordTypeFilter} records found for this domain.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Email Security Deep Dive */}
          {activeTab === 'mail' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SPF Audit Box */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Sender Policy Framework (SPF)
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    result.mailSecurity.hasSpf
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                  }`}>
                    {result.mailSecurity.hasSpf ? 'Published' : 'Missing'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  SPF specifies the mail servers authorized to send emails from your domain, blocking unauthorized spam and spoofing relays.
                </p>

                {result.mailSecurity.spfRecord ? (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 break-all">
                    {result.mailSecurity.spfRecord}
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300">
                    No SPF TXT record discovered. Create a TXT record with authorized senders.
                  </div>
                )}

                {result.mailSecurity.spfIssues.length > 0 && (
                  <div className="space-y-1 text-xs">
                    {result.mailSecurity.spfIssues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DMARC Audit Box */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      DMARC Policy Enforcement
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    result.mailSecurity.dmarcPolicy === 'reject'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      : result.mailSecurity.dmarcPolicy === 'quarantine'
                      ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400'
                      : 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    p={result.mailSecurity.dmarcPolicy || 'none'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  DMARC enforces policies when SPF/DKIM fail. A policy of <code className="font-mono text-emerald-500">p=reject</code> actively drops spoofed phishing emails before they reach targets.
                </p>

                {result.mailSecurity.dmarcRecord ? (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 break-all">
                    {result.mailSecurity.dmarcRecord}
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300">
                    No DMARC record found at _dmarc.{result.domain}. High vulnerability to brand spoofing.
                  </div>
                )}

                {result.mailSecurity.dmarcIssues.length > 0 && (
                  <div className="space-y-1 text-xs">
                    {result.mailSecurity.dmarcIssues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: HTTP Security Headers */}
          {activeTab === 'headers' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Baseline HTTP Defense Headers
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Protects browsers from clickjacking, script injection, and transport-level eavesdropping.
                </p>
              </div>

              <div className="space-y-3">
                {result.securityHeaders.map((hdr, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {hdr.header}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          hdr.status === 'pass'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        }`}>
                          {hdr.status === 'pass' ? 'Optimal' : 'Needs Hardening'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {hdr.description}
                      </p>
                      <div className="pt-1 text-[11px] text-slate-500 font-mono">
                        Target benchmark: <span className="text-slate-700 dark:text-slate-300">{hdr.expected}</span>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getSeverityBadge(hdr.severity)}`}>
                        {hdr.severity} Risk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Export & Share */}
          {activeTab === 'export' && (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-xl mx-auto text-center space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <FileCode className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Export Security Assessment
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Download complete technical telemetry for compliance audits, penetration testing tickets, or executive review.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleDownloadJson}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-lg shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON Report</span>
                </button>
                <button
                  onClick={() => {
                    const textSummary = `Anonymousshields Security Report for ${result.domain}\nScore: ${result.score}/100 (Grade ${result.grade})\nDNS Records: ${result.dnsRecords.length}\nEmail Security: ${result.mailSecurity.status}\nFindings: ${result.findings.length}\nGenerated: ${new Date(result.timestamp).toUTCString()}`;
                    handleCopy(textSummary, 'summary-text');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {copiedKey === 'summary-text' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'summary-text' ? 'Copied Summary' : 'Copy Text Summary'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Callout to Dashboard */}
          <div className="p-6 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold">Monitor this asset 24/7 in Anonymousshields Console</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Enable automated continuous pentesting, certificate expiration alarms, and rogue subdomain detection.
              </p>
            </div>
            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg whitespace-nowrap transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Open in Security Console</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
