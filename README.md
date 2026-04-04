# Hermes Agent WebUI Planning Docs

This folder contains the product and implementation planning documents for a first-party Hermes Agent WebUI.

Documents
- `docs/vision.md` — product vision, goals, principles, and success metrics
- `docs/product-spec.md` — concrete product requirements, user journeys, and scope
- `docs/architecture.md` — system architecture, services, data model, and integration approach
- `docs/roadmap.md` — phased roadmap, milestones, and release criteria
- `docs/ux-ui-spec.md` — information architecture, screen patterns, and visual design direction
- `docs/security-and-extensions.md` — permissions, safety model, MCP/plugins/skills lifecycle
- `docs/implementation-plan.md` — suggested build sequence, workstreams, and delivery plan

Recommended build direction
- Frontend: Next.js + TypeScript + Tailwind + shadcn/ui
- Runtime: Hermes API server + Hermes-specific control plane/proxy
- Core differentiators: chat, tool visibility, skills, MCP/extensions, memory, profiles
