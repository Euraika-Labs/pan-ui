# Deployment

Pan is distributed as an npm package and runs as a standalone Node.js server.

## Quick start

```bash
npx @euraika-labs/pan-ui
```

## Deployment options

### Foreground (development / testing)

```bash
npx @euraika-labs/pan-ui
```

Runs interactively. Logs go to stdout. Ctrl+C to stop.

### Daemon (background process)

```bash
npx @euraika-labs/pan-ui --daemon
npx pan-ui status                    # Check state
npx pan-ui logs                      # Tail output
npx pan-ui stop                      # Stop cleanly
```

PID file: `~/.pan-ui/pan-ui.pid`
Log file: `~/.pan-ui/pan-ui.log`

### Systemd user service (persistent)

```bash
npx @euraika-labs/pan-ui service install
```

This creates `~/.config/systemd/user/pan-ui.service`, enables it, starts it, and enables linger so the service survives logout.

```bash
# Standard management
systemctl --user status pan-ui
systemctl --user restart pan-ui
journalctl --user -u pan-ui -f

# Remove
npx pan-ui service remove
```

### Docker

A test Dockerfile is provided at `tests/docker/Dockerfile.test`. It bundles the Hermes Agent binary, so all health checks pass inside the container.

```bash
# Build
docker build -f tests/docker/Dockerfile.test -t pan-ui .

# Run (standalone, mock mode)
docker run -p 3199:3000 -e HERMES_MOCK_MODE=true pan-ui

# Run (connect to host gateway)
docker run -p 3199:3000 \
  --add-host=host.docker.internal:host-gateway \
  -v ~/.hermes:/home/node/.hermes \
  -e HERMES_MOCK_MODE=false \
  -e HOME=/home/node \
  -e HERMES_HOME=/home/node/.hermes/profiles/<your-profile> \
  -e HERMES_API_BASE_URL=http://host.docker.internal:8642 \
  pan-ui
```

The image includes Python 3, PyYAML, and the Hermes Agent installed via `uv` from the Euraika-Labs fork at the pinned tag. The `hermes` binary is available at `/usr/local/bin/hermes`.

> **Note:** A production-optimised multi-stage Dockerfile is not yet available. The test image is suitable for development and CI.

## Configuration

Pan looks for a `.env.local` file in its package directory. The setup wizard (`npx pan-ui setup`) creates this file interactively.

| Variable | Default | Description |
|----------|---------|-------------|
| `HERMES_HOME` | `~/.hermes` | Hermes home directory |
| `HERMES_API_BASE_URL` | `http://127.0.0.1:8642` | Hermes API endpoint |
| `HERMES_API_KEY` | — | API key (if Hermes requires one) |
| `HERMES_WORKSPACE_USERNAME` | `admin` | Login username |
| `HERMES_WORKSPACE_PASSWORD` | `changeme` | Login password |
| `HERMES_WORKSPACE_SECRET` | *(auto-generated)* | Cookie signing secret |
| `HERMES_MOCK_MODE` | `false` | Use mock data when runtime is unavailable |
| `PORT` | `3199` | Server port |

### Security notes for production-like environments

- **Change the default password.** Run `npx pan-ui setup` and set a strong password.
- **Set a session secret.** The wizard generates one automatically, but you can override `HERMES_WORKSPACE_SECRET` for reproducible deployments.
- **Restrict network access.** Pan binds to `0.0.0.0` by default. Use a reverse proxy or firewall if exposing beyond localhost.
- **Protect `~/.hermes`.** Pan reads profiles, memory, skills, and session data from this directory.

## Updating

```bash
npx @euraika-labs/pan-ui@latest
```

Configuration persists in `.env.local` inside the package directory. If you're using the systemd service, restart it after updating:

```bash
systemctl --user restart pan-ui
```
