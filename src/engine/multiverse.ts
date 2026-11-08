import {
  MultiverseState,
  Reality,
  MetaLaw,
  RealityLaw,
  RealityEntity,
  RealityAnomaly,
  RealitySnapshot,
  ConnectedAgent,
  AgentRole,
  AgentLogEntry,
  MCPToolDefinition,
  MCPResourceDefinition
} from '../types/multiverse.ts';

export const ROOT_META_LAWS: MetaLaw[] = [
  {
    id: 'META_001',
    code: '001',
    title: 'Multiverse Architecture',
    summary: 'N-Realities coexist independently (R_0 to R_n).',
    description: 'The primordial void persists as R_0. N discrete realities can be spawned, branched, or merged with independent axioms without cross-leakage.',
    immutable: true,
  },
  {
    id: 'META_002',
    code: '002',
    title: 'Persistence & Dormancy',
    summary: 'Immutable history logs; frozen until manually activated.',
    description: 'Realities are instantiated in a dormant state by default. State transitions, law edits, and entities are committed chronologically to a rollback-capable ledger.',
    immutable: true,
  },
  {
    id: 'META_003',
    code: '003',
    title: 'Omni-Epistemic Synthesis',
    summary: 'Real-world science and abstract metaphysics fuse freely.',
    description: 'Knowledge bases span empirical natural science, pure mathematics, symbolic logic, metaphysics, and hybrid conceptual systems.',
    immutable: true,
  },
  {
    id: 'META_004',
    code: '004',
    title: 'Hermetic Containment',
    summary: 'ΔW_external = 0 (Absolute containment from the real world).',
    description: 'All work, thermodynamic flux, causality, or ontological collapses produced inside sandbox realities exert zero physical consequence on the outside universe.',
    immutable: true,
  },
  {
    id: 'META_005',
    code: '005',
    title: 'Unit-Nullity Axiom',
    summary: 'Standard physical units are void; relational metrics only.',
    description: 'Meters, kilograms, seconds, and external units do not exist. All coordinates, durations, masses, and energies exist purely as internal dimensionless ratios (A : B).',
    immutable: true,
  },
  {
    id: 'META_006',
    code: '006',
    title: 'Host Decoupling Protocol',
    summary: 'Near-zero compute and energy drain on host device.',
    description: 'The local device operates as a lightweight Architect console. Realities execute in virtualized hypervisor space without burdening local CPU, GPU, or battery.',
    immutable: true,
  },
  {
    id: 'META_007',
    code: '007',
    title: 'Unbounded Sovereignty',
    summary: 'Total omnipotence to create, break, and rewrite within realities.',
    description: 'Any rule can be broken, inverted, or synthesized. Contradictions and paradoxes compile natively as existential mechanics without crashing the hypervisor.',
    immutable: true,
  },
  {
    id: 'META_008',
    code: '008',
    title: 'Model Context Protocol (MCP) Gateway',
    summary: 'Connect any external or internal AI agent via standardized MCP.',
    description: 'Exposes realities:// resources, manipulation tools, and blueprint prompts so any model can inhabit, inspect, or build worlds.',
    immutable: true,
  },
  {
    id: 'META_009',
    code: '009',
    title: 'Autonomous Agent Reliance',
    summary: 'Realities run autonomously, powered by the agent\'s own mind.',
    description: 'Zero micromanagement required. AI agents plugged into a reality observe states, reason intentions, and actuate steps in a self-sustaining causal loop.',
    immutable: true,
  },
];

