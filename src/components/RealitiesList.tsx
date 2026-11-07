import React from 'react';
import { Reality, RealityStatus } from '../types/multiverse.ts';
import { Play, Pause, FastForward, Plus, Globe2, Layers } from 'lucide-react';

interface RealitiesListProps {
  realities: { [id: string]: Reality };
  activeRealityId: string;
  onSelectReality: (id: string) => void;
  onSetState: (id: string, state: RealityStatus) => void;
  onStepTime: (id: string, steps: number) => void;
  onOpenDecree: () => void;
}

export const RealitiesList: React.FC<RealitiesListProps> = ({
  realities,
  activeRealityId,
  onSelectReality,
  onSetState,
  onStepTime,
  onOpenDecree
}) => {
  const realityList = Object.values(realities);

  return (
    <div className="flex flex-col h-full bg-[#070b14] border border-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-100">Multiverse Registry</h2>
          <span className="text-xs font-mono text-slate-500 tabular-nums">({realityList.length})</span>
        </div>
        <button
          onClick={onOpenDecree}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
          title="Instantiate New Reality"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-2 space-y-1">
        {realityList.map((reality) => {
          const isSelected = reality.id === activeRealityId;
          const isDormant = reality.status === 'DORMANT';
          const isActive = reality.status === 'ACTIVE';

          return (
            <div
              key={reality.id}
              onClick={() => onSelectReality(reality.id)}
              className={`p-3 rounded-md cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-800/70 border border-cyan-500/30'
                  : 'hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              {/* Row 1: ID, Title, Status */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono font-bold text-cyan-400 shrink-0">
                    {reality.id}
                  </span>
                  <h3 className="text-xs font-semibold text-slate-200 truncate">
                    {reality.name}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/50 border-cyan-700/50'
                      : isDormant
                      ? 'text-amber-400 bg-amber-950/50 border-amber-800/40'
                      : 'text-slate-400 bg-slate-900 border-slate-700'
                  }`}
                >
                  {reality.status}
                </span>
              </div>

              {/* Row 2: Metadata without pill boxes */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                <span>{reality.stratum}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="truncate">{reality.dimensionality}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-mono text-slate-500">{reality.currentVersion}</span>
              </div>

              {/* Row 3: Blueprint snippet */}
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                {reality.blueprint}
              </p>

              {/* Controls bar inside active item */}
              {reality.id !== 'R_0' && (
                <div
                  className="flex items-center justify-between pt-2 border-t border-slate-800/60"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    {isDormant ? (
                      <button
                        onClick={() => onSetState(reality.id, 'ACTIVE')}
                        className="px-2 py-1 text-[11px] font-medium text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 rounded flex items-center gap-1 transition-colors"
                        title="Activate causal progression"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Activate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSetState(reality.id, 'DORMANT')}
                        className="px-2 py-1 text-[11px] font-medium text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 rounded flex items-center gap-1 transition-colors"
                        title="Freeze causality (Dormant)"
                      >
                        <Pause className="w-2.5 h-2.5 fill-current" />
                        <span>Freeze</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-500 mr-1">
                      Step: <span className="text-slate-300 tabular-nums">{reality.stepCount}</span>
                    </span>
                    <button
                      onClick={() => onStepTime(reality.id, 1)}
                      className="px-1.5 py-0.5 text-[10px] font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                      title="Step forward +1 deduction tick"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => onStepTime(reality.id, 5)}
                      className="px-1.5 py-0.5 text-[10px] font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                      title="Step forward +5 deduction ticks"
                    >
                      +5
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
