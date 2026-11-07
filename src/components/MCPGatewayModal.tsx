import React, { useState } from 'react';
import { MCP_TOOLS_REGISTRY, MCP_RESOURCES_REGISTRY } from '../engine/multiverse.ts';
import { X, Share2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface MCPGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MCPGatewayModal: React.FC<MCPGatewayModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        'nullvoid-multiverse': {
          url: `${currentOrigin}/api/mcp/sse`,
        }
      }
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(claudeConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#080d1a] border border-slate-700/80 rounded-xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Model Context Protocol (MCP) Gateway
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
            <h3 className="font-semibold text-slate-200 mb-1">
              Connect Any AI Agent via Standardized MCP
            </h3>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Any external client (Claude Desktop, Cursor IDE, LangChain, or custom autonomous agent scripts) can connect to this sandbox. The connected agent can query reality state vectors, formulate proofs, and actuate reality laws with zero micromanagement.
            </p>
          </div>

          {/* Endpoints */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-semibold text-slate-300 block">
              LIVE ENDPOINTS
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 bg-black/50 border border-slate-800 rounded">
                <span className="text-slate-500 block text-[10px]">SSE STREAM (MCP v1.0)</span>
                <span className="text-cyan-400 truncate block">{currentOrigin}/api/mcp/sse</span>
              </div>
              <div className="p-2.5 bg-black/50 border border-slate-800 rounded">
                <span className="text-slate-500 block text-[10px]">JSON-RPC MESSAGE ROUTE</span>
                <span className="text-cyan-400 truncate block">{currentOrigin}/api/mcp/message</span>
              </div>
            </div>
          </div>

          {/* Client Config */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono font-semibold text-slate-300">
                CLIENT CONFIGURATION (Claude Desktop / Cursor)
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3 bg-black/70 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto">
              {claudeConfig}
            </pre>
          </div>

          {/* Tools List */}
          <div>
            <span className="text-[11px] font-mono font-semibold text-slate-300 block mb-2">
              EXPOSED MCP TOOLS ({MCP_TOOLS_REGISTRY.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              {MCP_TOOLS_REGISTRY.map((t) => (
                <div key={t.name} className="p-2 bg-slate-900/40 border border-slate-800 rounded">
                  <span className="font-mono text-cyan-300 font-medium">{t.name}()</span>
                  <p className="text-slate-400 text-[10px] mt-0.5 line-clamp-2">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources List */}
          <div>
            <span className="text-[11px] font-mono font-semibold text-slate-300 block mb-2">
              EXPOSED MCP RESOURCES ({MCP_RESOURCES_REGISTRY.length})
            </span>
            <div className="space-y-1.5 text-[11px]">
              {MCP_RESOURCES_REGISTRY.map((r) => (
                <div key={r.uri} className="p-2 bg-slate-900/40 border border-slate-800 rounded flex items-center justify-between gap-2">
                  <span className="font-mono text-slate-300">{r.uri}</span>
                  <span className="text-[10px] text-slate-500">{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#05070c] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-slate-200 hover:bg-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