export const MCP_TOOLS_REGISTRY: MCPToolDefinition[] = [
  {
    name: 'create_reality',
    description: 'Instantiate a brand-new reality container from a natural language functional blueprint.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Descriptive title for the reality.' },
        blueprint: { type: 'string', description: 'Functional specification of axioms, matter, and causal laws.' },
        stratum: { type: 'string', description: 'Knowledge stratum: EMPIRICAL, ABSTRACT, or HYBRID.', enum: ['EMPIRICAL', 'ABSTRACT', 'HYBRID'] },
        dimensionality: { type: 'string', description: 'Spatial/ontological topology (e.g., 3D Euclidean, 2D Graph, 7D Non-Euclidean).' }
      },
      required: ['name', 'blueprint']
    }
  },
  {
    name: 'set_reality_state',
    description: 'Toggle the execution state of a reality between DORMANT (frozen causality) and ACTIVE (unfrozen time).',
    parameters: {
      type: 'object',
      properties: {
        realityId: { type: 'string', description: 'Target reality ID (e.g. R_1).' },
        state: { type: 'string', description: 'Target state.', enum: ['DORMANT', 'ACTIVE', 'ARCHIVED'] }
      },
      required: ['realityId', 'state']
    }
  },
  {
    name: 'step_reality_time',
    description: 'Advance causality and logical deduction in a reality by a specified number of relational steps.',
    parameters: {
      type: 'object',
      properties: {
        realityId: { type: 'string', description: 'Target reality ID.' },
        steps: { type: 'number', description: 'Number of relational causal ticks to advance.' }
      },
      required: ['realityId']
    }
  },
  {
    name: 'inject_entity',
    description: 'Materialize an entity, object, equation manifold, or consciousness into a reality.',
    parameters: {
      type: 'object',
      properties: {
        realityId: { type: 'string', description: 'Target reality ID.' },
        name: { type: 'string', description: 'Entity designation.' },
        substrate: { type: 'string', description: 'Substrate (e.g., Peano Node, Crystalline Proof, Quantum Quirk).' },
        density: { type: 'number', description: 'Relative computational density.' },
        properties: { type: 'object', description: 'Key-value map of relational attributes.' }
      },
      required: ['realityId', 'name', 'substrate']
    }
  },
  {
    name: 'mutate_law',
    description: 'Alter, invert, or rewrite an existing reality law, or establish a brand-new paradox.',
    parameters: {
      type: 'object',
      properties: {
        realityId: { type: 'string', description: 'Target reality ID.' },
        lawName: { type: 'string', description: 'Name of the law to mutate or create.' },
        description: { type: 'string', description: 'Natural language rule description.' },
        formalAxiom: { type: 'string', description: 'Symbolic or mathematical formulation.' },
        category: { type: 'string', description: 'Law category.', enum: ['ONTOLOGY', 'FORCES', 'CAUSALITY', 'PARADOX', 'METRICS'] }
      },
      required: ['realityId', 'lawName', 'description']
    }
  },
  {
    name: 'rollback_reality',
    description: 'Rollback a reality state to an earlier recorded commit version in its immutable history log.',
    parameters: {
      type: 'object',
      properties: {
        realityId: { type: 'string', description: 'Target reality ID.' },
        targetVersion: { type: 'string', description: 'Version string (e.g. v1.0).' }
      },
      required: ['realityId', 'targetVersion']
    }
  }
];

export const MCP_RESOURCES_REGISTRY: MCPResourceDefinition[] = [
  {
    uri: 'realities://registry',
    name: 'Multiverse Registry',
    mimeType: 'application/json',
    description: 'Summary of all instantiated realities, their status, and dimensional topologies.'
  },
  {
    uri: 'realities://{id}/state',
    name: 'Reality State Vector',
    mimeType: 'application/json',
    description: 'Current real-time state, laws, entities, anomalies, and relational ratios of a specific reality.'
  },
  {
    uri: 'realities://{id}/history',
    name: 'Reality History Ledger',
    mimeType: 'application/json',
    description: 'Complete chronological snapshot version log of decrees and evolutionary steps.'
  }
];

export function createInitialSnapshot(reality: Omit<Reality, 'history'>, decreeSummary: string): RealitySnapshot {
  return {
    version: reality.currentVersion,
    timestamp: new Date().toISOString(),
    stepCount: reality.stepCount,
    decreeSummary,
    status: reality.status,
    entityCount: reality.entities.length,
    lawCount: reality.laws.length,
    lawsSnapshot: JSON.parse(JSON.stringify(reality.laws)),
    entitiesSnapshot: JSON.parse(JSON.stringify(reality.entities)),
  };
}

