# Hermes Workspace Architecture

## Architecture Summary
Build Hermes Workspace as a web frontend plus a Hermes-specific control plane sitting in front of the Hermes API server and local Hermes runtime resources.

Recommended architecture:
- Frontend: Next.js application
- Control plane: lightweight backend/proxy exposing Hermes-native APIs
- Runtime: Hermes API server and existing Hermes storage/runtime mechanisms
- Streaming: SSE initially, with optional WebSocket upgrade later

## Why this architecture
A direct browser-to-Hermes connection is insufficient for a production-grade UX because the WebUI needs:
- auth and sessions
- CORS protection
- permission enforcement
- safer tool exposure
- profile-aware routing
- normalized events for tool cards and artifacts
- skill and extension management endpoints
- audit logging

## High-level components

### 1. Frontend Web App
Responsibilities:
- application shell and navigation
- chat transcript and streaming UI
- session sidebar and search
- skill browser/editor
- extension catalog and config flows
- memory editor and context inspector
- profile switcher
- settings and admin UI

Suggested stack:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- CodeMirror or Monaco for editing

### 2. Control Plane API
Responsibilities:
- authentication and user sessions
- profile-aware routing to Hermes runtime
- transform Hermes responses into UI-friendly events
- enforce tool and extension policies
- expose APIs for skills, memory, sessions, profiles, and extensions
- audit logging
- approval workflows for risky actions

Suggested implementation:
- FastAPI or Next.js server routes
- SSE endpoint for chat streaming
- server-side adapters for Hermes API server and local Hermes files/configs

### 3. Hermes Runtime
Responsibilities:
- LLM/tool orchestration
- tool execution
- skills loading and management
- session persistence
- memory injection and updates
- MCP discovery and tool exposure

Underlying Hermes surfaces to reuse:
- OpenAI-compatible API server
- session database and search
- skill management mechanisms
- profile separation
- MCP integration

## Deployment topologies

### Topology A: Single-user local/self-hosted
- Next.js frontend and control plane hosted together
- Hermes runtime/API server local to same machine
- filesystem access to Hermes home/profile directories

Best for:
- individual users
- local development
- private servers

### Topology B: Multi-user team deployment
- shared frontend/control plane service
- Hermes runtime instances isolated by profile, user, or workspace
- admin auth, RBAC, audit logging, and policy controls enabled

Best for:
- teams
- internal company deployments

## Data model
Core entities:
- User
- Profile
- Workspace
- Session
- Message
- ToolCall
- Artifact
- Skill
- Extension
- ExtensionCapability
- MemoryEntry
- ApprovalRequest
- AuditEvent
- PolicyPreset

### Entity notes
- Profile is the core isolation boundary for sessions, memory, skills, and configuration.
- Session stores transcript, metadata, lineage, model settings, and tool/profile context.
- ToolCall stores status, arguments, redacted output, timestamps, and approval state.
- Artifact stores file outputs, diffs, generated images, code snippets, or downloadable results.
- ExtensionCapability maps one extension/MCP server to the concrete tools/actions it exposes.

## Chat request lifecycle
1. User sends a message from the frontend.
2. Frontend posts to control plane.
3. Control plane resolves active profile, policy preset, and allowed extensions/toolsets.
4. Control plane forwards to Hermes runtime/API server.
5. Hermes streams model output and tool activity.
6. Control plane normalizes events into UI-friendly chunks:
   - assistant text delta
   - tool started
   - tool awaiting approval
   - tool finished
   - artifact emitted
   - error event
7. Frontend renders transcript and tool cards in real time.

## Session architecture
Needed APIs:
- list sessions
- search sessions
- create session
- resume session
- fork session
- rename/archive/delete session
- export transcript

Design notes:
- retain Hermes session IDs as canonical runtime references
- add UI-specific metadata only in the control plane if needed
- support lineage visualization for forks/branches in later phases

## Skill architecture
The control plane should expose:
- list installed skills
- browse catalog/hub
- inspect skill metadata
- install/uninstall/update skill
- read/edit local SKILL.md
- enable/disable by profile/scope

Storage notes:
- leverage Hermes skill directories and existing skill semantics
- preserve provenance metadata: bundled, hub, local, agent-created
- log all mutations to audit events

## Extension architecture
The extension model should unify:
- MCP servers
- native plugins
- built-in tool integrations

Required capabilities:
- add/remove/update MCP server config
- test connectivity
- manage auth and secrets references
- enable/disable specific exposed tools
- show health and compatibility status
- scope enablement per profile/workspace/session

## Memory architecture
Expose memory as three distinct concepts:
1. Prompt memory
   - user memory
   - agent memory
2. Searchable session history
3. Optional external memory provider status

Important UX implication:
- some memory changes are not reflected in the current prompt until a new session begins
- the API and UI must make this explicit

## Permissions and safety architecture
Risk classes:
- read-only
- write-local
- execute-shell
- external-network
- browser-control
- credentials/secrets
- background automation

Enforcement layers:
1. frontend visibility
2. control plane policy check
3. Hermes runtime/toolset filtering
4. approval workflow for risky actions

## API design outline

### Chat
- POST /api/chat/sessions
- GET /api/chat/sessions
- GET /api/chat/sessions/search
- POST /api/chat/sessions/:id/messages/stream
- POST /api/chat/sessions/:id/fork
- PATCH /api/chat/sessions/:id
- DELETE /api/chat/sessions/:id

### Skills
- GET /api/skills
- GET /api/skills/catalog
- GET /api/skills/:id
- POST /api/skills/:id/install
- POST /api/skills/:id/enable
- POST /api/skills/:id/disable
- PATCH /api/skills/:id/source
- DELETE /api/skills/:id

### Extensions
- GET /api/extensions
- GET /api/extensions/catalog
- POST /api/extensions/mcp
- PATCH /api/extensions/:id
- POST /api/extensions/:id/test
- POST /api/extensions/:id/capabilities/:capabilityId/enable
- POST /api/extensions/:id/capabilities/:capabilityId/disable
- DELETE /api/extensions/:id

### Memory
- GET /api/memory/user
- PATCH /api/memory/user
- GET /api/memory/agent
- PATCH /api/memory/agent
- GET /api/memory/context-inspector
- GET /api/memory/session-search

### Profiles
- GET /api/profiles
- POST /api/profiles
- POST /api/profiles/:id/switch
- PATCH /api/profiles/:id
- DELETE /api/profiles/:id

### Admin
- GET /api/policies
- PATCH /api/policies/:id
- GET /api/approvals
- POST /api/approvals/:id/approve
- POST /api/approvals/:id/reject
- GET /api/audit

## Observability
Track:
- API latency
- stream interruptions
- tool error rates
- MCP test failures
- skill install failures
- approval prompts and outcomes
- mobile rendering failures

## Recommended build order
1. Chat and sessions
2. Permissions and tool policy enforcement
3. Skills and memory management
4. MCP/extensions management
5. Artifacts, branching, and team/admin features
