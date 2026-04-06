# Pan Security and Extensions Spec

## Security Goals
- prevent accidental exposure of dangerous Hermes capabilities in the browser
- make permissions understandable
- support both self-hosted and team-controlled deployments
- provide trust signals for skills and extensions

## Risk Classes
Each tool or extension capability should be tagged with one or more risk classes:
- read-only
- write-local
- execute-shell
- external-network
- browser-control
- credentials/secrets
- background-automation

## Policy Presets
### Safe Chat
- read-only and low-risk tools only
- no terminal execution
- no file writes

### Research
- web, browser, file-read
- no shell execution
- optional download restrictions

### Builder
- file-write and code execution allowed
- shell requires approval
- network scoped by policy

### Full Power
- all configured tools available
- restricted by user role or admin settings

## Approval Model
Support:
- no approval needed
- always ask
- once per session
- once per tool/capability
- admin-only

Approval prompts must show:
- action summary in plain English
- capability/risk class
- affected scope
- why Hermes is asking

## Extension Model
Treat extensions as a structured lifecycle, not a single opaque package.

Lifecycle:
1. discover
2. inspect
3. install
4. configure
5. enable capabilities
6. test
7. use
8. update
9. disable/remove

## Extension Types
- MCP servers
- native Hermes plugins
- built-in integrations
- local/internal extensions

## Required Extension Metadata
- id
- name
- description
- version
- publisher/source
- trust level
- compatibility range
- last updated
- permissions summary
- capabilities list
- auth requirements
- configuration schema

## Trust Signals
Expose:
- verified publisher badge
- source repository link
- changelog
- compatibility with current Hermes version
- signed/reviewed status when available
- last updated time
- admin approval requirement

## Health States
Each extension should show:
- healthy
- needs configuration
- auth expired
- incompatible
- test failed
- disabled by policy

## Capability-level Controls
A single extension may expose many tools. Users/admins should be able to:
- enable only selected capabilities
- set scope by profile/workspace/session
- restrict high-risk capabilities while keeping low-risk ones enabled

## Secrets and Auth
Requirements:
- do not expose raw secrets to the frontend unnecessarily
- use secure secret references where possible
- support OAuth-based setup flows for MCP or plugin providers
- indicate expired auth states clearly

## Audit Requirements
Log:
- skill installs/updates/removals
- extension installs/updates/removals
- capability enable/disable changes
- risky action approvals/rejections
- policy changes
- profile scope changes for risky tools

## Skills Safety Notes
Skills are less like runtime plugins and more like procedural memory. Still, the UI should:
- show provenance
- warn when editing bundled skills
- log agent-created and agent-modified skills
- explain that a skill can influence future behavior even if it is not a code plugin

## Recommended V1 Boundaries
- do not expose unrestricted shell execution to anonymous or weakly authenticated users
- require explicit policy selection during setup
- require approvals for high-risk capabilities
- make safe mode easy to understand and enable