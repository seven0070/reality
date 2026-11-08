# NullVoid Sandbox

A sandbox for building virtual realities from a prompt bar. It starts from a null void (R_0). You describe a reality, and it gets its own laws, entities and history. Nothing inside affects the real world.

Built in AI Studio: https://ai.studio/apps/38f9edbf-c629-47d2-955b-ea9a0b4c61f2

## What it does
- N realities (R_0, R_1, ...), each dormant until you activate it
- Laws, entities, anomalies and a version history with rollback
- Realities and history are saved to `data/multiverse-state.json` and survive restarts
- MCP gateway so any AI agent can create and run realities (`/api/mcp/sse`, `/api/mcp/message`, `/api/mcp/config`)
- Tools: create_reality, set_reality_state, step_reality_time, inject_entity, mutate_law, rollback_reality
- Export a reality as JSON (examples in `exports/`)

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` (or `.env`)
3. Optional: set `GEMINI_API_KEY` so Gemini writes the laws for your decrees. Without it the app still runs and uses a simple built-in generator.
4. Optional: set the `VITE_FIREBASE_*` values to turn on Google Drive sign-in and export. Without them everything else works and Drive export is off.
5. `npm run dev`, then open http://localhost:3000

`npm test` runs the engine tests.

## Connect an agent
Point an MCP client at `http://localhost:3000/api/mcp/sse`. The tool list is at `/api/mcp/config`.
