import React from 'react';
import { ROOT_META_LAWS } from '../engine/multiverse.ts';
import { X, ShieldCheck, BookOpen } from 'lucide-react';

interface MetaLawsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetaLawsModal: React.FC<MetaLawsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#080d1a] border border-slate-700/80 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100">
              The 9 Immutable Meta-Laws of the Sandbox
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {ROOT_META_LAWS.map((law) => (
            <div
              key={law.id}
              className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold">
                    LAW {law.code}
                  </span>
                  <h3 className="font-semibold text-slate-200">
                    {law.title}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                  IMMUTABLE
                </span>
              </div>
              <p className="text-slate-300 font-medium mb-1">
                {law.summary}
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {law.description}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#05070c] flex items-center justify-between text-[11px] text-slate-400">
          <span>Hypervisor Kernel Invariant: Enforced across all R_0 ... R_n</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-slate-200 hover:bg-white rounded transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
