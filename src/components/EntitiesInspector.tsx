import React, { useState } from 'react';
import { Reality, RealityEntity } from '../types/multiverse.ts';
import { Plus, Box, Sparkles } from 'lucide-react';

interface EntitiesInspectorProps {
  reality: Reality | undefined;
  onInjectEntity: (entity: Omit<RealityEntity, 'id' | 'status'>) => void;
  selectedEntity: RealityEntity | null;
  onSelectEntity: (entity: RealityEntity) => void;
}

export const EntitiesInspector: React.FC<EntitiesInspectorProps> = ({
  reality,
  onInjectEntity,
  selectedEntity,
  onSelectEntity
}) => {
  const [showInjectModal, setShowInjectModal] = useState(false);
  const [entityName, setEntityName] = useState('');
  const [substrate, setSubstrate] = useState('');
  const [density, setDensity] = useState(1.0);

  if (!reality) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityName || !substrate) return;

    onInjectEntity({
      name: entityName,
      substrate,
      density: Number(density),
      coordinates: {
        x: Number((Math.random() * 3 - 1.5).toFixed(2)),
        y: Number((Math.random() * 3 - 1.5).toFixed(2)),
        z: 0
      },
      properties: { injectedBy: 'Architect Decree' }
    });

    setEntityName('');
    setSubstrate('');
    setDensity(1.0);
    setShowInjectModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#070b14] p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-semibold text-slate-200">Materialized Entities</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {reality.entities.length} entities in {reality.id}
          </p>
        </div>
        <button
          onClick={() => setShowInjectModal(true)}
          className="px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/60 rounded flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Inject Entity</span>
        </button>
      </div>

      {/* Form */}
      {showInjectModal && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-slate-900/80 border border-cyan-500/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Materialize Entity Ex Nihilo</span>
            </span>
            <button
              type="button"
              onClick={() => setShowInjectModal(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Entity Name</label>
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="e.g. Prime Sieve Singularity"
              className="w-full bg-[#05070c] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Substrate / Nature</label>
            <input
              type="text"
              value={substrate}
              onChange={(e) => setSubstrate(e.target.value)}
              placeholder="e.g. Crystalline Proof Manifold"
              className="w-full bg-[#05070c] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Relative Computational Density ({density}×)
            </label>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.1"
              value={density}
              onChange={(e) => setDensity(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors"
          >
            Materialize Into Reality
          </button>
        </form>
      )}

      {/* Entity Cards */}
      <div className="space-y-2">
        {reality.entities.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No entities currently instantiated. The void is empty.
          </div>
        ) : (
          reality.entities.map((entity) => {
            const isSelected = selectedEntity?.id === entity.id;

            return (
              <div
                key={entity.id}
                onClick={() => onSelectEntity(entity)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/80 border-cyan-400'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Box className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <h4 className="text-xs font-semibold text-slate-200 truncate">
                      {entity.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {entity.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mt-1">
                  Substrate: <span className="text-slate-300">{entity.substrate}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 mt-2 pt-1.5 border-t border-slate-800/50">
                  <div>
                    Density: <span className="text-slate-300 tabular-nums">{entity.density}×</span>
                  </div>
                  <div className="text-right truncate">
                    Coords: ({entity.coordinates.x}, {entity.coordinates.y})
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
