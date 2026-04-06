# Contributing

Thanks for contributing to Pan by Euraika.

Development workflow
1. Create a branch from `main`
2. Make focused changes
3. Run:
   - `npm run lint`
   - `npm run test`
   - `npm run build`
   - `npm run test:e2e`
4. Open a pull request with a clear summary and test plan

Conventions
- Prefer small, reviewable changes
- Keep server bridges typed and centralized in `src/server/core`
- Prefer extending existing feature modules under `src/features`
- Add tests for non-trivial behavior changes
- Keep operational/admin pages guarded and security-conscious

Commit style
Use conventional commit prefixes where practical:
- `feat:`
- `fix:`
- `refactor:`
- `docs:`
- `test:`
- `chore:`

Before submitting
- Ensure no secrets are committed
- Ensure `.data/` artifacts are not committed
- Update docs when behavior or deployment assumptions change