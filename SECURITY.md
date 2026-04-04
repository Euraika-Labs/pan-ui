# Security Policy

Supported scope
This repository is intended for self-hosted and internal admin usage. Security issues affecting authentication, approval flow, secret handling, diagnostics exposure, or runtime write-through behavior should be reported responsibly.

Reporting
Please report security issues privately to the maintainers rather than opening a public issue.

Guidelines
- Do not disclose exploitable details publicly before maintainers have had time to assess and patch
- Include reproduction steps, affected endpoints/files, and risk impact if known

Hardening notes
- Admin/ops pages are restricted to authenticated admin sessions
- Cookies are httpOnly and secure in production mode
- Runtime/audit data persists under `.data/` and should be protected at the host/filesystem level
- Deep Hermes-core live approval/resume is still partially wrapper-based and should be treated carefully in production-like environments
