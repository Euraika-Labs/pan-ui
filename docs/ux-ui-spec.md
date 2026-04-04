# Hermes Workspace UX / UI Spec

## UX Goals
- Make Hermes feel powerful but understandable
- Keep the main chat surface clean
- Surface advanced controls without overwhelming beginners
- Ensure mobile remains excellent, not an afterthought

## Information Architecture
Top-level navigation:
- Chat
- Skills
- Extensions
- Memory
- Profiles
- Settings

## Primary Layout
### Desktop
- Left sidebar:
  - new chat
  - search
  - recent sessions / projects
- Main pane:
  - transcript or active content area
- Right drawer:
  - run details
  - tool timeline
  - files/artifacts
  - settings/context

### Mobile
- left sidebar becomes slide-over panel
- right drawer becomes bottom sheet or full-screen panel
- composer stays fixed and prominent
- chat transcript gets maximum screen space

## Chat Screen
### Header
Must show:
- session title
- active profile
- model/provider chip
- tool policy badge
- settings button

### Transcript
Render types:
- user message
- assistant message
- tool card
- approval card
- artifact card
- error card

Requirements:
- never dump raw JSON by default
- tool cards are collapsed by default but expandable
- structured outputs are visually distinct from prose
- streaming feels smooth and stable

### Composer
Controls:
- multiline text input
- attach button
- mic button
- send button
- optional quick toggles for web/tools/memory mode

## Skills Screen
Sections:
- Installed
- Discover
- Updates
- Local edits

Card contents:
- name
- description
- provenance badge
- scope/enablement state
- version
- last updated
- quick actions

Detail view:
- overview
- metadata
- source editor
- history/audit
- enable/disable controls

## Extensions Screen
Sections:
- Installed
- Discover
- MCP servers
- Updates
- Policies

Card contents:
- name
- publisher/source
- health badge
- risk badge
- compatibility badge
- last updated
- quick actions

Detail tabs:
- Overview
- Permissions
- Configuration
- Capabilities
- Versions
- Activity

## Memory Screen
Sections:
- User memory
- Agent memory
- Session search
- Context inspector

Requirements:
- explain difference between prompt memory and searchable history
- mark changes as current-session or next-session effective
- support compare/confirm for destructive edits

## Profiles Screen
Requirements:
- list profiles with clear active state
- show summary of each profile:
  - model defaults
  - tools policy
  - skill count
  - extension count
  - session count
- actions: create, clone, switch, delete

## Visual Design System
Tone:
- premium minimalism
- calm, restrained, technical but warm

Visual rules:
- soft borders
- subtle shadows/elevation
- muted secondary surfaces
- one strong accent color
- high contrast for accessibility
- clear status colors for running/success/error/warning/approval

Typography:
- clean sans for UI
- monospace for code, commands, tool details, and logs

Motion:
- subtle transitions
- status animations only where they add clarity
- no noisy or decorative animations

## Accessibility Requirements
- keyboard navigation for major workflows
- visible focus states
- semantic labels for buttons and statuses
- sufficient color contrast
- responsive layouts at common breakpoints

## Empty State Principles
Every major screen should explain:
- what this area is for
- what the user can do next
- why it matters in Hermes

## Design References
Use as inspiration, not imitation:
- Claude
- Linear
- Open WebUI
- LibreChat
- assistant-ui
- NextChat