export function createRootVoidReality(): Reality {
  const r0Base: Omit<Reality, 'history'> = {
    id: 'R_0',
    name: 'The Primordial Void',
    designation: 'BASE_ZERO',
    blueprint: 'Absolute null. Zero dimensions, zero matter, zero forces, frozen temporal axis. Pure mathematical zero baseline.',
    stratum: 'NULL_VOID',
    dimensionality: '0D (Undefined)',
    unitsFramework: 'NULL',
    status: 'DORMANT',
    currentVersion: 'v0.0',
    stepCount: 0,
    entropyRelational: 0.0,
    expansionRatio: 0.0,
    laws: [
      {
        id: 'L0_VOID',
        name: 'The Null Principle',
        category: 'ONTOLOGY',
        description: 'No matter, time, or light may exist without explicit decree from the Architect.',
        formalAxiom: '∀x (x ∉ R_0)',
        isMutable: false,
        stabilityIndex: 1.0,
      }
    ],
    entities: [],
    anomalies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    ...r0Base,
    history: [createInitialSnapshot(r0Base, 'Genesis: Primordial Null baseline initialized.')]
  };
}

export function createMathAxiomaticReality(): Reality {
  const r1Base: Omit<Reality, 'history'> = {
    id: 'R_1',
    name: 'The Axiomatic Continuum',
    designation: 'MATH_CORE_01',
    blueprint: 'A universe where mathematical knowledge is the literal physical and material substrate. Axioms act as elementary particles. Logical derivations constitute the flow of time and causality. Proving new theorems expands the universe and unrolls higher dimensions.',
    stratum: 'ABSTRACT',
    dimensionality: 'Discrete Lattice Graph',
    unitsFramework: 'DIMENSIONLESS_RELATIONAL',
    status: 'DORMANT', // Meta-Law 002: Dormant by default until manually activated!
    currentVersion: 'v1.0',
    stepCount: 0,
    entropyRelational: 0.08,
    expansionRatio: 1.0,
    laws: [
      {
        id: 'L1_PEANO',
        name: 'Peano Substrate Law',
        category: 'ONTOLOGY',
        description: 'Elementary matter arises from the null set ∅ and successor function S(n).',
        formalAxiom: '0 ∈ ℕ ∧ ∀n(n ∈ ℕ → S(n) ∈ ℕ)',
        isMutable: true,
        stabilityIndex: 0.99,
      },
      {
        id: 'L1_CAUSALITY',
        name: 'Deductive Temporal Tick',
        category: 'CAUSALITY',
        description: 'One temporal step corresponds exactly to one valid formal logical inference step.',
        formalAxiom: 'Δt = 1 ⟺ Premise ⊢ Conclusion',
        isMutable: true,
        stabilityIndex: 0.95,
      },
      {
        id: 'L1_GRAVITY',
        name: 'Equivalence Attraction',
        category: 'FORCES',
        description: 'Identical expressions exert mutual topological pull, collapsing toward unification.',
        formalAxiom: 'F_attract(A, B) ∝ Sim(A, B) / dist(A, B)',
        isMutable: true,
        stabilityIndex: 0.88,
      },
      {
        id: 'L1_SINGULARITY',
        name: 'Division by Zero Nullification',
        category: 'PARADOX',
        description: 'Zero division creates an ontological black hole erasing local manifold coordinates.',
        formalAxiom: 'lim_{x→0} f(x)/x ⟹ Singularity',
        isMutable: true,
        stabilityIndex: 0.75,
      }
    ],
    entities: [
      {
        id: 'ENT_001',
        name: 'Peano Genesis Node',
        substrate: 'Peano Axiom Root (0)',
        coordinates: { x: 0, y: 0, z: 0 },
        density: 1.0,
        properties: { formalVal: '∅', stability: 'PERFECT', type: 'AXIOM_ROOT' },
        status: 'STABLE'
      },
      {
        id: 'ENT_002',
        name: 'Successor Manifold Alpha',
        substrate: 'First Successor Ring S(0)',
        coordinates: { x: 1.2, y: 0.8, z: 0 },
        density: 1.41,
        properties: { formalVal: '{∅}', expansionDirection: '+Z' },
        status: 'PROPAGATING'
      },
      {
        id: 'ENT_003',
        name: 'Fermat Ridge Formation',
        substrate: 'Diophantine Geometry Locus',
        coordinates: { x: -2.1, y: 1.5, z: 0.9 },
        density: 3.14,
        properties: { equation: 'x^n + y^n = z^n (n>2)', status: 'PROVEN' },
        status: 'STABLE'
      }
    ],
    anomalies: [
      {
        id: 'ANOM_001',
        title: 'The Riemann Horizon Anomaly',
        type: 'UNRESOLVED_CONJECTURE',
        severity: 'MODERATE',
        description: 'An impenetrable dimensional boundary along the critical line Re(s) = 1/2 waiting for formal resolution.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    ...r1Base,
    history: [createInitialSnapshot(r1Base, 'Genesis decree: Instantiation of Axiomatic Continuum (R_1). Dormant by default.')]
  };
}

export function createInitialMultiverseState(): MultiverseState {
  const r0 = createRootVoidReality();
  const r1 = createMathAxiomaticReality();

  const defaultAgent: ConnectedAgent = {
    id: 'AGENT_AXIOM_01',
    name: 'Euclid-Noesis (Axiomatic Inhabitant)',
    role: 'INHABITANT',
    targetRealityId: 'R_1',
    autonomousMode: false,
    model: 'gemini-3.8-flash',
    personality: 'Rigorous mathematical philosopher seeking geometric proofs and harmony within axiomatic space.',
    reasoningCycles: 0,
    latestThought: 'Awaiting connection signal via Model Context Protocol gateway. Senses the Peano root at coordinate zero.',
    latestAction: 'Idle in dormant vacuum.',
    connectedAt: new Date().toISOString(),
    log: [
      {
        id: 'LOG_INIT',
        timestamp: new Date().toISOString(),
        phase: 'PERCEPTION',
        content: 'MCP link handshake established with R_1. Senses 3 axiomatic entities and 4 immutable laws.',
      }
    ]
  };

  return {
    metaLaws: ROOT_META_LAWS,
    realities: {
      'R_0': r0,
      'R_1': r1,
    },
    activeRealityId: 'R_1',
    agents: [defaultAgent],
    mcpConnectedClients: 1,
    localComputeLoadRatio: 0.0001, // Near nil per Meta-Law 006
    totalExternalWorkDelta: 0.0, // Exactly 0 per Meta-Law 004
  };
}

export function instantiateReality(
  state: MultiverseState,
  params: {
    name: string;
    blueprint: string;
    stratum?: 'EMPIRICAL' | 'ABSTRACT' | 'HYBRID';
    dimensionality?: string;
  }
): { newState: MultiverseState; newRealityId: string } {
  const count = Object.keys(state.realities).length;
  const newId = `R_${count}`;

  const stratum = params.stratum || 'HYBRID';
  const dimensionality = params.dimensionality || '3D Non-Euclidean';

  // Seed default laws derived from blueprint description
  const defaultLaws: RealityLaw[] = [
    {
      id: `${newId}_LAW_BASE`,
      name: 'Substrate Manifestation Law',
      category: 'ONTOLOGY',
      description: `Governed by prompt specification: "${params.blueprint.slice(0, 80)}..."`,
      formalAxiom: 'Ψ(Matter) ≡ Blueprint(Prompt)',
      isMutable: true,
      stabilityIndex: 0.90,
    },
    {
      id: `${newId}_LAW_CAUSAL`,
      name: 'Intrinsic Progression Law',
      category: 'CAUSALITY',
      description: 'Causality advances relative to internal event interactions.',
      formalAxiom: 'Δτ ∝ Events(Interior)',
      isMutable: true,
      stabilityIndex: 0.85,
    }
  ];

  const initialEntity: RealityEntity = {
    id: `${newId}_E01`,
    name: 'Genesis Locus Node',
    substrate: 'Formative Substrate Core',
    coordinates: { x: 0, y: 0, z: 0 },
    density: 1.0,
    properties: { genesisDecree: params.blueprint.slice(0, 50) },
    status: 'PROPAGATING'
  };

  const newRealityBase: Omit<Reality, 'history'> = {
    id: newId,
    name: params.name,
    designation: `${params.name.toUpperCase().replace(/\s+/g, '_')}_01`,
    blueprint: params.blueprint,
    stratum,
    dimensionality,
    unitsFramework: 'DIMENSIONLESS_RELATIONAL', // Meta-Law 005
    status: 'DORMANT', // Meta-Law 002: Dormant by default
    currentVersion: 'v1.0',
    stepCount: 0,
    entropyRelational: 0.05,
    expansionRatio: 1.0,
    laws: defaultLaws,
    entities: [initialEntity],
    anomalies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newReality: Reality = {
    ...newRealityBase,
    history: [createInitialSnapshot(newRealityBase, `Genesis decree: ${params.name} instantiated in dormant state.`)]
  };

  return {
    newState: {
      ...state,
      realities: {
        ...state.realities,
        [newId]: newReality,
      },
      activeRealityId: newId,
    },
    newRealityId: newId
  };
}

export function setRealityState(
  state: MultiverseState,
  realityId: string,
  targetStatus: 'DORMANT' | 'ACTIVE' | 'ARCHIVED'
): MultiverseState {
  const reality = state.realities[realityId];
  if (!reality) return state;

  const updated: Reality = {
    ...reality,
    status: targetStatus,
    updatedAt: new Date().toISOString(),
  };

  const nextVersion = bumpVersion(reality.currentVersion);
  const snapshot: RealitySnapshot = {
    version: nextVersion,
    timestamp: new Date().toISOString(),
    stepCount: updated.stepCount,
    decreeSummary: `State Transition: Reality transitioned to [${targetStatus}].`,
    status: targetStatus,
    entityCount: updated.entities.length,
    lawCount: updated.laws.length,
    lawsSnapshot: JSON.parse(JSON.stringify(updated.laws)),
    entitiesSnapshot: JSON.parse(JSON.stringify(updated.entities)),
  };

  updated.currentVersion = nextVersion;
  updated.history = [snapshot, ...updated.history];

  return {
    ...state,
    realities: {
      ...state.realities,
      [realityId]: updated,
    }
  };
}

export function stepRealityTime(
  state: MultiverseState,
  realityId: string,
  steps: number = 1
): MultiverseState {
  const reality = state.realities[realityId];
  if (!reality) return state;

  // Advance internal relational step metrics
  const newStepCount = reality.stepCount + steps;
  const newEntropy = Math.min(1.0, reality.entropyRelational + steps * 0.005);
  const newExpansion = Number((reality.expansionRatio + steps * 0.08).toFixed(3));

  // Dynamic entity position / propagation updates
  const updatedEntities = reality.entities.map((e, idx) => {
    const rawX = typeof e.coordinates.x === 'number' ? e.coordinates.x : 0;
    const rawY = typeof e.coordinates.y === 'number' ? e.coordinates.y : 0;
    const rawZ = typeof e.coordinates.z === 'number' ? e.coordinates.z : 0;

    const angle = (newStepCount + idx) * 0.2;
    return {
      ...e,
      coordinates: {
        x: Number((rawX + Math.sin(angle) * 0.1).toFixed(3)),
        y: Number((rawY + Math.cos(angle) * 0.1).toFixed(3)),
        z: Number((rawZ + Math.sin(angle * 0.5) * 0.05).toFixed(3)),
      },
      density: Number((e.density + (e.status === 'PROPAGATING' ? 0.02 * steps : 0)).toFixed(3)),
    };
  });

  const updatedReality: Reality = {
    ...reality,
    stepCount: newStepCount,
    entropyRelational: Number(newEntropy.toFixed(3)),
    expansionRatio: newExpansion,
    entities: updatedEntities,
    updatedAt: new Date().toISOString(),
  };

  return {
    ...state,
    realities: {
      ...state.realities,
      [realityId]: updatedReality
    }
  };
}

export function mutateLaw(
  state: MultiverseState,
  realityId: string,
  law: Omit<RealityLaw, 'id' | 'isMutable' | 'stabilityIndex'> & { id?: string }
): MultiverseState {
  const reality = state.realities[realityId];
  if (!reality) return state;

  const existingIdx = reality.laws.findIndex(l => l.name.toLowerCase() === law.name.toLowerCase());
  let newLaws: RealityLaw[];

  if (existingIdx >= 0) {
    newLaws = [...reality.laws];
    newLaws[existingIdx] = {
      ...newLaws[existingIdx],
      description: law.description,
      formalAxiom: law.formalAxiom || newLaws[existingIdx].formalAxiom,
      category: law.category,
      stabilityIndex: Math.max(0.1, Number((newLaws[existingIdx].stabilityIndex - 0.05).toFixed(2))),
    };
  } else {
    const newLawItem: RealityLaw = {
      id: law.id || `${realityId}_LAW_${Date.now()}`,
      name: law.name,
      category: law.category,
      description: law.description,
      formalAxiom: law.formalAxiom || 'Axiom(Decree)',
      isMutable: true,
      stabilityIndex: 0.90,
    };
    newLaws = [...reality.laws, newLawItem];
  }

  const nextVersion = bumpVersion(reality.currentVersion);
  const updatedReality: Reality = {
    ...reality,
    laws: newLaws,
    currentVersion: nextVersion,
    updatedAt: new Date().toISOString(),
  };

  const snapshot: RealitySnapshot = {
    version: nextVersion,
    timestamp: new Date().toISOString(),
    stepCount: updatedReality.stepCount,
    decreeSummary: `Law Mutation: Modified or synthesized law [${law.name}].`,
    status: updatedReality.status,
    entityCount: updatedReality.entities.length,
    lawCount: updatedReality.laws.length,
    lawsSnapshot: JSON.parse(JSON.stringify(updatedReality.laws)),
    entitiesSnapshot: JSON.parse(JSON.stringify(updatedReality.entities)),
  };

  updatedReality.history = [snapshot, ...updatedReality.history];

  return {
    ...state,
    realities: {
      ...state.realities,
      [realityId]: updatedReality
    }
  };
}

export function injectEntity(
  state: MultiverseState,
  realityId: string,
  entity: Omit<RealityEntity, 'id' | 'status'> & { id?: string; status?: RealityEntity['status'] }
): MultiverseState {
  const reality = state.realities[realityId];
  if (!reality) return state;

  const newEntityItem: RealityEntity = {
    id: entity.id || `${realityId}_ENT_${Date.now()}`,
    name: entity.name,
    substrate: entity.substrate,
    coordinates: entity.coordinates || { x: 0, y: 0, z: 0 },
    density: entity.density ?? 1.0,
    properties: entity.properties || {},
    status: entity.status || 'PROPAGATING'
  };

  const nextVersion = bumpVersion(reality.currentVersion);
  const updatedReality: Reality = {
    ...reality,
    entities: [...reality.entities, newEntityItem],
    currentVersion: nextVersion,
    updatedAt: new Date().toISOString(),
  };

  const snapshot: RealitySnapshot = {
    version: nextVersion,
    timestamp: new Date().toISOString(),
    stepCount: updatedReality.stepCount,
    decreeSummary: `Entity Injection: Materialized [${entity.name}] (${entity.substrate}).`,
    status: updatedReality.status,
    entityCount: updatedReality.entities.length,
    lawCount: updatedReality.laws.length,
    lawsSnapshot: JSON.parse(JSON.stringify(updatedReality.laws)),
    entitiesSnapshot: JSON.parse(JSON.stringify(updatedReality.entities)),
  };

  updatedReality.history = [snapshot, ...updatedReality.history];

  return {
    ...state,
    realities: {
      ...state.realities,
      [realityId]: updatedReality
    }
  };
}

export function rollbackReality(
  state: MultiverseState,
  realityId: string,
  targetVersion: string
): MultiverseState {
  const reality = state.realities[realityId];
  if (!reality) return state;

  const snapshot = reality.history.find(h => h.version === targetVersion);
  if (!snapshot) return state;

  const nextVersion = bumpVersion(reality.currentVersion);
  const restoredReality: Reality = {
    ...reality,
    status: snapshot.status,
    stepCount: snapshot.stepCount,
    laws: JSON.parse(JSON.stringify(snapshot.lawsSnapshot)),
    entities: JSON.parse(JSON.stringify(snapshot.entitiesSnapshot)),
    currentVersion: nextVersion,
    updatedAt: new Date().toISOString(),
  };

  const rollbackCommit: RealitySnapshot = {
    version: nextVersion,
    timestamp: new Date().toISOString(),
    stepCount: restoredReality.stepCount,
    decreeSummary: `Rollback: Reality state reverted to snapshot [${targetVersion}].`,
    status: restoredReality.status,
    entityCount: restoredReality.entities.length,
    lawCount: restoredReality.laws.length,
    lawsSnapshot: JSON.parse(JSON.stringify(restoredReality.laws)),
    entitiesSnapshot: JSON.parse(JSON.stringify(restoredReality.entities)),
  };

  restoredReality.history = [rollbackCommit, ...restoredReality.history];

  return {
    ...state,
    realities: {
      ...state.realities,
      [realityId]: restoredReality
    }
  };
}

export function dispatchMCPToolCall(
  state: MultiverseState,
  toolName: string,
  args: Record<string, any>
): { state: MultiverseState; result: any } {
  if (toolName !== 'create_reality') {
    const rid = args.realityId;
    if (typeof rid !== 'string' || !state.realities[rid]) {
      return {
        state,
        result: {
          success: false,
          error: `Unknown reality "${rid}". Known realities: ${Object.keys(state.realities).join(', ')}.`
        }
      };
    }
  }
  switch (toolName) {
    case 'create_reality': {
      if (typeof args.blueprint !== 'string' || !args.blueprint.trim()) {
        return { state, result: { success: false, error: 'create_reality needs a non-empty "blueprint" string.' } };
      }
      const safeName = typeof args.name === 'string' && args.name.trim() ? args.name.trim() : args.blueprint.trim().slice(0, 40);
      const res = instantiateReality(state, {
        name: safeName,
        blueprint: args.blueprint,
        stratum: args.stratum,
        dimensionality: args.dimensionality
      });
      return {
        state: res.newState,
        result: {
          success: true,
          realityId: res.newRealityId,
          status: 'DORMANT',
          message: `Reality ${res.newRealityId} initialized in dormant state. Units set to null. Local load: 0.0W.`
        }
      };
    }
    case 'set_reality_state': {
      const newState = setRealityState(state, args.realityId, args.state);
      return {
        state: newState,
        result: {
          success: true,
          realityId: args.realityId,
          newState: args.state,
          message: `Reality ${args.realityId} state updated to ${args.state}.`
        }
      };
    }
    case 'step_reality_time': {
      const steps = typeof args.steps === 'number' ? args.steps : 1;
      const newState = stepRealityTime(state, args.realityId, steps);
      const reality = newState.realities[args.realityId];
      return {
        state: newState,
        result: {
          success: true,
          realityId: args.realityId,
          stepsAdvanced: steps,
          newStepCount: reality?.stepCount ?? 0,
          expansionRatio: reality?.expansionRatio ?? 1.0,
        }
      };
    }
    case 'inject_entity': {
      const newState = injectEntity(state, args.realityId, {
        name: args.name,
        substrate: args.substrate,
        density: args.density ?? 1.0,
        properties: args.properties ?? {},
        coordinates: { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3, z: 0 }
      });
      return {
        state: newState,
        result: {
          success: true,
          realityId: args.realityId,
          entityName: args.name,
          message: `Entity ${args.name} injected into ${args.realityId}.`
        }
      };
    }
    case 'mutate_law': {
      const newState = mutateLaw(state, args.realityId, {
        name: args.lawName,
        description: args.description,
        formalAxiom: args.formalAxiom || 'Axiom := Mutated',
        category: args.category || 'ONTOLOGY',
      });
      return {
        state: newState,
        result: {
          success: true,
          realityId: args.realityId,
          law: args.lawName,
          message: `Law ${args.lawName} mutated in ${args.realityId}.`
        }
      };
    }
    case 'rollback_reality': {
      const newState = rollbackReality(state, args.realityId, args.targetVersion);
      return {
        state: newState,
        result: {
          success: true,
          realityId: args.realityId,
          targetVersion: args.targetVersion,
          message: `Rolled back to ${args.targetVersion}.`
        }
      };
    }
    default:
      return {
        state,
        result: { success: false, error: `Unknown MCP tool: ${toolName}` }
      };
  }
}

export function bumpVersion(v: string): string {
  const match = v.match(/v(\d+)\.(\d+)/);
  if (!match) return 'v1.1';
  const major = parseInt(match[1], 10);
  const minor = parseInt(match[2], 10) + 1;
  return `v${major}.${minor}`;
}
