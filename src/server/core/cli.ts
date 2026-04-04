import { execFileSync } from 'node:child_process';
import { ServerBridgeError } from '@/server/core/python-exec';

export function execCli(command: string, args: string[], options?: { timeout?: number; suppressStderr?: boolean }) {
  try {
    return execFileSync(command, args, {
      encoding: 'utf-8',
      timeout: options?.timeout,
      stdio: options?.suppressStderr ? ['ignore', 'pipe', 'ignore'] : undefined,
    });
  } catch (error) {
    throw new ServerBridgeError('CLI execution failed', {
      command,
      args,
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}
