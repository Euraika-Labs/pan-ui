# Hermes Workspace Vision

## Vision
Build a beautiful, agent-native web interface for Hermes Agent where users can chat with Hermes, inspect tool activity, manage skills, configure plugins and MCP servers, edit memory, and switch between isolated profiles.

This product should feel like the control room for a personal AI agent — not just a generic chatbot frontend.

## Product Thesis
Hermes already has the backend primitives required for a powerful WebUI:
- chat and session persistence
- tool calling
- skills
- plugins and MCP integrations
- memory
- profiles
- OpenAI-compatible API server
- gateway/editor integrations

The WebUI should expose those capabilities in a coherent, safe, visually polished interface.

## Target Users
1. Power users
   - Want a fast and beautiful place to chat with Hermes
   - Want to see what Hermes is doing
   - Want easy control over sessions, memory, and skills

2. Developers
   - Need tools, files, logs, model switching, MCP, and debugging
   - Often self-host Hermes

3. Teams and admins
   - Need permission boundaries
   - Need extension governance
   - Need profile and workspace isolation

## Core Principles
1. Chat first
   The main user action is talking to Hermes.

2. Agent-native
   Tool usage, approvals, files, diffs, and structured outputs must be visible.

3. Progressive disclosure
   Beginners get a simple surface. Power users can expand into deep controls.

4. Safety by design
   Dangerous capabilities like terminal, file writes, browser automation, and external network access must be permissioned and understandable.

5. Hermes-native identity
   Skills, memory, profiles, sessions, and MCP are first-class concepts in the UI.

## User Outcomes
Users should be able to:
- start a new chat in under 2 minutes
- understand Hermes tool usage without reading raw JSON
- install a skill in under 3 minutes
- configure an MCP server visually
- inspect and edit memory safely
- switch profiles without confusion

## Success Metrics
### User metrics
- Time to first successful chat < 2 minutes
- Time to install and enable a skill < 3 minutes
- Session resume/fork usage among active users
- Weekly usage of skills/extensions by power users

### Product metrics
- Chat streaming success rate
- MCP connection success rate
- Risky action approval completion rate
- Skill install and edit success rate
- Mobile session completion rate

## Non-goals for V1
- Full collaborative multi-user editing
- Public marketplace monetization
- Replacing the Hermes CLI entirely
- Full IDE replacement
- Social/community features

## Product Positioning
Hermes Workspace should combine:
- the calm polish of Claude
- the breadth of Open WebUI / LibreChat
- the agent-native interaction model of assistant-ui
- the speed and simplicity of NextChat

## One-sentence summary
Hermes Workspace is a self-hostable, beautiful control room for Hermes Agent where chat, tools, skills, memory, extensions, and profiles all feel native and coherent.
