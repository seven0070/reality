import React from 'react';
import { Reality } from '../types/multiverse.ts';

interface TelemetryRibbonProps {
  realitiesCount: number;
  activeReality: Reality | undefined;
  mcpClientsCount: number;
}

export const TelemetryRibbon: React.FC<TelemetryRibbonProps> = ({
  realitiesCount,
  activeReality,
  mcpClientsCount
}) => {
  return (
    <div className="bg-[#090d18] border-b border-slate-800/80 px-6 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-4 text-slate-400">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">HYPERVISOR:</span>
          <span className="text-emerald-400 font-medium">ONLINE</span>
        </div>
        <span className="text-slate-700 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">BASE ZERO:</span>
          <span className="text-slate-300">R_0 (Primordial Void)</span>
        </div>
        <span className="text-slate-700 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">SLOTS:</span>
          <span className="text-cyan-300 tabular-nums">{realitiesCount} Realities</span>
        </div>
        <span className="text-slate-700 hidden md:inline">|</span>
        <div className="flex items-center gap-1.5 hidden md:flex">
          <span className="text-slate-500">FOCUS:</span>
          <span className="text-slate-200 font-semibold">{activeReality?.id || 'R_0'} · {activeReality?.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">EXT WORK ΔW:</span>
          <span className="text-slate-200 tabular-nums font-semibold">0.000000 J</span>
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider">(Hermetic)</span>
        </div>
        <span className="text-slate-700 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">HOST LOAD:</span>
          <span className="text-slate-200 tabular-nums font-semibold">~0.000%</span>
          <span className="text-[10px] text-cyan-400 uppercase tracking-wider">(Decoupled)</span>
        </div>
        <span className="text-slate-700 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">MCP GATEWAY:</span>
          <span className="text-cyan-400 tabular-nums font-semibold">{mcpClientsCount} Connected</span>
        </div>
      </div>
    </div>
  );
};
