export type AssetType = 'web' | 'api' | 'mail' | 'dns' | 'cloud';

export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface DnsRecord {
  type: string;
  name: string;
  data: string;
  ttl: number;
}

export interface MailSecurityAudit {
  hasSpf: boolean;
  spfRecord?: string;
  spfIssues: string[];
  hasDmarc: boolean;
  dmarcRecord?: string;
  dmarcPolicy?: 'reject' | 'quarantine' | 'none' | 'unknown';
  dmarcIssues: string[];
  hasMx: boolean;
  mxCount: number;
  status: 'pass' | 'warning' | 'fail';
}

export interface SecurityHeaderCheck {
  header: string;
  expected: string;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  recommendation: string;
  severity: FindingSeverity;
}

export interface SecurityFinding {
  id: string;
  title: string;
  severity: FindingSeverity;
  category: 'DNS & Infrastructure' | 'Email Security' | 'HTTP Headers' | 'SSL/TLS' | 'Exposure';
  cvss: number;
  description: string;
  impact: string;
  remediation: string;
  affectedAsset?: string;
  cveOrStandard?: string;
}

export interface SecurityScanResult {
  domain: string;
  timestamp: string;
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  dnsRecords: DnsRecord[];
  mailSecurity: MailSecurityAudit;
  securityHeaders: SecurityHeaderCheck[];
  hasCaa: boolean;
  caaRecords: string[];
  hasIpv6: boolean;
  findings: SecurityFinding[];
  summary: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    infoCount: number;
    passedChecks: number;
    totalChecks: number;
  };
}

export interface MonitoredAsset {
  id: string;
  hostname: string;
  ipAddress: string;
  assetType: AssetType;
  service: string;
  sslExpiryDays: number;
  sslValid: boolean;
  status: 'secure' | 'warning' | 'vulnerable';
  lastScanned: string;
}

export interface ComplianceFramework {
  id: string;
  code: 'NIS2' | 'DORA' | 'SOC2' | 'ISO27001';
  name: string;
  score: number;
  description: string;
  requiredControls: number;
  satisfiedControls: number;
  status: 'compliant' | 'in_progress' | 'action_needed';
}
