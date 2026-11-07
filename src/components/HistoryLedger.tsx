import React from 'react';
import { Reality } from '../types/multiverse.ts';
import { History, RotateCcw, GitCommit, Check, HardDrive, Upload } from 'lucide-react';

interface HistoryLedgerProps {
  reality: Reality | undefined;
  onRollback: (realityId: string, targetVersion: string) => void;
  onExportToDrive?: () => void;
}

export const HistoryLedger: React.FC<HistoryLedgerProps> = ({ reality, onRollback, onExportToDrive }) => {
  if (!reality) return null;

  return (
    <div className="flex flex-col h-full bg-[#070b14] p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Immutable History Ledger</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {reality.history.length} recorded commits for {reality.id}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onExportToDrive && (
            <button
              onClick={onExportToDrive}
              className="px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 rounded flex items-center gap-1 transition-colors"
              title="Export state, laws, and history to Google Drive"
            >
              <Upload className="w-3 h-3" />
              <span>Export to Drive</span>
            </button>
          )}
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
            {reality.currentVersion}
          </span>
        </div>
      </div>

      {/* Commit Timeline */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-px before:bg-slate-800">
        {reality.history.map((snapshot, index) => {
          const isLatest = index === 0;

          return (
            <div key={snapshot.version + index} className="relative pl-8 group">
              {/* Dot on timeline */}
              <div
                className={`absolute left-2.5 top-2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border ${
                  isLatest
                    ? 'bg-cyan-400 border-cyan-300 ring-2 ring-cyan-950'
                    : 'bg-slate-800 border-slate-600'
                }`}
              />

              <div className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 rounded-lg p-3 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {snapshot.version}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Step {snapshot.stepCount}
                    </span>
                  </div>

                  {!isLatest && (
                    <button
                      onClick={() => onRollback(reality.id, snapshot.version)}
                      className="text-[10px] font-medium text-slate-400 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1 transition-colors"
                      title={`Rollback reality to ${snapshot.version}`}
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Rollback</span>
                    </button>
                  )}
                  {isLatest && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Head</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                  {snapshot.decreeSummary}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 pt-1.5 border-t border-slate-800/50">
                  <span>
                    Laws: {snapshot.lawCount} · Entities: {snapshot.entityCount}
                  </span>
                  <span>{new Date(snapshot.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
