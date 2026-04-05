export const hermesConfig = {
  baseUrl: process.env.HERMES_API_BASE_URL ?? 'http://127.0.0.1:8642',
  apiKey: process.env.HERMES_API_KEY,
  timeoutMs: Number(process.env.HERMES_API_TIMEOUT_MS ?? 30000),
};
