# Hermes Workspace Implementation Plan

## Goal
Build a first-party Hermes WebUI that ships a polished single-user MVP quickly, while preserving a path toward team deployments and a richer extension ecosystem.

## Architecture
Use a Next.js frontend backed by a Hermes-specific control plane that sits in front of Hermes runtime surfaces. Start with chat, sessions, permissions, skills, and memory; then add MCP/extensions, artifacts, and team controls.

## Tech Stack
- Frontend: Next.js, TypeScript, Tailwind, shadcn/ui
- State: TanStack Query + Zustand
- Editors: CodeMirror or Monaco
- Backend/control plane: FastAPI or Next.js server routes
- Streaming: SSE
- Runtime: Hermes API server + Hermes local runtime resources

## Workstreams
1. Design system and app shell
2. Chat and sessions
3. Permissions and approvals
4. Skills and memory
5. Extensions and MCP
6. Profiles and settings
7. Mobile polish and quality hardening

## Suggested Milestones

### Milestone 1: Shell and Chat Foundation
Deliver:
- app shell
- auth
- chat transcript
- SSE streaming
- session list
- model switcher

Done when:
- users can start and resume chats reliably

### Milestone 2: Tool Visibility and Safety
Deliver:
- inline tool cards
- approval cards
- tool policy presets
- basic audit events

Done when:
- users can understand tool activity and approve risky actions

### Milestone 3: Skills and Memory
Deliver:
- installed skills UI
- skill inspect/install/edit
- user memory and agent memory editors
- session search
- context inspector

Done when:
- core Hermes-native concepts are manageable without CLI

### Milestone 4: Extensions and MCP
Deliver:
- MCP server add/edit/test flow
- capability-level toggles
- extension health states
- auth/config setup flows

Done when:
- users can configure and safely use extensions visually

### Milestone 5: Profiles and Polish
Deliver:
- profile switcher
- per-profile defaults
- attachments
- voice/TTS
- mobile improvements
- performance hardening

Done when:
- the product is strong enough for self-hosted public alpha

## Suggested File/Repo Structure
If implemented as a new project, use:
- `/src/app` for routes/pages
- `/src/components` for UI primitives and feature components
- `/src/features/chat`
- `/src/features/skills`
- `/src/features/extensions`
- `/src/features/memory`
- `/src/features/profiles`
- `/src/lib` for adapters and shared utilities
- `/src/server` for backend/control-plane logic
- `/tests` for unit/integration tests
- `/docs` for product and architecture docs

## Testing Strategy
- unit tests for formatting, policies, and adapters
- component tests for chat/tool cards and settings flows
- integration tests for session, skill, memory, and MCP flows
- end-to-end tests for first-chat, install-skill, and add-MCP journeys
- mobile layout verification for core flows

## Delivery Strategy
- start with a thin but high-quality single-user experience
- validate architecture and event model early
- keep extension model capability-based from day one
- avoid overbuilding multi-user or marketplace features before core workflows are solid

## Recommended Immediate Next Steps
1. Create low-fidelity wireframes for Chat, Skills, Extensions, and Memory
2. Define control-plane API contracts
3. Build streaming chat shell and session sidebar
4. Add structured tool card event model
5. Implement policy presets and approval UX
