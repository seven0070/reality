import React from 'react';
import { Sparkles, Terminal, Cpu, Share2, BookOpen, HardDrive } from 'lucide-react';

interface TopBarProps {
  onOpenDecree: () => void;
  onOpenMetaLaws: () => void;
  onOpenMCPModal: () => void;
  onOpenDriveModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenDecree,
  onOpenMetaLaws,
  onOpenMCPModal,
  onOpenDriveModal,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-[#070a12]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element Brand wordmark */}
      <div className="flex items-center gap-3">
        <a href="/" className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 rotate-45 group-hover:rotate-90 transition-transform duration-300"></span>
          <span>NullVoid Sandbox</span>
          <span className="text-xs font-mono font-normal text-slate-500 tracking-wider">v1.0-KERNEL</span>
        </a>
      </div>

      {/* Zone 2: 4-5 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('realities')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'realities' ? 'text-cyan-400' : ''}`}
        >
          Multiverse Registry
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'inspector' ? 'text-cyan-400' : ''}`}
        >
          Axioms & Laws
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'agents' ? 'text-cyan-400' : ''}`}
        >
          Autonomous Agents
        </button>
        <button
          onClick={onOpenMetaLaws}
          className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>9 Meta-Laws</span>
        </button>
        <button
          onClick={onOpenMCPModal}
          className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-cyan-300/90"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>MCP Gateway</span>
        </button>
        <button
          onClick={onOpenDriveModal}
          className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-emerald-400/90"
          title="Google Drive Sync & Backups"
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Google Drive</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenDecree}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm shadow-cyan-950"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Genesis Decree</span>
        </button>
      </div>
    </header>
  );
};
