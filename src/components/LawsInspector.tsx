import React, { useState } from 'react';
import { Reality, RealityLaw } from '../types/multiverse.ts';
import { Plus, Sliders, AlertTriangle, ShieldCheck, Upload } from 'lucide-react';

interface LawsInspectorProps {
  reality: Reality | undefined;
  onMutateLaw: (law: Omit<RealityLaw, 'id' | 'isMutable' | 'stabilityIndex'>) => void;
  onExportToDrive?: () => void;
}

export const LawsInspector: React.FC<LawsInspectorProps> = ({ reality, onMutateLaw, onExportToDrive }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [lawName, setLawName] = useState('');
  const [category, setCategory] = useState<RealityLaw['category']>('ONTOLOGY');
  const [description, setDescription] = useState('');
  const [formalAxiom, setFormalAxiom] = useState('');

  if (!reality) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lawName || !description) return;

    onMutateLaw({
      name: lawName,
      category,
      description,
      formalAxiom: formalAxiom || 'Axiom(Decree)',
    });

    setLawName('');
    setDescription('');
    setFormalAxiom('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#070b14] p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-semibold text-slate-200">Active Laws & Axioms</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {reality.laws.length} laws compiled in {reality.id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onExportToDrive && (
            <button
              onClick={onExportToDrive}
              className="px-2 py-1 text-xs font-medium text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 rounded flex items-center gap-1 transition-colors"
              title="Export state, laws, and history to Google Drive"
            >
              <Upload className="w-3 h-3" />
              <span>Export</span>
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/60 rounded flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Mutate / Add Law</span>
          </button>
        </div>
      </div>

      {/* Modal / Form for Mutation */}
      {showAddModal && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-slate-900/80 border border-cyan-500/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Decree Law Mutation / Paradox</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Law Designation</label>
            <input
              type="text"
              value={lawName}
              onChange={(e) => setLawName(e.target.value)}
              placeholder="e.g. Non-Euclidean Entropy Cascade"
              className="w-full bg-[#05070c] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-sans"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#05070c] border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="ONTOLOGY">ONTOLOGY</option>
                <option value="FORCES">FORCES</option>
                <option value="CAUSALITY">CAUSALITY</option>
                <option value="PARADOX">PARADOX</option>
                <option value="METRICS">METRICS</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Formal Axiom</label>
              <input
                type="text"
                value={formalAxiom}
                onChange={(e) => setFormalAxiom(e.target.value)}
                placeholder="e.g. 1 + 1 ≡ Green"
                className="w-full bg-[#05070c] border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Description / Functional Mechanics</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how this law dictates physical or abstract events..."
              className="w-full bg-[#05070c] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-sans"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors"
          >
            Commit Mutation to History
          </button>
        </form>
      )}

      {/* Law Cards */}
      <div className="space-y-2.5">
        {reality.laws.map((law) => {
          const isParadox = law.category === 'PARADOX';

          return (
            <div
              key={law.id}
              className={`p-3 rounded-lg border transition-colors ${
                isParadox
                  ? 'bg-rose-950/20 border-rose-900/50'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-slate-200">
                    {law.name}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {law.category}
                </span>
              </div>

              <div className="my-1.5 px-2 py-1 bg-black/40 rounded border border-slate-800 font-mono text-[11px] text-cyan-300">
                {law.formalAxiom}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {law.description}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 pt-1.5 border-t border-slate-800/40">
                <span>Stability: {(law.stabilityIndex * 100).toFixed(0)}%</span>
                <span>{law.isMutable ? 'MUTABLE' : 'IMMUTABLE'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
