# Hermes Workspace UX / UI Spec

## Purpose
This document turns the Hermes Workspace product direction into a screen-by-screen spec for the current WebUI. It is intentionally concrete so design and implementation can move without guessing.

## Product Shape
Hermes Workspace should feel like a profile-scoped runtime cockpit:
- Claude-like calm chat surface
- Perplexity-like provenance and source transparency
- Cursor/Copilot-like agent activity visibility
- VS Code/Raycast-like capability management for skills, plugins, and MCP

The app should optimize for four feelings:
- calm
- powerful
- inspectable
- trustworthy

## Design Principles
1. Chat is the center, but not the whole product.
2. Advanced controls use progressive disclosure.
3. Runtime truth beats UI convenience.
4. Scope must always be visible: global, profile, session.
5. The UI should explain what Hermes is doing, not hide it.
6. Operational surfaces should feel polished, not like admin leftovers.

## Global Information Architecture
Top-level navigation:
- Chat
- Skills
- Integrations
- Memory
- Profiles
- Settings

Settings contains operational browsers and diagnostics:
- Audit
- Approvals
- Artifacts
- Runs
- MCP diagnostics
- Runtime health
- Telemetry

## Global Shell
### Desktop layout
Use a 3-zone shell:
- Left rail: primary navigation + session list + search
- Center pane: active screen content, with chat as the dominant experience
- Right rail: contextual inspector

### Mobile layout
- Left rail becomes a slide-over navigation drawer
- Right rail becomes a bottom sheet or full-screen inspector
- Composer remains pinned
- Transcript and detail content get maximum screen width

### Top bar
Must contain:
- current profile switcher
- current page title
- active runtime/provider health chip
- quick action for new chat
- user/session menu

### Right rail behavior
The right rail is contextual and collapsible. It should not be permanently open by default.

For chat it uses tabs:
- Context
- Activity
- Tools
- Output
- Session

For management pages it becomes a detail inspector or action panel.

## Visual System
### Tone
- premium minimalism
- quiet surfaces
- technically serious but warm
- more editor than dashboard

### Surface rules
- soft border radii
- thin borders
- subtle elevation only where hierarchy needs it
- low-noise card backgrounds
- restrained accent color for state and focus

### Typography
- clean sans-serif for UI and prose
- monospace only for code, logs, commands, tool payload snippets, and config values
- generous line-height in chat messages

### Status color system
- running: accent/info
- success: green
- warning/approval: amber
- error: red
- disabled/inactive: neutral muted

### Motion
- subtle panel transitions
- no decorative animation
- loading motion only for streaming, pending approvals, and state transitions that benefit comprehension

## Screen-by-Screen Spec

## 1. Login Screen (`/login`)
### Purpose
Get the user into the app quickly and establish whether Hermes runtime access is available.

### Layout
- Centered auth card on a calm branded background
- Minimal form with strong focus states
- Optional runtime status note below the form

### Required elements
- username/email field
- password field or local-auth equivalent
- primary sign-in CTA
- optional "continue in mock mode" or runtime availability hint if applicable
- concise explanation that this UI connects to a local or managed Hermes runtime

### Empty/error states
- invalid credentials
- runtime unavailable after auth
- browser/session cookies disabled

### Notes
Keep this page visually simple. It should feel more like Linear/Claude than a traditional enterprise SSO page.

## 2. Chat Screen (`/chat`)
### Purpose
The primary product surface for talking to Hermes and watching the runtime operate.

### Overall layout
- Left: session sidebar and search
- Center: transcript + composer
- Right: contextual inspector

### Header
Must show:
- session title
- profile name
- model/provider chip
- policy preset chip
- runtime status chip
- settings button for chat-level controls

### Session sidebar
Sections:
- New chat
- Search sessions
- Pinned
- Recent
- Archived

Each session row should show:
- title
- branch/fork indicator if applicable
- last activity timestamp
- active state
- compact metadata badges when useful: loaded skills count, approvals pending, runtime errors

