# Hermes Workspace Product Spec

## Product Name
Hermes Workspace

## Problem Statement
Hermes Agent has strong backend capabilities, but users currently interact with many of them through CLI-first or platform-specific interfaces. There is no canonical first-party WebUI that brings together chat, tool visibility, skills, memory, profiles, and extension management into one polished experience.

## Goals
- Deliver a first-party Hermes-native WebUI
- Make chat the center of the experience
- Expose Hermes capabilities without overwhelming users
- Provide strong safety and permissions for web-based access
- Support local/self-hosted and team use cases

## Primary Use Cases
1. Chat with Hermes in a premium web experience
2. Resume, search, and organize sessions
3. Install, inspect, edit, and enable skills
4. Add and manage MCP servers and plugins
5. Inspect tool calls, logs, artifacts, and approvals
6. View and manage memory
7. Switch among profiles/workspaces

## Functional Requirements

### 1. Chat
- Create, rename, archive, delete, and fork sessions
- Stream assistant output in real time
- Render tool calls inline as structured cards
- Support attachments: files, images, docs
- Support voice input and optional TTS playback
- Allow per-chat settings:
  - model/provider
  - tool profile
  - memory mode
  - extension scope

### 2. Sessions
- List recent sessions
- Search sessions
- Filter by profile/project/date
- Resume existing session
- Fork session into a branch
- Export session transcript

### 3. Skills
- List installed skills
- Browse available skills
- Inspect skill metadata and content
- Install/uninstall/update skills
- Edit local skill source
- Enable/disable by profile or scope
- Load skill into current session
- Show provenance:
  - bundled
  - local
  - hub
  - agent-created

### 4. Extensions
- List installed extensions and MCP servers
- Add new MCP server by command or URL
- Configure auth, secrets, and server settings
- Test server connectivity
- Enable/disable exposed tools per extension
- Show compatibility and health state
- Install/remove/update plugins where supported

### 5. Memory
- View/edit user memory
- View/edit agent memory
- Search past sessions/conversations
- Show what context is active for the current session
- Indicate when memory changes apply immediately vs next session

### 6. Profiles
- List/create/switch/clone/delete profiles
- Show active profile globally
- Isolate sessions, memory, skills, extensions, and config by profile
- Support import/export in later phases

### 7. Safety and Governance
- Role-based access control
- Approval flow for risky actions
- Tool policy presets
- Audit log for risky actions and extension changes
- Per-scope permissions:
  - global
  - profile
  - workspace
  - session

## UX Requirements
- Clean, low-noise transcript
- Fast streaming with clear loading states
- Tool outputs never default to raw JSON
- Mobile-responsive core workflows
- Keyboard-friendly navigation
- Dark mode as first-class
- Progressive disclosure for advanced controls

## Information Architecture
Top-level navigation:
- Chat
- Skills
- Extensions
- Memory
- Profiles
- Settings

## Core User Journeys

### Journey A: First chat
1. User logs in or connects to Hermes
2. User chooses profile and tool preset
3. User sends a message
4. Hermes responds with streaming output and visible tool cards

### Journey B: Install a skill
1. User opens Skills
2. User searches and inspects a skill
3. User installs it
4. User enables it for the active profile
5. User loads it into a session

### Journey C: Add an MCP server
1. User opens Extensions
2. User adds a server by command or URL
3. User configures auth and settings
4. User tests the connection
5. User selects which tools are exposed
6. User enables it for a scope

### Journey D: Inspect memory
1. User opens Memory
2. User reviews USER/MEMORY context
3. User edits entries
4. User is informed whether the change affects current or future sessions

## Non-functional Requirements
- Responsive on desktop, tablet, and mobile
- Safe defaults for web deployments
- SSE-based streaming for initial release
- Clear observability for failures
- Stable operation when Hermes runtime is slow or disconnected

## Out of Scope for V1
- Real-time collaboration
- Shared public workspaces
- Paid marketplace
- Team analytics dashboards
- Full gateway inbox unification

## Release Quality Bar for MVP
- Users can complete chat, session resume, skill install, memory edit, and MCP setup without using the CLI
- Risky actions are gated
- Error states are understandable
- Core flows work well on mobile
