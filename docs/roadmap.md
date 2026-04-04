# Hermes Workspace Roadmap

## Roadmap Summary
The roadmap is structured to ship a useful self-hostable product quickly, then deepen Hermes-native functionality, then add team and ecosystem features.

## Phase 0: Foundations / Prototype
Target window: 2-4 weeks

### Goals
- prove the core architecture
- validate the app shell and streaming chat UX
- confirm Hermes API/control-plane integration

### Deliverables
- app shell and navigation
- authentication for local/private usage
- chat page with streaming transcript
- basic session list
- model/provider switcher
- initial inline tool cards
- base theme system with dark mode

### Exit criteria
- a user can open the app and complete a real chat
- tool activity renders in a structured way
- sessions can be resumed

## Phase 1: MVP / Public Alpha
Target window: 4-8 weeks

### Goals
- ship a polished single-user self-hostable WebUI
- let users manage the most important Hermes-native features without CLI usage

### Deliverables
#### Chat
- session sidebar
- session search
- rename/archive/delete session
- attachments
- per-chat settings
- mobile-responsive composer
- voice input
- optional TTS playback

#### Skills
- installed skills list
- inspect skill
- install/uninstall/update skill
- enable/disable skill
- edit local skill source

#### Extensions
- installed extensions view
- add MCP server
- configure auth/settings
- test connection
- per-tool enable/disable
- health state badges

#### Memory
- user memory editor
- agent memory editor
- session search UI
- context inspector

#### Profiles
- list/switch profiles
- active profile indicator
- per-profile defaults

#### Safety
- policy presets
- risky action approval modal
- basic audit log

### Exit criteria
- users can chat, install a skill, configure an MCP server, and edit memory from the WebUI
- no CLI is required for core workflows
- dangerous capabilities are gated

## Phase 2: Beta / Agent-native Depth
Target window: 6-10 weeks

### Goals
- make the product clearly better for Hermes than generic OpenAI-compatible UIs
- improve visibility, debugging, and workflow organization

### Deliverables
- branch/fork visualization for sessions
- artifact drawer or side panel
- file/diff/result cards
- richer tool timeline
- background task status views
- project/folder grouping for chats
- keyboard shortcuts and command palette
- stronger search across sessions, skills, and extensions
- profile import/export
- update/changelog views for skills and extensions

### Exit criteria
- power users can manage most Hermes workflows visually
- the UI feels distinctively agent-native

## Phase 3: Teams / Admin
Target window: 8-12 weeks

### Goals
- support internal company deployments and policy-controlled usage

### Deliverables
- multi-user auth
- RBAC/admin roles
- org-level policy management
- extension allowlists/blocklists
- approval request workflow
- richer audit UI
- shared workspaces/profiles where appropriate
- analytics for feature and extension usage
- secrets management UX

### Exit criteria
- teams can deploy Hermes Workspace safely in shared environments
- admins can control risk without blocking usability

## Phase 4: Ecosystem / Marketplace
Target window: 8-16 weeks

### Goals
- turn Hermes Workspace into the main ecosystem surface for extensions and skills

### Deliverables
- curated skill marketplace
- curated extension marketplace
- verified publisher program
- signed package support
- stable/beta release channels
- rollback support
- recommendation engine for skills/extensions
- optional gateway inbox for messaging platforms

### Exit criteria
- Workspace becomes the primary user-facing interface for the Hermes ecosystem

## Priority Matrix

### P0 Must-have
- chat streaming
- sessions and search
- tool cards
- model switcher
- auth
- safety presets
- skills list/install/edit
- MCP add/test/configure
- memory view/edit
- profile switching

### P1 Should-have
- attachments
- voice/TTS
- richer artifacts
- session branching
- extension health views
- command palette

### P2 Nice-to-have
- org policies
- marketplace trust badges
- analytics
- gateway inbox
- shared workspaces

## Suggested Release Strategy
Alpha:
- internal users and Hermes contributors
- validate UX and runtime integration

Beta:
- self-hosters and developer teams
- validate reliability and admin controls

GA:
- broader Hermes audience
- emphasize onboarding, stability, and extension ecosystem quality

## Key Risks
1. Too much surface area makes the UI cluttered
   - mitigate with progressive disclosure and strong IA
2. Browser access to powerful tools creates security risk
   - mitigate with proxy enforcement, approvals, and safe presets
3. Generic chat patterns do not fit Hermes-native workflows well
   - mitigate by investing in tool cards, context inspector, skills, and extension UX
4. Extension management gets messy without a clear lifecycle
   - mitigate by enforcing install/configure/enable/test/update/remove flows
