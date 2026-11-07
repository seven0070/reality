import React, { useState, useEffect, useRef } from 'react';
import { ConnectedAgent, Reality, AgentLogEntry } from '../types/multiverse.ts';
import { Bot, Play, Pause, RefreshCw, Cpu, Brain, Zap, Terminal } from 'lucide-react';

interface AgentDeckProps {
  agents: ConnectedAgent[];
  activeReality: Reality | undefined;
  onExecuteAgentCycle: (agentId: string) => Promise<void>;
  onToggleAutoPilot: (agentId: string, auto: boolean) => void;
  isProcessingCycle: boolean;
}

export const AgentDeck: React.FC<AgentDeckProps> = ({
  agents,
  activeReality,
  onExecuteAgentCycle,
  onToggleAutoPilot,
  isProcessingCycle
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const agent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Auto-Pilot timer
  useEffect(() => {
    if (!agent?.autonomousMode || !activeReality) return;

    const interval = setInterval(() => {
      if (!isProcessingCycle) {
        onExecuteAgentCycle(agent.id);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [agent?.autonomousMode, agent?.id, activeReality, isProcessingCycle, onExecuteAgentCycle]);

  if (!agent) {
    return (
      <div className="p-6 text-center text-slate-500 text-xs">
        No agents connected to the MCP gateway.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#070b14] p-4 overflow-y-auto">
      {/* Agent Header */}
      <div className="pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-100">{agent.name}</h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.2 rounded border border-cyan-800/40">
                  {agent.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {agent.personality}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-slate-500 block">MCP LINK</span>
            <span className="text-xs font-mono text-emerald-400 font-medium">LIVE</span>
          </div>
        </div>

        {/* Autonomous Mode Toggle & Action Bar */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/60">
          <button
            onClick={() => onToggleAutoPilot(agent.id, !agent.autonomousMode)}
            className={`px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 transition-all ${
              agent.autonomousMode
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm shadow-cyan-900'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {agent.autonomousMode ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Auto-Pilot: Active</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Enable Autonomous Auto-Pilot</span>
              </>
            )}
          </button>

          <button
            onClick={() => onExecuteAgentCycle(agent.id)}
            disabled={isProcessingCycle}
            className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Execute 1 autonomous reasoning & action cycle"
          >
            <RefreshCw className={`w-3 h-3 ${isProcessingCycle ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Step Cycle</span>
          </button>
        </div>
      </div>

      {/* Live State & Thought Box */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 mb-3 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span>Latest Internal Reasoning</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Cycle #{agent.reasoningCycles}
          </span>
        </div>

        <p className="text-xs text-slate-200 italic leading-relaxed bg-[#05070c] p-2.5 rounded border border-slate-800/80">
          "{agent.latestThought}"
        </p>

        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="text-slate-400">Actuated via MCP:</span>
          <span className="font-mono text-cyan-300 text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {agent.latestAction}
          </span>
        </div>
      </div>

      {/* Autonomous Causal Cycle Blueprint (Meta-Law 009) */}
      <div className="bg-[#05070c] border border-slate-800/80 rounded-lg p-3 mb-3">
        <h4 className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>Meta-Law 009 :: Autonomous Agent Reliance</span>
        </h4>
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
          <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
            <div className="text-slate-500">01. PERCEIVE</div>
            <div className="text-cyan-400 truncate mt-0.5">realities://state</div>
          </div>
          <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
            <div className="text-slate-500">02. REASON</div>
            <div className="text-slate-200 truncate mt-0.5">Agent Mind</div>
          </div>
          <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
            <div className="text-slate-500">03. ACTUATE</div>
            <div className="text-cyan-400 truncate mt-0.5">MCP Tools</div>
          </div>
          <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
            <div className="text-slate-500">04. PERSIST</div>
            <div className="text-emerald-400 truncate mt-0.5">History v+</div>
          </div>
        </div>
      </div>

      {/* Agent Activity Log */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-slate-400" />
          <span>MCP Execution Stream</span>
        </h4>

        <div className="space-y-1.5 font-mono text-[11px]">
          {agent.log.map((log) => (
            <div key={log.id} className="p-2 bg-slate-900/40 border border-slate-800/60 rounded flex items-start gap-2">
              <span className={`text-[9px] px-1 py-0.2 rounded shrink-0 ${
                log.phase === 'ACTION' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                log.phase === 'REASONING' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                'bg-slate-800 text-slate-300'
              }`}>
                {log.phase}
              </span>
              <p className="text-slate-300 leading-snug flex-1">
                {log.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
