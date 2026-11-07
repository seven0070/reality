export type RealityStatus = 'DORMANT' | 'ACTIVE' | 'ARCHIVED';

export type KnowledgeStratum = 'EMPIRICAL' | 'ABSTRACT' | 'HYBRID' | 'NULL_VOID';

export type AgentRole = 'OBSERVER' | 'INHABITANT' | 'SUB_ARCHITECT';

export interface RealityLaw {
  id: string;
  name: string;
  category: 'ONTOLOGY' | 'FORCES' | 'CAUSALITY' | 'PARADOX' | 'METRICS';
  description: string;
  formalAxiom: string;
  isMutable: boolean;
  stabilityIndex: number; // 0 to 1
}

export interface RealityEntity {
  id: string;
  name: string;
  substrate: string; // e.g., 'Peano Axiom Node', 'Equation Manifold', 'Proof Vector'
  coordinates: { [axis: string]: number | string }; // Dimensionless relational coords
  properties: { [key: string]: string | number | boolean };
  density: number; // Computational density relative to surroundings
  status: 'STABLE' | 'PROPAGATING' | 'PARADOXICAL' | 'COLLAPSED';
}

export interface RealityAnomaly {
  id: string;
  title: string;
  type: 'UNRESOLVED_CONJECTURE' | 'LOGICAL_SINGULARITY' | 'DIMENSIONAL_FOLD' | 'PARADOX_CASCADE';
  severity: 'SUBTLE' | 'MODERATE' | 'CRITICAL';
  description: string;
}

export interface RealitySnapshot {
  version: string;
  timestamp: string;
  stepCount: number;
  decreeSummary: string;
  status: RealityStatus;
  entityCount: number;
  lawCount: number;
  lawsSnapshot: RealityLaw[];
  entitiesSnapshot: RealityEntity[];
}

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  phase: 'PERCEPTION' | 'REASONING' | 'ACTION' | 'COMMIT';
  content: string;
  mcpToolUsed?: string;
}

export interface ConnectedAgent {
  id: string;
  name: string;
  role: AgentRole;
  targetRealityId: string;
  autonomousMode: boolean;
  model: string;
  personality: string;
  reasoningCycles: number;
  latestThought: string;
  latestAction: string;
  log: AgentLogEntry[];
  connectedAt: string;
}

export interface Reality {
  id: string;
  name: string;
  designation: string;
  blueprint: string; // Natural language functional description
  stratum: KnowledgeStratum;
  dimensionality: string;
  unitsFramework: 'DIMENSIONLESS_RELATIONAL' | 'NULL';
  status: RealityStatus;
  currentVersion: string;
  stepCount: number;
  entropyRelational: number; // 0 to 1 internal ratio
  expansionRatio: number;
  laws: RealityLaw[];
  entities: RealityEntity[];
  anomalies: RealityAnomaly[];
  history: RealitySnapshot[];
  createdAt: string;
  updatedAt: string;
}

export interface MetaLaw {
  id: string;
  code: string;
  title: string;
  summary: string;
  description: string;
  immutable: boolean;
}

export interface MultiverseState {
  metaLaws: MetaLaw[];
  realities: { [id: string]: Reality };
  activeRealityId: string;
  agents: ConnectedAgent[];
  mcpConnectedClients: number;
  localComputeLoadRatio: number; // asymptotic to 0.000%
  totalExternalWorkDelta: number; // exactly 0.000000000000 Joules
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: { [key: string]: { type: string; description: string; enum?: string[] } };
    required: string[];
  };
}

export interface MCPResourceDefinition {
  uri: string;
  name: string;
  mimeType: string;
  description: string;
}
