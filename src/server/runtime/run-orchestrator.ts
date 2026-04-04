import crypto from 'node:crypto';
import { ensureDb, getDbPath } from '@/server/core/db-bootstrap';
import { execPython, execPythonJson } from '@/server/core/python-exec';

type RunStatus = 'queued' | 'running' | 'waiting_approval' | 'completed' | 'failed' | 'cancelled';

const DB_PATH = getDbPath('runtime');

function py(script: string, args: string[] = []) {
  ensureDb('runtime');
  return execPython(script, [DB_PATH, ...args]);
}

function pyJson<T>(script: string, args: string[] = []) {
  ensureDb('runtime');
  return execPythonJson<T>(script, [DB_PATH, ...args]);
}

export function createRun(sessionId: string, source = 'webui-stream') {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  py(
    `import sqlite3, sys
conn=sqlite3.connect(sys.argv[1])
conn.execute("INSERT INTO runs (id, session_id, status, source, started_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)", tuple(sys.argv[2:8]))
conn.commit()
`,
    [id, sessionId, 'queued', source, now, now],
  );
  return { id, sessionId, status: 'queued' as RunStatus, source, startedAt: now, updatedAt: now };
}

export function updateRunStatus(runId: string, status: RunStatus, lastError?: string) {
  const now = new Date().toISOString();
  py(
    `import sqlite3, sys
conn=sqlite3.connect(sys.argv[1])
finished = sys.argv[5] if sys.argv[3] in ('completed','failed','cancelled') else None
conn.execute("UPDATE runs SET status=?, updated_at=?, last_error=?, finished_at=COALESCE(?, finished_at) WHERE id=?", (sys.argv[3], sys.argv[4], sys.argv[6] or None, finished, sys.argv[2]))
conn.commit()
`,
    [runId, status, now, now, lastError || ''],
  );
}

export function getRun(runId: string) {
  return pyJson<Record<string, string | null> | null>(
    `import sqlite3, json, sys
conn=sqlite3.connect(sys.argv[1])
conn.row_factory=sqlite3.Row
cur=conn.cursor()
cur.execute("SELECT id, session_id, status, source, started_at, updated_at, finished_at, last_error FROM runs WHERE id=?", (sys.argv[2],))
r=cur.fetchone()
print(json.dumps(dict(r) if r else None))
`,
    [runId],
  );
}

export function listRuns(sessionId?: string) {
  return pyJson<Array<Record<string, string | null>>>(
    `import sqlite3, json, sys
conn=sqlite3.connect(sys.argv[1])
conn.row_factory=sqlite3.Row
cur=conn.cursor()
if len(sys.argv) > 2 and sys.argv[2]:
    cur.execute("SELECT id, session_id, status, source, started_at, updated_at, finished_at, last_error FROM runs WHERE session_id=? ORDER BY started_at DESC", (sys.argv[2],))
else:
    cur.execute("SELECT id, session_id, status, source, started_at, updated_at, finished_at, last_error FROM runs ORDER BY started_at DESC")
print(json.dumps([dict(r) for r in cur.fetchall()]))
`,
    sessionId ? [sessionId] : [],
  );
}
