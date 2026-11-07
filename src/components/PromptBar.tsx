import React, { useState } from 'react';
import { Sparkles, Terminal, ArrowRight, Lightbulb } from 'lucide-react';

interface PromptBarProps {
  onIssueDecree: (prompt: string, stratum?: 'EMPIRICAL' | 'ABSTRACT' | 'HYBRID') => Promise<void>;
  isCompiling: boolean;
}

const PRESET_DECREES = [
  {
    title: 'Axiomatic Math Continuum',
    stratum: 'ABSTRACT' as const,
    prompt: 'A universe where mathematical knowledge is the literal physics and material substrate. Axioms act as elementary particles. Logical derivations constitute the flow of time and causality. Proving new theorems unrolls higher dimensions.'
  },
  {
    title: 'Quantum Poetic Weave',
    stratum: 'ABSTRACT' as const,
    prompt: 'A reality where atomic orbitals are governed by lyrical rhymes and meter. Spoken metaphors exert gravitational attraction, and silence produces vacuum decay.'
  },
  {
    title: '1920s Empirical Steam Vacuum',
    stratum: 'EMPIRICAL' as const,
    prompt: 'A rigorous 19th-century thermodynamics universe governed strictly by steam-pressure equations, Carnot cycles, and brass machinery without quantum uncertainty.'
  },
  {
    title: 'Ontological Paradox Realm',
    stratum: 'HYBRID' as const,
    prompt: 'A reality where 1 + 1 = Green, division by zero creates luminescent crystal arrays, and cause is always preceded by its effect.'
  }
];

export const PromptBar: React.FC<PromptBarProps> = ({ onIssueDecree, isCompiling }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStratum, setSelectedStratum] = useState<'EMPIRICAL' | 'ABSTRACT' | 'HYBRID'>('HYBRID');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isCompiling) return;
    onIssueDecree(prompt.trim(), selectedStratum);
  };

  const handleApplyPreset = (preset: typeof PRESET_DECREES[0]) => {
    setPrompt(preset.prompt);
    setSelectedStratum(preset.stratum);
  };

  return (
    <div className="w-full bg-[#080c16]/95 border-t border-slate-800 p-4 shadow-xl">
      <div className="max-w-6xl mx-auto">
        {/* Quick Presets Carousel */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>Preset Blueprints:</span>
          </span>
          {PRESET_DECREES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 text-[11px]"
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* The Prompt Bar Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Decree reality laws, mathematical substrates, or impossible paradoxes... (e.g. 'A 4D fluid universe where colors have mass')"
              className="w-full pl-9 pr-4 py-2.5 bg-[#05070c] border border-slate-700/80 rounded-lg text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
              disabled={isCompiling}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedStratum}
              onChange={(e) => setSelectedStratum(e.target.value as any)}
              className="bg-[#05070c] border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-sans"
              disabled={isCompiling}
            >
              <option value="ABSTRACT">Abstract Stratum</option>
              <option value="EMPIRICAL">Empirical Stratum</option>
              <option value="HYBRID">Hybrid Synthesis</option>
            </select>

            <button
              type="submit"
              disabled={!prompt.trim() || isCompiling}
              className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:hover:bg-cyan-400 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm shadow-cyan-950"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
              <span>{isCompiling ? 'Compiling Reality...' : 'Compile Decree'}</span>
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
          <span>Meta-Law 004 & 005 Enforced: ΔW_ext = 0 · Units are Null / Relational</span>
          <span>Instantiates in [DORMANT] state until manual activation decree</span>
        </div>
      </div>
    </div>
  );
};
