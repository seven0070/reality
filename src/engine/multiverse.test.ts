import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialMultiverseState,
  createRootVoidReality,
  instantiateReality,
  setRealityState,
  stepRealityTime,
  mutateLaw,
  injectEntity,
  rollbackReality,
  dispatchMCPToolCall,
} from './multiverse.ts';

test('Initial multiverse starts with R_0 (Void) and R_1 (Axiomatic Continuum)', () => {
  const state = createInitialMultiverseState();
  assert.ok(state.realities['R_0'], 'R_0 must exist');
  assert.ok(state.realities['R_1'], 'R_1 must exist');
  assert.equal(state.realities['R_0'].stratum, 'NULL_VOID');
  assert.equal(state.realities['R_0'].unitsFramework, 'NULL');
  assert.equal(state.totalExternalWorkDelta, 0.0);
});

test('Meta-Law 002: New realities are dormant by default upon instantiation', () => {
  const state = createInitialMultiverseState();
  const { newState, newRealityId } = instantiateReality(state, {
    name: 'Quantum Poetic Weave',
    blueprint: 'A reality where atomic orbitals are governed by lyrical rhymes and meter.',
    stratum: 'ABSTRACT',
  });

  const created = newState.realities[newRealityId];
  assert.ok(created, 'Newly instantiated reality must exist');
  assert.equal(created.status, 'DORMANT', 'Reality must be DORMANT upon creation');
  assert.equal(created.currentVersion, 'v1.0');
  assert.equal(created.stepCount, 0);
  assert.equal(created.unitsFramework, 'DIMENSIONLESS_RELATIONAL');
  assert.equal(created.history.length, 1);
});

test('State transitions update version, status, and append to history ledger', () => {
  const state = createInitialMultiverseState();
  assert.equal(state.realities['R_1'].status, 'DORMANT');

  const activatedState = setRealityState(state, 'R_1', 'ACTIVE');
  assert.equal(activatedState.realities['R_1'].status, 'ACTIVE');
  assert.equal(activatedState.realities['R_1'].currentVersion, 'v1.1');
  assert.equal(activatedState.realities['R_1'].history.length, 2);

  const frozenState = setRealityState(activatedState, 'R_1', 'DORMANT');
  assert.equal(frozenState.realities['R_1'].status, 'DORMANT');
  assert.equal(frozenState.realities['R_1'].currentVersion, 'v1.2');
  assert.equal(frozenState.realities['R_1'].history.length, 3);
});

test('Time step advances internal relational metrics without leaking work', () => {
  const state = createInitialMultiverseState();
  const stepped = stepRealityTime(state, 'R_1', 5);
  const r1 = stepped.realities['R_1'];

  assert.equal(r1.stepCount, 5);
  assert.ok(r1.expansionRatio > 1.0, 'Expansion ratio should advance with steps');
  assert.equal(stepped.totalExternalWorkDelta, 0.0, 'External work delta must remain exactly zero');
});

test('Law mutation creates version snapshot and allows paradox injection', () => {
  const state = createInitialMultiverseState();
  const mutatedState = mutateLaw(state, 'R_1', {
    name: 'Paradox of True-False Superposition',
    category: 'PARADOX',
    description: 'Every statement P is simultaneously True and False until observed by an external observer.',
    formalAxiom: 'P ∧ ¬P ≡ 1',
  });

  const r1 = mutatedState.realities['R_1'];
  assert.equal(r1.currentVersion, 'v1.1');
  const found = r1.laws.find(l => l.name === 'Paradox of True-False Superposition');
  assert.ok(found, 'Mutated law must be recorded');
  assert.equal(found.category, 'PARADOX');
});

test('Entity injection and rollback restores earlier version snapshot', () => {
  const state = createInitialMultiverseState();
  const initialEntitiesCount = state.realities['R_1'].entities.length;

  const withEntity = injectEntity(state, 'R_1', {
    name: 'Euler Identity Monolith',
    substrate: 'Complex Exponentiation Locus',
    density: 2.718,
    coordinates: { x: 3, y: 1, z: 0 },
    properties: { formula: 'e^(i*pi) + 1 = 0' }
  });

  assert.equal(withEntity.realities['R_1'].entities.length, initialEntitiesCount + 1);
  assert.equal(withEntity.realities['R_1'].currentVersion, 'v1.1');

  // Rollback to v1.0
  const rolledBack = rollbackReality(withEntity, 'R_1', 'v1.0');
  assert.equal(rolledBack.realities['R_1'].entities.length, initialEntitiesCount, 'Entities count should revert to snapshot');
  assert.equal(rolledBack.realities['R_1'].currentVersion, 'v1.2', 'Rollback is recorded as a new immutable version');
});

test('MCP Tool dispatch handles create_reality, set_state, and step_time', () => {
  const state = createInitialMultiverseState();

  // Test create_reality tool call
  const { state: stateAfterCreate, result: createResult } = dispatchMCPToolCall(state, 'create_reality', {
    name: 'Non-Euclidean Hyperbolic Biome',
    blueprint: 'Triangles have interior angles less than 180 degrees. Flora grow exponentially outward.',
    stratum: 'ABSTRACT'
  });
  assert.equal(createResult.success, true);
  const createdId = createResult.realityId;
  assert.ok(stateAfterCreate.realities[createdId]);

  // Test set_reality_state tool call
  const { state: stateAfterActive, result: activeResult } = dispatchMCPToolCall(stateAfterCreate, 'set_reality_state', {
    realityId: createdId,
    state: 'ACTIVE'
  });
  assert.equal(activeResult.success, true);
  assert.equal(stateAfterActive.realities[createdId].status, 'ACTIVE');

  // Test step_reality_time tool call
  const { state: stateAfterStep, result: stepResult } = dispatchMCPToolCall(stateAfterActive, 'step_reality_time', {
    realityId: createdId,
    steps: 3
  });
  assert.equal(stepResult.success, true);
  assert.equal(stateAfterStep.realities[createdId].stepCount, 3);
});