Actions per session:
- open
- rename
- fork
- archive
- delete
- export later

### Transcript
Render these message/event types distinctly:
- user message
- assistant message
- tool activity event
- approval request card
- artifact/output card
- error card
- system state note

Rules:
- assistant prose remains the most readable element on the page
- tool activity is compact by default
- structured output never defaults to raw JSON unless expanded
- approval cards must interrupt visually without feeling hostile
- artifacts should preview inline when text-like and deep-link into the Output rail

### In-line runtime status
During a run, show a compact progress strip near the active assistant turn:
- current phase label
- currently running tool or operation
- elapsed time
- stop action if available

Examples:
- Searching docs
- Running terminal command
- Waiting for approval
- Writing memory

### Composer
Default composer contents:
- multiline prompt input
- attachment button
- microphone button if enabled
- send/stop button
- compact chips for:
  - model
  - profile
  - loaded skills count
  - tool access state

Expandable advanced controls:
- provider/model selector
- memory mode
- policy preset
- reasoning/effort mode
- web/file/browser access toggles
- session skills tray

### Right rail tabs
#### Context
Show:
- active profile
- memory mode
- loaded skills
- attached files
- current workspace/session metadata
- session-specific instructions or policy summary

#### Activity
Show a timeline of:
- tool start/completion
- approvals requested/resolved
- errors
- retries
- artifact generation
- background task handoff

Each item should support drilldown for details.

#### Tools
Show:
- session-loaded skills
- profile-enabled extensions
- auth/health state for relevant integrations
- quick actions to load or unload capabilities for the current session

#### Output
Show:
- artifacts
- previews
- citations/sources if present
- downloadable outputs

#### Session
Show:
- title and id
- lineage/fork information
- source
- started/updated timestamps
- model/provider
- token/cost/runtime stats when available

### Chat empty state
Must explain:
- what Hermes can do
- what tools are available in the active profile
- suggested starting prompts
- how to load a skill or integration into the session

## 3. Skill Catalog Screen (`/skills`)
### Purpose
Browse, inspect, enable, edit, and load Hermes skills.

### Layout
- Top header with Installed / Discover mode switching
- Search/filter row
- Card grid or list in main pane
- Detail inspector or dedicated detail route on selection

### Primary sections
- Installed
- Discover
- Updates needed
- Local edits or profile-local overrides

### Skill card contents
- name
- short description
- source badge: bundled, local, profile-local, hub, agent-created
- scope state: installed, enabled, loaded in current session
- version or revision hint
- last updated
- quick actions

### Actions from list
- Inspect
- Enable for profile
- Load into session
- Disable
- Edit when local

### Screen-level context strip
When opened from chat, show:
- current session id or title
- loaded skills in the active session
- clear note when the page is showing installed/discovered state rather than currently loaded state only

### Empty states
Installed empty:
- explain what skills are
- offer discover flow

Discover empty:
- explain catalog availability issue or current source limitations

## 4. Skill Detail Screen (`/skills/[id]`)
### Purpose
Explain a skill fully before the user changes state.

### Layout
Two-column desktop layout:
- Main column for content and tabs
- Right column for trust, scope, and actions

### Tabs
- Overview
- Source / SKILL.md
- Metadata
- Activity / audit
- Session usage

### Main content requirements
Overview:
- problem the skill helps with
- expected workflow
- required tools/dependencies
- author/source

Source tab:
- formatted SKILL.md viewer/editor
- edit affordance only for editable local/profile-local skills

Metadata:
- id
- provenance
- install location
- update state
- platform restrictions

Activity:
- last used
- created by agent or human
- changed recently

Session usage:
- whether loaded in current session
- sessions that recently used it

### Right-side action panel
Must show:
- trust/provenance badge
- scope controls:
  - enable globally
  - enable for profile
  - load into current session
- uninstall/update when applicable
- edit/open local source when allowed

