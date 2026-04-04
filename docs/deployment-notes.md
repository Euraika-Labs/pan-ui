# Hermes Workspace Deployment Notes

Environment variables
- `HERMES_WORKSPACE_USERNAME` — login username, default `admin`
- `HERMES_WORKSPACE_PASSWORD` — login password, default `changeme`
- `HERMES_WORKSPACE_SESSION_SECRET` — required for non-dev deployments
- `HERMES_HOME` — optional Hermes home override for runtime bridge, default `~/.hermes`
- `HERMES_API_BASE_URL` — Hermes API server base URL, default `http://127.0.0.1:8000`
- `HERMES_API_KEY` — optional bearer token for Hermes API server
- `HERMES_API_TIMEOUT_MS` — optional HTTP timeout override
- `HERMES_MOCK_MODE` — default mock mode is enabled unless explicitly set to `false`

Recommended alpha boot sequence
1. Install dependencies with `npm install`
2. Start local dev server with `npm run dev`
3. Optionally point to a real Hermes runtime via `HERMES_API_BASE_URL`
4. Log in with configured workspace credentials

Verification commands
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run test:e2e`

Current persistence model
This alpha still uses in-memory stores for most domain objects. Restarting the dev server resets:
- sessions
- uploads
- skills changes
- extension changes
- memory changes
- profiles
- audit log

Real Hermes runtime bridge
The Settings page now reads directly from the installed Hermes runtime when available:
- Hermes binary path/version
- `HERMES_HOME` contents
- config.yaml model/provider/memory provider
- discovered profiles
- MCP server definitions from config
- skill counts from the real skills tree
- recent persisted sessions from Hermes `state.db`

Deeper real-backed integration now in place
- Session/history reads come from real Hermes SQLite state
- Session create/rename/archive/delete/fork attempt real SQLite-backed writes first
- Memory reads/writes target real `USER.md` / `MEMORY.md` files per selected profile
- Extensions/MCP list and config edits target real `config.yaml`
- MCP capability editing now writes real `mcp_servers.<name>.tools.include/exclude` semantics in config
- Skills browsing/detail/editing target the real skills filesystem when present
- Skill enable/disable now maps to real `skills.disabled` / `skills.platform_disabled.cli`
- Profile create/activate/delete uses real Hermes CLI/profile directories
- Durable audit events are written to `/opt/projects/hermesagentwebui/.data/audit.db`
- Upload metadata/content is persisted under `/opt/projects/hermesagentwebui/.data/uploads`
- Stream parsing understands richer Responses-style SSE items and maps them into UI timeline events
- Runtime history is durably stored in `/opt/projects/hermesagentwebui/.data/runtime.db`
- Dedicated browser pages exist for audit, approvals, artifacts, telemetry, runs explorer, runtime health, and MCP diagnostics
- Settings/ops pages are guarded by admin-only route checks
- MCP diagnostics now persist and surface last probe status, explicit error text, and last probe timestamp
- Runtime exports support downloadable JSON and CSV output

Remaining hybrid behavior
- Live streaming still falls back to mock behavior when the Hermes API server is unavailable or `HERMES_MOCK_MODE` is enabled
- True upstream Hermes-internal suspend/resume for already-running live tool calls is still limited; current server-enforced approval gating is strongest on the app-controlled stream path
- Some non-runtime UI state remains app-managed even though runtime timeline/artifacts/approvals are now durable

Before beta
Planned persistence upgrades should replace in-memory stores with durable backing for:
- sessions and messages
- memory
- skills and extensions
- profiles
- audit events
- uploads/attachments
