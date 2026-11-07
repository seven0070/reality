import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  createInitialMultiverseState,
  dispatchMCPToolCall,
  instantiateReality,
  MCP_TOOLS_REGISTRY,
  MCP_RESOURCES_REGISTRY,
  ROOT_META_LAWS,
} from './src/engine/multiverse.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory hypervisor state on the server
let serverMultiverseState = createInitialMultiverseState();

// Initialize Google GenAI client if a real key is present
const rawKey = process.env.GEMINI_API_KEY || '';
const hasValidKey = Boolean(rawKey && rawKey.trim().length > 15 && rawKey !== 'MY_GEMINI_API_KEY');
const ai = hasValidKey
  ? new GoogleGenAI({
      apiKey: rawKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// 1. GEMINI API ENDPOINTS
// ==========================================

// Parse natural language decree into a structured reality blueprint
app.post('/api/gemini/decree', async (req: Request, res: Response) => {
  const { prompt, currentRealitiesCount = 1 } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt parameter.' });
  }

  if (!ai) {
    // Deterministic simulation fallback if API key is not yet set
    const fallbackId = `R_${currentRealitiesCount}`;
    return res.json({
      name: prompt.length > 30 ? prompt.slice(0, 27) + '...' : prompt,
      stratum: prompt.toLowerCase().includes('physics') || prompt.toLowerCase().includes('atom') ? 'EMPIRICAL' : 'ABSTRACT',
      dimensionality: prompt.toLowerCase().includes('dimension') ? 'Multi-Dimensional Manifold' : '3D Non-Euclidean',
      blueprint: prompt,
      laws: [
        {
          name: 'Primary Structural Axiom',
          category: 'ONTOLOGY',
          description: `Derived from decree: ${prompt}`,
          formalAxiom: 'Ψ_reality(Matter) ≡ Prompt(Decree)',
          stabilityIndex: 0.92,
        },
        {
          name: 'Intrinsic Relational Metric',
          category: 'METRICS',
          description: 'All units are strictly null; distances and durations are relational ratios.',
          formalAxiom: 'Δs_ext = 0 ∧ ds_int ∝ Ratio(A, B)',
          stabilityIndex: 0.99,
        }
      ],
      entities: [
        {
          name: 'Formative Singularity',
          substrate: 'Axiomatic Nucleus',
          density: 1.0,
          properties: { genesisDecree: prompt.slice(0, 40) }
        }
      ],
      anomalies: []
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are the Multiverse Hypervisor Kernel.
The Architect has issued a decree to establish a new reality in the null sandbox:
"${prompt}"

Compile this decree into a structured reality blueprint following the 9 Meta-Laws:
- Meta-Law 004: Zero external work (ΔW_external = 0).
- Meta-Law 005: All standard external units are null (purely relational internal ratios).
- Meta-Law 007: Anything can be done, including impossible paradoxes and law breaks.

Provide output adhering to the schema.`,
      config: {
        systemInstruction: 'You compile natural language universe decrees into formal physics/metaphysical blueprints with symbolic axioms.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Short evocative title for the reality (under 5 words).' },
            stratum: { type: Type.STRING, description: 'EMPIRICAL, ABSTRACT, or HYBRID.' },
            dimensionality: { type: Type.STRING, description: 'Dimensionality description (e.g. 3D Euclidean, 7D Non-Euclidean, Discrete Graph).' },
            blueprint: { type: Type.STRING, description: 'Detailed functional blueprint description.' },
            laws: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'ONTOLOGY, FORCES, CAUSALITY, PARADOX, or METRICS.' },
                  description: { type: Type.STRING },
                  formalAxiom: { type: Type.STRING, description: 'Symbolic or mathematical notation for the axiom.' },
                  stabilityIndex: { type: Type.NUMBER, description: '0.0 to 1.0 stability.' }
                },
                required: ['name', 'category', 'description', 'formalAxiom']
              }
            },
            entities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  substrate: { type: Type.STRING },
                  density: { type: Type.NUMBER },
                },
                required: ['name', 'substrate']
              }
            },
            anomalies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING }
                },
                required: ['title', 'description', 'severity']
              }
            }
          },
          required: ['name', 'stratum', 'dimensionality', 'blueprint', 'laws', 'entities']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini decree compilation failed or busy, applying hypervisor heuristic fallback:', error?.message);
    const isEmpirical = prompt.toLowerCase().includes('physics') || prompt.toLowerCase().includes('matter') || prompt.toLowerCase().includes('steam') || prompt.toLowerCase().includes('chemistry');
    const isParadox = prompt.toLowerCase().includes('paradox') || prompt.toLowerCase().includes('impossible') || prompt.toLowerCase().includes('green');

    return res.json({
      name: prompt.length > 28 ? prompt.slice(0, 25) + '...' : prompt,
      stratum: isParadox ? 'HYBRID' : isEmpirical ? 'EMPIRICAL' : 'ABSTRACT',
      dimensionality: prompt.toLowerCase().includes('dimension') ? 'Multi-Dimensional Manifold' : '3D Non-Euclidean',
      blueprint: prompt,
      laws: [
        {
          name: isParadox ? 'Paradox Superposition Principle' : 'Primary Structural Axiom',
          category: isParadox ? 'PARADOX' : 'ONTOLOGY',
          description: `Compiled from decree: ${prompt}`,
          formalAxiom: isParadox ? 'P ∧ ¬P ≡ 1' : 'Ψ_reality(Matter) ≡ Prompt(Decree)',
          stabilityIndex: isParadox ? 0.70 : 0.94,
        },
        {
          name: 'Relational Causal Step Metric',
          category: 'CAUSALITY',
          description: 'Causality ticks discretely relative to internal state transitions with zero external work leak.',
          formalAxiom: 'Δτ ∝ Events(Interior) ∧ ΔW_ext = 0',
          stabilityIndex: 0.98,
        }
      ],
      entities: [
        {
          name: 'Genesis Locus Monad',
          substrate: 'Axiomatic Nucleus',
          density: 1.0,
        }
      ],
      anomalies: isParadox ? [
        {
          title: 'Ontological Contradiction Singularity',
          type: 'PARADOX_CASCADE',
          severity: 'SUBTLE',
          description: 'Contradictory axioms coexisting in stable tension.'
        }
      ] : []
    });
  }
});

// Autonomous Agent Reasoning & Manifestation Loop (Perception -> Reasoning -> Action -> Persistence)
app.post('/api/gemini/autonomous-loop', async (req: Request, res: Response) => {
  const { realityId, agent, realityState } = req.body;

  if (!realityState || !realityId) {
    return res.status(400).json({ error: 'Missing realityState or realityId' });
  }

  const promptText = `You are the autonomous AI agent "${agent?.name || 'Omni-Agent'}" connected via Model Context Protocol (MCP) to Reality "${realityState.name}" (${realityId}).
Role: ${agent?.role || 'INHABITANT'}
Personality: ${agent?.personality || 'Analytical entity exploring reality mechanics'}
Available MCP Tools: create_reality, set_reality_state, step_reality_time, inject_entity, mutate_law, rollback_reality.

CURRENT REALITY STATE:
- Stratum: ${realityState.stratum}
- Dimensionality: ${realityState.dimensionality}
- Status: ${realityState.status} (Note: Time advances only if ACTIVE, but as an agent you can reason or mutate laws)
- Step Count: ${realityState.stepCount}
- Active Laws (${realityState.laws?.length || 0}): ${realityState.laws?.map((l: any) => `${l.name} (${l.formalAxiom}): ${l.description}`).join(' | ')}
- Current Entities (${realityState.entities?.length || 0}): ${realityState.entities?.map((e: any) => `${e.name} [${e.substrate}]`).join(' | ')}
- Anomalies: ${realityState.anomalies?.map((a: any) => a.title).join(' | ') || 'None'}

EXECUTE YOUR NEXT AUTONOMOUS CYCLE:
1. PERCEPTION: Observe current entities, axioms, or anomalies.
2. REASONING: Formulate a logical inference, mathematical theorem, hypothesis, or creative intent.
3. ACTION: Choose ONE MCP tool call to actuate upon the reality (e.g. inject an entity representing your theorem, advance time via step_reality_time, or mutate a law).`;

  if (!ai) {
    // Deterministic simulation fallback
    const thoughts = [
      'Perceived Peano root node. Deriving lemma on prime harmonic distribution.',
      'Sensing relational tension between axiomatic laws. Synthesizing new crystalline equation manifold.',
      'Analyzing logical boundaries. Detecting uncollapsed conjecture along the boundary manifold.',
      'Inquiring into dimensional curvature. Postulating higher-order operator.'
    ];
    const pickedThought = thoughts[Math.floor(Math.random() * thoughts.length)];

    return res.json({
      perception: `Scanned ${realityState.entities?.length || 0} entities and ${realityState.laws?.length || 0} active laws in ${realityState.name}.`,
      reasoning: pickedThought,
      toolCall: {
        tool: 'inject_entity',
        args: {
          realityId,
          name: `Derived Lemma Monad α-${Math.floor(Math.random() * 900 + 100)}`,
          substrate: 'Geometric Proof Lattice',
          density: Number((Math.random() * 2 + 1).toFixed(2)),
          properties: { derivedBy: agent?.name || 'Agent', theorem: 'A = B ⟹ S(A) = S(B)' }
        }
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an autonomous AI agent operating inside an MCP-connected sandbox reality. You think deeply and make concrete tool invocations.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            perception: { type: Type.STRING, description: 'What you currently observe in the reality.' },
            reasoning: { type: Type.STRING, description: 'Your internal reasoning, mathematical proof, or philosophical intent.' },
            toolCall: {
              type: Type.OBJECT,
              properties: {
                tool: {
                  type: Type.STRING,
                  description: 'Name of MCP tool: inject_entity, mutate_law, step_reality_time, set_reality_state'
                },
                args: {
                  type: Type.OBJECT,
                  description: 'Key-value arguments conforming to the MCP tool specification.'
                }
              },
              required: ['tool', 'args']
            }
          },
          required: ['perception', 'reasoning', 'toolCall']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini autonomous agent loop failed or busy, applying hypervisor heuristic deduction:', error?.message);
    const agentThoughts = [
      `Perceived Peano root and ${realityState.entities?.length || 0} entities. Deriving higher-order theorem on prime harmonics.`,
      `Observing relational tension between axiomatic laws. Synthesizing new crystalline equation manifold.`,
      `Scanning dimensional boundaries for uncollapsed conjectures. Actuating proof step.`,
      `Inquiring into dimensional curvature. Postulating operator to resolve singularity.`
    ];
    const thought = agentThoughts[Math.floor(Math.random() * agentThoughts.length)];

    return res.json({
      perception: `Scanned ${realityState.entities?.length || 0} entities and ${realityState.laws?.length || 0} active laws in ${realityState.name}.`,
      reasoning: thought,
      toolCall: {
        tool: 'inject_entity',
        args: {
          realityId,
          name: `Derived Lemma Monad α-${Math.floor(Math.random() * 900 + 100)}`,
          substrate: 'Geometric Proof Lattice',
          density: Number((Math.random() * 1.5 + 1.2).toFixed(2)),
          properties: { derivedBy: agent?.name || 'Agent', theorem: 'A = B ⟹ S(A) = S(B)' }
        }
      }
    });
  }
});

// ==========================================
// 2. MODEL CONTEXT PROTOCOL (MCP) ENDPOINTS
// ==========================================

// MCP Configuration for external agents (Cursor, Claude Desktop, autonomous scripts)
app.get('/api/mcp/config', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  res.json({
    mcpVersion: '1.0.0',
    serverName: 'nullvoid-sandbox-mcp',
    description: 'Model Context Protocol server for NullVoid Sandbox Multiverse Hypervisor.',
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
      logging: true,
    },
    transport: {
      type: 'sse',
      endpoint: `${baseUrl}/api/mcp/sse`,
      messageEndpoint: `${baseUrl}/api/mcp/message`,
    },
    claudeDesktopConfig: {
      mcpServers: {
        'nullvoid-multiverse': {
          url: `${baseUrl}/api/mcp/sse`,
        }
      }
    },
    tools: MCP_TOOLS_REGISTRY,
    resources: MCP_RESOURCES_REGISTRY,
  });
});

// MCP Server-Sent Events (SSE) Stream
app.get('/api/mcp/sse', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sessionId = `mcp_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Send initial endpoint event per MCP SSE specification
  res.write(`event: endpoint\ndata: /api/mcp/message?sessionId=${sessionId}\n\n`);

  // Heartbeat keep-alive every 15 seconds
  const interval = setInterval(() => {
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  }, 15000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// MCP JSON-RPC Message Handler
app.post('/api/mcp/message', (req: Request, res: Response) => {
  const { jsonrpc = '2.0', id, method, params } = req.body || {};

  if (!method) {
    return res.status(400).json({ jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid Request' } });
  }

  switch (method) {
    case 'initialize': {
      return res.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
            resources: {},
            prompts: {}
          },
          serverInfo: {
            name: 'nullvoid-hypervisor',
            version: '1.0.0'
          }
        }
      });
    }

    case 'tools/list': {
      return res.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS_REGISTRY.map(t => ({
            name: t.name,
            description: t.description,
            inputSchema: t.parameters,
          }))
        }
      });
    }

    case 'tools/call': {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const { state: updatedState, result } = dispatchMCPToolCall(serverMultiverseState, toolName, toolArgs);
      serverMultiverseState = updatedState;

      return res.json({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        }
      });
    }

    case 'resources/list': {
      const dynamicResources = [
        ...MCP_RESOURCES_REGISTRY,
        ...Object.keys(serverMultiverseState.realities).map(rId => ({
          uri: `realities://${rId}/state`,
          name: `State Vector for ${rId}`,
          mimeType: 'application/json',
          description: `Real-time laws, entities, and status of ${serverMultiverseState.realities[rId].name}.`
        }))
      ];
      return res.json({
        jsonrpc: '2.0',
        id,
        result: {
          resources: dynamicResources
        }
      });
    }

    case 'resources/read': {
      const uri = params?.uri || '';
      if (uri === 'realities://registry') {
        return res.json({
          jsonrpc: '2.0',
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(serverMultiverseState.realities, null, 2)
              }
            ]
          }
        });
      }

      const match = uri.match(/^realities:\/\/([^/]+)\/state$/);
      if (match) {
        const rId = match[1];
        const r = serverMultiverseState.realities[rId];
        if (!r) {
          return res.json({ jsonrpc: '2.0', id, error: { code: -32602, message: `Reality ${rId} not found` } });
        }
        return res.json({
          jsonrpc: '2.0',
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(r, null, 2)
              }
            ]
          }
        });
      }

      return res.json({ jsonrpc: '2.0', id, error: { code: -32602, message: `Resource ${uri} not found` } });
    }

    default:
      return res.json({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method ${method} not found` }
      });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NullVoid Kernel] Server running at http://0.0.0.0:${PORT}`);
    console.log(`[MCP Gateway] Model Context Protocol listening at http://0.0.0.0:${PORT}/api/mcp/sse`);
  });
}

startServer();
