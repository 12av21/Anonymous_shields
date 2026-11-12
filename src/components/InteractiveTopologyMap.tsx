import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, Server, Shield, Lock, Database, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

interface TopologyNode {
  id: string;
  name: string;
  category: 'api' | 'web' | 'db' | 'mail' | 'dns';
  x: number;
  y: number;
  status: 'secure' | 'warning' | 'alert';
  ip: string;
  ports: string;
  details: string;
}

const NODES: TopologyNode[] = [
  {
    id: 'core',
    name: 'anonymousshields.com',
    category: 'web',
    x: 50,
    y: 50,
    status: 'secure',
    ip: '104.21.48.112',
    ports: '80, 443',
    details: 'Primary edge gateway with HSTS preload and strict DMARC.',
  },
  {
    id: 'api',
    name: 'api.production.perimeter',
    category: 'api',
    x: 25,
    y: 30,
    status: 'secure',
    ip: '104.21.48.114',
    ports: '443 (REST/GraphQL)',
    details: 'Zero Trust protected API gateway with rate-limiting.',
  },
  {
    id: 'mail',
    name: 'mail.corp-relay.net',
    category: 'mail',
    x: 75,
    y: 28,
    status: 'warning',
    ip: '198.51.100.24',
    ports: '25, 465, 587',
    details: 'SPF pass (~all), DMARC policy quarantine. Action: upgrade to reject.',
  },
  {
    id: 'staging',
    name: 'staging-legacy.internal',
    category: 'web',
    x: 20,
    y: 72,
    status: 'alert',
    ip: '203.0.113.88',
    ports: '8080, 5432',
    details: 'Exposed database port 5432 without VPN perimeter barrier.',
  },
  {
    id: 'vault',
    name: 'vault-s3.cloud-storage',
    category: 'db',
    x: 80,
    y: 68,
    status: 'secure',
    ip: '198.51.100.77',
    ports: '443 (HTTPS)',
    details: 'Encrypted at rest with KMS, public access blocked.',
  },
  {
    id: 'dns',
    name: 'ns1.perimeter-dns.org',
    category: 'dns',
    x: 50,
    y: 18,
    status: 'secure',
    ip: '192.0.2.53',
    ports: '53 (UDP/TCP)',
    details: 'Anycast DNS with DNSSEC validation enabled.',
  },
];

export const InteractiveTopologyMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<TopologyNode>(NODES[0]);
  const [isScanning, setIsScanning] = useState(false);

  const handleSweep = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1500);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-6 md:p-8 text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-Time External Perimeter Map</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Attack Surface Topology & Exposure Mesh
          </h3>
        </div>

        <button
          onClick={handleSweep}
          disabled={isScanning}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Syncing Mesh...' : 'Live Perimeter Sweep'}</span>
        </button>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
        {/* Subtle background radar circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-64 h-64 rounded-full border border-slate-600" />
          <div className="w-96 h-96 rounded-full border border-slate-700 absolute" />
          <div className="w-[32rem] h-[32rem] rounded-full border border-slate-800 absolute" />
        </div>

        {/* Dynamic connection lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {NODES.filter((n) => n.id !== 'core').map((n) => (
            <line
              key={n.id}
              x1="50%"
              y1="50%"
              x2={`${n.x}%`}
              y2={`${n.y}%`}
              stroke={n.status === 'alert' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(52, 211, 153, 0.3)'}
              strokeWidth="1.5"
              strokeDasharray={n.status === 'alert' ? '4 4' : 'none'}
            />
          ))}
        </svg>

        {/* Nodes */}
        {NODES.map((node) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
            >
              <div
                className={`relative flex items-center justify-center rounded-xl p-2.5 transition-all duration-300 ${
                  node.id === 'core'
                    ? 'w-12 h-12 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                    : node.status === 'alert'
                    ? 'w-9 h-9 bg-rose-500/20 border border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : node.status === 'warning'
                    ? 'w-9 h-9 bg-amber-500/20 border border-amber-500 text-amber-400'
                    : 'w-9 h-9 bg-slate-800 border border-slate-700 text-slate-300 hover:border-emerald-500/60'
                } ${isSelected ? 'scale-115 ring-2 ring-emerald-400/80 ring-offset-2 ring-offset-slate-950' : ''}`}
              >
                {node.category === 'web' && <Globe className="w-4 h-4" />}
                {node.category === 'api' && <Server className="w-4 h-4" />}
                {node.category === 'mail' && <Lock className="w-4 h-4" />}
                {node.category === 'db' && <Database className="w-4 h-4" />}
                {node.category === 'dns' && <Shield className="w-4 h-4" />}

                {node.status === 'alert' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>

              {/* Node label */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-slate-300 pointer-events-none group-hover:text-emerald-400 transition-colors">
                {node.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details Box */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm font-sans">{selectedNode.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              selectedNode.status === 'secure'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : selectedNode.status === 'warning'
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}>
              {selectedNode.status.toUpperCase()}
            </span>
          </div>
          <div className="text-slate-400 text-[11px] font-sans">
            {selectedNode.details}
          </div>
        </div>

        <div className="sm:text-right shrink-0 space-y-1 text-slate-400">
          <div>IP: <span className="text-slate-200">{selectedNode.ip}</span></div>
          <div>Ports: <span className="text-slate-200">{selectedNode.ports}</span></div>
        </div>
      </div>
    </div>
  );
};
