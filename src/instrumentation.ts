/**
 * Next.js Instrumentation — runs once when the server starts.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  // Only run on the server, not during build or edge runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { ensureGateway, startHealthMonitor } = await import(
      '@/server/hermes/gateway-manager'
    );

    await ensureGateway();
    startHealthMonitor();
  }
}