## 5. Integrations Screen (`/extensions`)
### Purpose
Manage plugins, MCP servers, callable tools, approvals, and diagnostics from one place.

### Layout
Tabbed management surface with a card/list view by default.

### Tabs
- Installed
- MCP Servers
- Tools
- Approvals
- Diagnostics

### Header actions
- Add MCP server
- Refresh/runtime re-probe
- Filter by trust/risk/type

### Installed tab
Show cards for all capabilities with:
- name
- type
- publisher/source
- health badge
- risk badge
- governance badge
- quick actions

### MCP Servers tab
Show server-focused list with:
- connection status
- transport summary
- discovered tool count
- last probe time
- filtered/exposed tool counts

### Tools tab
Show a capability inventory view with:
- tool name
- source capability
- scope/availability
- approval policy
- risk level

### Approvals tab
Show capabilities that are approval-gated or policy-restricted, with:
- approval policy
- governance mode
- current constraints
- quick link to settings or detail view

### Diagnostics tab
Show live health/diagnostic summaries and deep-link to `/settings/mcp-diagnostics` when needed.

## 6. Integration Detail Screen (`/extensions/[id]`)
### Purpose
Give each plugin or MCP server a first-class control page.

### Tabs
- Overview
- Permissions
- Configuration
- Capabilities
- Diagnostics
- Activity

### Overview
Must show:
- what this integration does
- publisher/source and trust level
- install state
- scope state
- last used

### Permissions
Show human-readable permissions and risk summary:
- file read/write
- network access
- shell or subprocess use
- credentials usage
- data access scope

### Configuration
Show:
- config schema fields
- secrets references, not raw secrets
- effective config source: global/profile/session
- save/test actions

### Capabilities
Show:
- discovered tools/resources/prompts
- enable/disable or include/exclude controls
- whether the model can auto-call them or requires approval

### Diagnostics
Show:
- startup/connectivity state
- logs/errors
- latency/health if available
- re-test connection
- raw probe output when expanded

### Activity
Show:
- install/update history
- recent approvals
- recent tool invocations

### Right rail / action panel
- install/uninstall
- enable globally
- enable in profile
- load into session when relevant
- test connection
- open logs
- disable

## 7. Memory Screen (`/memory`)
### Purpose
Let the user inspect memory honestly without confusing it with session search.

### Layout
Split the screen into distinct panels or tabs:
- User memory
- Agent memory
- Session search
- Context inspector

### User memory panel
Show:
- editable content
- last modified
- profile scope
- save actions

### Agent memory panel
Show the same structure, but clearly marked as Hermes/agent-oriented memory.

### Session search panel
This is not memory. It should behave like searchable history.
Show:
- search input
- result list
- session/message snippets
- deep links to open the session

### Context inspector
Show what is actually in scope for the current session:
- profile
- loaded skills
- memory mode
- whether recent memory changes apply now or next session

### Key UX rule
Prominently explain:
"Memory updates persist immediately, but active sessions may not use them until a new session starts."

### Save actions
Offer:
- Save
- Save and start new session
- Save and fork fresh session

## 8. Profiles Screen (`/profiles`)
### Purpose
Treat profiles as the app’s true tenancy boundary.

### Layout
- Profile list/grid in main pane
- Summary detail section for selected profile
- Primary create/clone/switch actions in header

### Each profile card should show
- profile name
- active state
- model/provider defaults
- policy preset
- sessions count
- skills count
- integrations count
- memory status summary

### Actions
- switch
- create
- clone
- rename if supported
- delete

### Detail summary
For selected profile, show:
- Hermes home path
- config summary
- policy preset
- runtime status
- last used
- quick links to chat, skills, integrations, memory for that profile

### Important UX rule
Switching profiles should feel explicit and consequential. It should visibly reload profile-scoped state.

## 9. Settings Overview (`/settings`)
### Purpose
Provide the operator view for the currently selected profile and its runtime.

### Sections
- Active profile policy
- Runtime status summary
- Operational browsers
- Recent audit stream

