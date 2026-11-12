import React, { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Server,
  Globe,
  Database,
  Lock,
  Layers,
  Copy,
  Check,
  FileCheck2,
} from 'lucide-react';
import { MonitoredAsset, SecurityFinding, ComplianceFramework } from '../types';

interface DashboardViewProps {
  onScanTarget: (domain: string) => void;
  onOpenDemo: () => void;
}

const INITIAL_ASSETS: MonitoredAsset[] = [
  {
    id: 'ast-1',
    hostname: 'api.production.internal',
    ipAddress: '104.21.48.112',
    assetType: 'api',
    service: 'HTTPS / REST (v2)',
    sslExpiryDays: 82,
    sslValid: true,
    status: 'secure',
    lastScanned: '2 hours ago',
  },
  {
    id: 'ast-2',
    hostname: 'auth.identity-gateway.io',
    ipAddress: '172.67.182.204',
    assetType: 'web',
    service: 'OAuth2 / OIDC Provider',
    sslExpiryDays: 45,
    sslValid: true,
    status: 'secure',
    lastScanned: '4 hours ago',
  },
  {
    id: 'ast-3',
    hostname: 'mail.corp-exchange.net',
    ipAddress: '198.51.100.24',
    assetType: 'mail',
    service: 'SMTP / TLS Relay',
    sslExpiryDays: 14,
    sslValid: true,
    status: 'warning',
    lastScanned: '1 hour ago',
  },
  {
    id: 'ast-4',
    hostname: 'staging-legacy.internal-dev.net',
    ipAddress: '203.0.113.88',
    assetType: 'web',
    service: 'HTTP / Node.js Express',
    sslExpiryDays: 0,
    sslValid: false,
    status: 'vulnerable',
    lastScanned: '20 mins ago',
  },
  {
    id: 'ast-5',
    hostname: 'ns1.perimeter-dns.org',
    ipAddress: '192.0.2.53',
    assetType: 'dns',
    service: 'Authoritative DNS BIND',
    sslExpiryDays: 120,
    sslValid: true,
    status: 'secure',
    lastScanned: '6 hours ago',
  },
  {
    id: 'ast-6',
    hostname: 's3-backup-vault.storage.cloud',
    ipAddress: '198.51.100.77',
    assetType: 'cloud',
    service: 'Cloud Storage API',
    sslExpiryDays: 95,
    sslValid: true,
    status: 'secure',
    lastScanned: '12 hours ago',
  },
];

const INITIAL_FINDINGS: SecurityFinding[] = [
  {
    id: 'VULN-101',
    title: 'Missing DMARC Reject Policy on Primary Mail Domain',
    severity: 'High',
    category: 'Email Security',
    cvss: 7.5,
    affectedAsset: 'mail.corp-exchange.net',
    description: 'The domain does not enforce a reject or quarantine policy for unauthenticated email traffic, leaving the brand open to phishing impersonation.',
    impact: 'Executive spear-phishing, business email compromise, lack of delivery auditing.',
    remediation: 'Update DNS TXT record at _dmarc.corp-exchange.net: "v=DMARC1; p=reject; rua=mailto:secops@corp-exchange.net; pct=100"',
    cveOrStandard: 'RFC 7489 / CIS 9.5',
  },
  {
    id: 'VULN-102',
    title: 'Publicly Accessible Staging Environment Without Auth Gate',
    severity: 'High',
    category: 'Exposure',
    cvss: 7.2,
    affectedAsset: 'staging-legacy.internal-dev.net',
    description: 'A pre-release deployment environment was identified with direct internet exposure, exposing development API documentation and unpatched npm dependencies.',
    impact: 'Exposure of staging database credentials and unpublished application workflows.',
    remediation: 'Place the staging hostname behind an enterprise Identity-Aware Proxy (Cloudflare Zero Trust or VPN) with SSO enforcement.',
    cveOrStandard: 'OWASP Top 10 A01:2021',
  },
  {
    id: 'VULN-103',
    title: 'SSL Certificate Expiring in Under 15 Days',
    severity: 'Medium',
    category: 'SSL/TLS',
    cvss: 5.0,
    affectedAsset: 'mail.corp-exchange.net',
    description: 'The TLS certificate for mail.corp-exchange.net will expire in 14 days without an active automated ACME renewal hook detected.',
    impact: 'Downtime and browser certificate rejection warnings for connecting users.',
    remediation: 'Automate certificate issuance with certbot or integrate with automated cloud TLS management.',
    cveOrStandard: 'NIST SP 800-52r2',
  },
  {
    id: 'VULN-104',
    title: 'HSTS IncludeSubDomains Flag Missing',
    severity: 'Low',
    category: 'HTTP Headers',
    cvss: 3.7,
    affectedAsset: 'auth.identity-gateway.io',
    description: 'The Strict-Transport-Security header is present with a valid max-age, but omits the includeSubDomains directive.',
    impact: 'Subdomains remain vulnerable to SSL stripping if visited over plaintext HTTP.',
    remediation: 'Append "; includeSubDomains; preload" to the Strict-Transport-Security header.',
    cveOrStandard: 'RFC 6797',
  },
];

