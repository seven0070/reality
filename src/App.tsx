import React, { useState, useCallback } from 'react';
import {
  createInitialMultiverseState,
  instantiateReality,
  setRealityState,
  stepRealityTime,
  mutateLaw,
  injectEntity,
  rollbackReality,
  dispatchMCPToolCall,
} from './engine/multiverse.ts';
import { MultiverseState, Reality, RealityEntity, RealityLaw, RealityStatus, AgentLogEntry } from './types/multiverse.ts';
import { TopBar } from './components/TopBar.tsx';
import { TelemetryRibbon } from './components/TelemetryRibbon.tsx';
import { SandboxCanvas } from './components/SandboxCanvas.tsx';
import { RealitiesList } from './components/RealitiesList.tsx';
import { LawsInspector } from './components/LawsInspector.tsx';
import { EntitiesInspector } from './components/EntitiesInspector.tsx';
import { AgentDeck } from './components/AgentDeck.tsx';
import { HistoryLedger } from './components/HistoryLedger.tsx';
import { PromptBar } from './components/PromptBar.tsx';
import { MetaLawsModal } from './components/MetaLawsModal.tsx';
import { MCPGatewayModal } from './components/MCPGatewayModal.tsx';
import { GoogleDriveModal } from './components/GoogleDriveModal.tsx';
import { Scale, Layers, Box, Bot, History, Sparkles } from 'lucide-react';