### Active profile policy card
Show:
- selected policy preset
- explanatory copy about how it affects approvals/tooling
- quick edit action

### Runtime status summary
Show:
- Hermes detected or not
- Hermes home path
- provider/model defaults
- memory provider
- MCP server count
- skills count
- recent sessions count
- health state

### Operational browsers section
Prominent links/buttons to:
- Audit browser
- Approvals browser
- Artifacts browser
- MCP diagnostics
- Runtime health
- Runs explorer
- Telemetry browser

## 10. Audit Browser (`/settings/audit`)
### Purpose
Make risky changes and extension/runtime events inspectable.

### Required content
- filter/search controls
- time-sorted event list
- actor/source
- action type
- affected object
- status/outcome
- expandable event payload summary

## 11. Approvals Browser (`/settings/approvals`)
### Purpose
Centralize pending and historical approvals.

### Required content
- pending approvals section first
- resolved approvals below
- filters by status, profile, capability, risk
- action details:
  - requested operation
  - why approval is required
  - scope choices for approval

### Approval actions
- allow once
- allow for session
- allow for profile
- deny

## 12. Artifacts Browser (`/settings/artifacts`)
### Purpose
Give outputs a durable home outside the chat transcript.

### Required content
- artifact list with session/run association
- type badge
- preview pane for text-like output
- download/open action
- source run/session metadata

## 13. Runs Explorer (`/settings/runs`)
### Purpose
Make execution state first-class, not hidden in the transcript.

### Required content
- runs table/list with status
- session association
- source
- started/updated timestamps
- last error if present
- filters by run state

### Run detail (`/settings/runs/[id]`)
Show:
- run metadata
- event timeline
- approvals encountered
- artifacts created
- final outcome

## 14. MCP Diagnostics (`/settings/mcp-diagnostics`)
### Purpose
Provide an operator-grade troubleshooting view for MCP.

### Required content
- per-server status cards
- transport type
- last probe result
- discovered tools count
- cached vs live probe state
- explicit error text
- remediation hints

## 15. Runtime Health (`/settings/health`)
### Purpose
Make Hermes runtime readiness and failure modes visible.

### Required content
- Hermes binary detection
- config presence
- memory files presence
- state DB availability
- provider/model summary
- doctor-style checks
- gateway/service state when available

## 16. Telemetry Browser (`/settings/telemetry`)
### Purpose
Expose product/runtime instrumentation in a way that helps improve UX and reliability.

### Required content
- key event streams
- latencies and counts where available
- filters
- export affordance

## Shared Interaction Patterns
### Scope language
Always use consistent labels:
- Installed
- Enabled globally
- Enabled in profile
- Loaded in session
- Requires approval
- Disabled by policy

### Empty states
Every empty state must answer:
- what this area is
- why it matters in Hermes
- what the user should do next

### Error states
Prefer actionable explanations over generic failure text:
- Missing credentials
- Runtime unavailable
- MCP probe failed
- Permission denied
- Unsupported capability
- Health check failed

Each should include a next action.

### Search and filtering
Search should exist in:
- sessions
- skills
- integrations
- audit
- approvals
- runs
- telemetry

### Accessibility requirements
- full keyboard support for navigation and major actions
- visible focus states
- semantic labels on icon-only controls
- sufficient contrast in dark mode and light mode
- responsive behavior at laptop, tablet, and phone breakpoints

## Current Build Implications
This spec maps directly to the existing route shape in the app today:
- `/chat`
- `/skills`
- `/skills/[id]`
- `/extensions`
- `/extensions/[id]`
- `/memory`
- `/profiles`
- `/settings`
- `/settings/audit`
- `/settings/approvals`
- `/settings/artifacts`
- `/settings/mcp-diagnostics`
- `/settings/health`
- `/settings/runs`
- `/settings/runs/[id]`
- `/settings/telemetry`

The major design task is not inventing new navigation. It is raising the quality, consistency, and runtime honesty of the screens that already exist.