const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'comp-1',
    code: 'NIS2',
    name: 'EU NIS2 Directive',
    score: 94,
    description: 'European cybersecurity resilience standards covering external exposure management and incident reporting.',
    requiredControls: 18,
    satisfiedControls: 17,
    status: 'compliant',
  },
  {
    id: 'comp-2',
    code: 'DORA',
    name: 'Digital Operational Resilience Act (DORA)',
    score: 91,
    description: 'Financial sector ICT risk management, threat-led penetration testing, and third-party monitoring.',
    requiredControls: 22,
    satisfiedControls: 20,
    status: 'compliant',
  },
  {
    id: 'comp-3',
    code: 'SOC2',
    name: 'SOC 2 Type II (Security & Confidentiality)',
    score: 98,
    description: 'Trust Services Criteria CC7.1 and CC7.2 requiring continuous vulnerability detection and rapid remediation.',
    requiredControls: 14,
    satisfiedControls: 14,
    status: 'compliant',
  },
  {
    id: 'comp-4',
    code: 'ISO27001',
    name: 'ISO/IEC 27001:2022',
    score: 95,
    description: 'Information security management controls including A.8.8 Management of technical vulnerabilities.',
    requiredControls: 25,
    satisfiedControls: 24,
    status: 'compliant',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  onScanTarget,
  onOpenDemo,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'assets' | 'findings' | 'compliance'>('assets');
  const [assetSearch, setAssetSearch] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState<string>('all');
  const [selectedFinding, setSelectedFinding] = useState<SecurityFinding | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [assets, setAssets] = useState<MonitoredAsset[]>(INITIAL_ASSETS);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [newHostname, setNewHostname] = useState('');
  const [newAssetType, setNewAssetType] = useState<'web' | 'api' | 'mail' | 'dns' | 'cloud'>('web');

  const handleRefreshPerimeter = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHostname.trim()) return;

    const newAsset: MonitoredAsset = {
      id: `ast-${Date.now()}`,
      hostname: newHostname.trim().toLowerCase(),
      ipAddress: '104.21.48.99',
      assetType: newAssetType,
      service: newAssetType === 'api' ? 'HTTPS REST' : newAssetType === 'mail' ? 'SMTP' : 'HTTPS Web',
      sslExpiryDays: 90,
      sslValid: true,
      status: 'secure',
      lastScanned: 'Just now',
    };

    setAssets([newAsset, ...assets]);
    setNewHostname('');
    setShowAddAssetModal(false);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.hostname.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.ipAddress.includes(assetSearch);
    const matchesType = selectedAssetType === 'all' || asset.assetType === selectedAssetType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Top Console Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
            <span>Anonymousshields</span>
            <span>/</span>
            <span>Perimeter Defense</span>
            <span>/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Production Console</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Attack Surface & Exposure Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshPerimeter}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
            <span>{isRefreshing ? 'Scanning Perimeter...' : 'Re-scan Perimeter'}</span>
          </button>

          <button
            onClick={() => setShowAddAssetModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Asset Target</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Overall Posture Rating</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              88
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              Grade A-
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-500 font-semibold">+4.2%</span> from last week
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monitored Assets</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {assets.length}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Perimeter Hosts
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            <span className="text-emerald-500 font-semibold">{assets.filter((a) => a.status === 'secure').length} Secure</span> · {assets.filter((a) => a.status !== 'secure').length} Action Needed
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Open Exposure Findings</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {INITIAL_FINDINGS.length}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Active Risks
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            0 Critical · 2 High · 1 Medium · 1 Low
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Regulatory Readiness</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              94.5%
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Avg. Compliance
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            NIS2 & DORA Audit Passed
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('assets')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'assets'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Asset Inventory & ASM ({assets.length})
        </button>
        <button
          onClick={() => setActiveSubTab('findings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'findings'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Exposure & Vulnerability Feed ({INITIAL_FINDINGS.length})
        </button>
        <button
          onClick={() => setActiveSubTab('compliance')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'compliance'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Compliance Frameworks (NIS2/DORA)
        </button>
      </div>

      {/* SUB-TAB 1: ASSET INVENTORY */}
      {activeSubTab === 'assets' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                placeholder="Search hostnames or IP addresses..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['all', 'web', 'api', 'mail', 'dns', 'cloud'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedAssetType(type)}
                  className={`px-3 py-1 rounded-md capitalize transition-colors font-mono ${
                    selectedAssetType === type
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase bg-slate-50/50 dark:bg-slate-950/50">
                    <th className="py-3 px-4">Hostname</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">TLS / SSL Expiry</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {asset.assetType === 'web' && <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                          {asset.assetType === 'api' && <Server className="w-3.5 h-3.5 text-purple-500 shrink-0" />}
                          {asset.assetType === 'mail' && <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          {asset.assetType === 'dns' && <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                          {asset.assetType === 'cloud' && <Database className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                          <span>{asset.hostname}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 tabular-nums">
                        {asset.ipAddress}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-sans">
                        {asset.service}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums">
                        {asset.sslValid ? (
                          <span className={`${asset.sslExpiryDays < 30 ? 'text-amber-500 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                            {asset.sslExpiryDays} days remaining
                          </span>
                        ) : (
                          <span className="text-rose-500 font-bold">Expired / Invalid</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {asset.status === 'secure' && (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Secure
                          </span>
                        )}
                        {asset.status === 'warning' && (
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Expiring
                          </span>
                        )}
                        {asset.status === 'vulnerable' && (
                          <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" />
                            Action Needed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onScanTarget(asset.hostname)}
                          className="px-2.5 py-1 text-[11px] font-sans font-semibold rounded text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Scan</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FINDINGS & EXPOSURE FEED */}
      {activeSubTab === 'findings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Identified Threat Vectors & Exposures ({INITIAL_FINDINGS.length})
            </h3>
            <span className="text-xs text-slate-500">
              Validated without false positives
            </span>
          </div>

          <div className="space-y-3">
            {INITIAL_FINDINGS.map((finding) => (
              <div
                key={finding.id}
                onClick={() => setSelectedFinding(finding)}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      finding.severity === 'High'
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
                        : 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-900'
                    }`}>
                      {finding.severity} · CVSS {finding.cvss.toFixed(1)}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {finding.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span>{finding.affectedAsset}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {finding.description}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span>Standard: {finding.cveOrStandard}</span>
                  <span>·</span>
                  <span>Category: {finding.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COMPLIANCE MAPPING */}
      {activeSubTab === 'compliance' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Continuous Regulatory Compliance Controls
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Live mapping of your perimeter telemetry to European and international cybersecurity governance standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMPLIANCE_FRAMEWORKS.map((framework) => (
              <div
                key={framework.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {framework.code}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {framework.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      {framework.score}%
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      Compliant
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${framework.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {framework.description}
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Controls: <strong className="text-slate-900 dark:text-white font-mono">{framework.satisfiedControls} / {framework.requiredControls}</strong> validated
                  </span>
                  <button
                    onClick={onOpenDemo}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Generate Audit PDF →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-over Remediation Detail Drawer */}
      {selectedFinding && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-500">
                {selectedFinding.id} · {selectedFinding.category}
              </span>
              <button
                onClick={() => setSelectedFinding(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs px-2 py-1 rounded"
              >
                Close ✕
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono">
                  CVSS {selectedFinding.cvss.toFixed(1)} · {selectedFinding.severity}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {selectedFinding.affectedAsset}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedFinding.title}
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Vulnerability Analysis:
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedFinding.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Business & Regulatory Impact:
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedFinding.impact}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                  <span>Remediation Procedure:</span>
                  <button
                    onClick={() => handleCopy(selectedFinding.remediation, 'drawer-copy')}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    {copiedKey === 'drawer-copy' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="font-mono text-[10px]">{copiedKey === 'drawer-copy' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <code className="block font-mono text-emerald-600 dark:text-emerald-400 break-all">
                  {selectedFinding.remediation}
                </code>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  if (selectedFinding.affectedAsset) {
                    onScanTarget(selectedFinding.affectedAsset);
                  }
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-lg transition-colors"
              >
                Re-verify Asset Fix Now
              </button>
              <button
                onClick={() => setSelectedFinding(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Target Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Add Asset to Exposure Perimeter
              </h3>
              <button
                onClick={() => setShowAddAssetModal(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Target FQDN / Hostname
                </label>
                <input
                  type="text"
                  required
                  value={newHostname}
                  onChange={(e) => setNewHostname(e.target.value)}
                  placeholder="e.g. secure.acme-corp.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Asset Classification
                </label>
                <select
                  value={newAssetType}
                  onChange={(e) => setNewAssetType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="web">Web Application / Portal</option>
                  <option value="api">API Endpoint Gateway</option>
                  <option value="mail">Corporate Mail Server</option>
                  <option value="dns">Authoritative Nameserver</option>
                  <option value="cloud">Cloud Storage / Bucket</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold rounded-lg shadow-sm"
                >
                  Add Target & Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