export default function App() {
  const [multiverse, setMultiverse] = useState<MultiverseState>(() => createInitialMultiverseState());
  const [rightTab, setRightTab] = useState<'laws' | 'entities' | 'agents' | 'history'>('laws');
  const [selectedEntity, setSelectedEntity] = useState<RealityEntity | null>(null);
  const [isCompilingDecree, setIsCompilingDecree] = useState(false);
  const [isProcessingAgentCycle, setIsProcessingAgentCycle] = useState(false);

  // Modals
  const [isMetaLawsOpen, setIsMetaLawsOpen] = useState(false);
  const [isMCPOpen, setIsMCPOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);

  const activeReality = multiverse.realities[multiverse.activeRealityId] || multiverse.realities['R_1'];

  // Handle active reality selection
  const handleSelectReality = (id: string) => {
    setMultiverse(prev => ({
      ...prev,
      activeRealityId: id,
    }));
    setSelectedEntity(null);
  };

  // Handle setting reality state (Active, Dormant, Archived)
  const handleSetState = (id: string, status: RealityStatus) => {
    setMultiverse(prev => setRealityState(prev, id, status));
  };

  // Step reality time
  const handleStepTime = (id: string, steps: number) => {
    setMultiverse(prev => stepRealityTime(prev, id, steps));
  };

  // Handle decree submission from prompt bar
  const handleIssueDecree = async (prompt: string, stratum?: 'EMPIRICAL' | 'ABSTRACT' | 'HYBRID') => {
    setIsCompilingDecree(true);
    try {
      const response = await fetch('/api/gemini/decree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          currentRealitiesCount: Object.keys(multiverse.realities).length
        })
      });

      const blueprintData = await response.json();

      if (response.ok && blueprintData.name) {
        // Instantiate reality with compiled laws & entities
        const { newState, newRealityId } = instantiateReality(multiverse, {
          name: blueprintData.name,
          blueprint: blueprintData.blueprint || prompt,
          stratum: blueprintData.stratum || stratum || 'HYBRID',
          dimensionality: blueprintData.dimensionality || '3D Non-Euclidean',
        });

        // If Gemini returned specific laws, merge them
        let updatedState = newState;
        if (blueprintData.laws && Array.isArray(blueprintData.laws)) {
          blueprintData.laws.forEach((l: any) => {
            updatedState = mutateLaw(updatedState, newRealityId, {
              name: l.name,
              category: l.category || 'ONTOLOGY',
              description: l.description,
              formalAxiom: l.formalAxiom || 'Axiom := Derived',
            });
          });
        }

        // If Gemini returned specific entities, inject them
        if (blueprintData.entities && Array.isArray(blueprintData.entities)) {
          blueprintData.entities.forEach((e: any) => {
            updatedState = injectEntity(updatedState, newRealityId, {
              name: e.name,
              substrate: e.substrate || 'Synthesized Monad',
              density: e.density || 1.0,
              coordinates: {
                x: Number((Math.random() * 2 - 1).toFixed(2)),
                y: Number((Math.random() * 2 - 1).toFixed(2)),
                z: 0
              },
              properties: { createdVia: 'Prompt Bar Decree' }
            });
          });
        }

        setMultiverse(updatedState);
      } else {
        // Fallback local instant instantiation
        const { newState } = instantiateReality(multiverse, {
          name: prompt.length > 25 ? prompt.slice(0, 22) + '...' : prompt,
          blueprint: prompt,
          stratum: stratum || 'HYBRID',
        });
        setMultiverse(newState);
      }
    } catch (err) {
      console.error('Failed to compile decree via server:', err);
      // Fallback local instantiation
      const { newState } = instantiateReality(multiverse, {
        name: prompt.length > 25 ? prompt.slice(0, 22) + '...' : prompt,
        blueprint: prompt,
        stratum: stratum || 'HYBRID',
      });
      setMultiverse(newState);
    } finally {
      setIsCompilingDecree(false);
    }
  };

  // Law mutation handler
  const handleMutateLaw = (law: Omit<RealityLaw, 'id' | 'isMutable' | 'stabilityIndex'>) => {
    if (!activeReality) return;
    setMultiverse(prev => mutateLaw(prev, activeReality.id, law));
  };

  // Entity injection handler
  const handleInjectEntity = (entity: Omit<RealityEntity, 'id' | 'status'>) => {
    if (!activeReality) return;
    setMultiverse(prev => injectEntity(prev, activeReality.id, entity));
  };

  // Rollback handler
  const handleRollback = (realityId: string, version: string) => {
    setMultiverse(prev => rollbackReality(prev, realityId, version));
  };

  // Import reality from Google Drive
  const handleImportReality = (imported: Reality) => {
    const count = Object.keys(multiverse.realities).length;
    const newId = multiverse.realities[imported.id] ? `R_${count}` : imported.id;
    const updatedReality: Reality = {
      ...imported,
      id: newId,
      status: 'DORMANT',
      history: [
        {
          version: imported.currentVersion || 'v1.0',
          timestamp: new Date().toISOString(),
          stepCount: imported.stepCount || 0,
          decreeSummary: `Google Drive Import: Reality [${imported.name}] restored from Google Drive archive.`,
          status: 'DORMANT',
          entityCount: imported.entities.length,
          lawCount: imported.laws.length,
          lawsSnapshot: JSON.parse(JSON.stringify(imported.laws)),
          entitiesSnapshot: JSON.parse(JSON.stringify(imported.entities)),
        },
        ...(imported.history || [])
      ]
    };

    setMultiverse(prev => ({
      ...prev,
      realities: {
        ...prev.realities,
        [newId]: updatedReality
      },
      activeRealityId: newId,
    }));
  };

  // Toggle Autonomous Auto-Pilot for an agent
  const handleToggleAutoPilot = (agentId: string, auto: boolean) => {
    setMultiverse(prev => ({
      ...prev,
      agents: prev.agents.map(a => a.id === agentId ? { ...a, autonomousMode: auto } : a)
    }));
  };

  // Execute one autonomous agent cycle (Perception -> Reasoning -> Action -> Persistence)
  const handleExecuteAgentCycle = useCallback(async (agentId: string) => {
    const currentAgent = multiverse.agents.find(a => a.id === agentId);
    if (!currentAgent || !activeReality || isProcessingAgentCycle) return;

    setIsProcessingAgentCycle(true);
    try {
      const response = await fetch('/api/gemini/autonomous-loop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          realityId: activeReality.id,
          agent: currentAgent,
          realityState: activeReality,
        })
      });

      const decision = await response.json();

      if (response.ok && decision.toolCall) {
        // Execute tool call through pure dispatch engine
        const { state: nextState, result } = dispatchMCPToolCall(
          multiverse,
          decision.toolCall.tool,
          decision.toolCall.args
        );

        // Update agent record
        const logEntries: AgentLogEntry[] = [
          {
            id: `LOG_${Date.now()}_P`,
            timestamp: new Date().toISOString(),
            phase: 'PERCEPTION',
            content: decision.perception || 'Observed reality state vector.',
          },
          {
            id: `LOG_${Date.now()}_R`,
            timestamp: new Date().toISOString(),
            phase: 'REASONING',
            content: decision.reasoning || 'Formulated logical deduction.',
          },
          {
            id: `LOG_${Date.now()}_A`,
            timestamp: new Date().toISOString(),
            phase: 'ACTION',
            content: `Actuated MCP tool: ${decision.toolCall.tool}() -> ${JSON.stringify(result)}`,
            mcpToolUsed: decision.toolCall.tool,
          }
        ];

        setMultiverse({
          ...nextState,
          agents: nextState.agents.map(a => {
            if (a.id === agentId) {
              return {
                ...a,
                reasoningCycles: a.reasoningCycles + 1,
                latestThought: decision.reasoning || a.latestThought,
                latestAction: `${decision.toolCall.tool}() executed`,
                log: [...logEntries, ...a.log].slice(0, 30),
              };
            }
            return a;
          })
        });
      }
    } catch (error) {
      console.error('Error executing agent cycle:', error);
    } finally {
      setIsProcessingAgentCycle(false);
    }
  }, [multiverse, activeReality, isProcessingAgentCycle]);

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans">
      {/* 1. Header (Top Bar Contract) */}
      <TopBar
        onOpenDecree={() => {
          const el = document.querySelector('input[placeholder*="Decree"]');
          if (el instanceof HTMLInputElement) el.focus();
        }}
        onOpenMetaLaws={() => setIsMetaLawsOpen(true)}
        onOpenMCPModal={() => setIsMCPOpen(true)}
        onOpenDriveModal={() => setIsDriveOpen(true)}
        activeTab={rightTab}
        setActiveTab={(tab: string) => {
          if (tab === 'agents') setRightTab('agents');
          else if (tab === 'inspector') setRightTab('laws');
        }}
      />

      {/* 2. Top Telemetry Ribbon */}
      <TelemetryRibbon
        realitiesCount={Object.keys(multiverse.realities).length}
        activeReality={activeReality}
        mcpClientsCount={multiverse.mcpConnectedClients}
      />

      {/* 3. Main Workspace Grid */}
      <main className="flex-1 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 max-w-[1600px] w-full mx-auto overflow-hidden">
        {/* Left Column: Multiverse Registry (3 cols) */}
        <section className="lg:col-span-3 h-[520px] lg:h-auto overflow-hidden">
          <RealitiesList
            realities={multiverse.realities}
            activeRealityId={multiverse.activeRealityId}
            onSelectReality={handleSelectReality}
            onSetState={handleSetState}
            onStepTime={handleStepTime}
            onOpenDecree={() => {
              const el = document.querySelector('input[placeholder*="Decree"]');
              if (el instanceof HTMLInputElement) el.focus();
            }}
          />
        </section>

        {/* Center Stage: Interactive Sandbox Canvas (5 cols) */}
        <section className="lg:col-span-5 flex flex-col h-[460px] lg:h-auto">
          <SandboxCanvas
            reality={activeReality}
            selectedEntity={selectedEntity}
            onSelectEntity={(ent) => {
              setSelectedEntity(ent);
              setRightTab('entities');
            }}
          />
        </section>

        {/* Right Column: Tabbed Inspector & Autonomous Agent Deck (4 cols) */}
        <section className="lg:col-span-4 flex flex-col h-[520px] lg:h-auto bg-[#070b14] border border-slate-800 rounded-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex items-center border-b border-slate-800 bg-[#090d18] px-2 py-1 text-xs">
            <button
              onClick={() => setRightTab('laws')}
              className={`px-3 py-1.5 font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                rightTab === 'laws'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Axioms</span>
            </button>
            <button
              onClick={() => setRightTab('entities')}
              className={`px-3 py-1.5 font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                rightTab === 'entities'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Entities</span>
            </button>
            <button
              onClick={() => setRightTab('agents')}
              className={`px-3 py-1.5 font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                rightTab === 'agents'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>MCP Agent</span>
            </button>
            <button
              onClick={() => setRightTab('history')}
              className={`px-3 py-1.5 font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                rightTab === 'history'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Ledger</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="flex-1 overflow-hidden">
            {rightTab === 'laws' && (
              <LawsInspector
                reality={activeReality}
                onMutateLaw={handleMutateLaw}
                onExportToDrive={() => setIsDriveOpen(true)}
              />
            )}
            {rightTab === 'entities' && (
              <EntitiesInspector
                reality={activeReality}
                selectedEntity={selectedEntity}
                onSelectEntity={(ent) => setSelectedEntity(ent)}
                onInjectEntity={handleInjectEntity}
              />
            )}
            {rightTab === 'agents' && (
              <AgentDeck
                agents={multiverse.agents}
                activeReality={activeReality}
                onExecuteAgentCycle={handleExecuteAgentCycle}
                onToggleAutoPilot={handleToggleAutoPilot}
                isProcessingCycle={isProcessingAgentCycle}
              />
            )}
            {rightTab === 'history' && (
              <HistoryLedger
                reality={activeReality}
                onRollback={handleRollback}
                onExportToDrive={() => setIsDriveOpen(true)}
              />
            )}
          </div>
        </section>
      </main>

      {/* 4. Bottom Omnipotent Prompt Bar */}
      <PromptBar
        onIssueDecree={handleIssueDecree}
        isCompiling={isCompilingDecree}
      />

      {/* Modals */}
      <MetaLawsModal
        isOpen={isMetaLawsOpen}
        onClose={() => setIsMetaLawsOpen(false)}
      />
      <MCPGatewayModal
        isOpen={isMCPOpen}
        onClose={() => setIsMCPOpen(false)}
      />
      <GoogleDriveModal
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
        activeReality={activeReality}
        onImportReality={handleImportReality}
      />
    </div>
  );
}
