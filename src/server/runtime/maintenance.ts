import { getDbPath, ensureDb } from '@/server/core/db-bootstrap';
import { execPythonJson } from '@/server/core/python-exec';

type CleanupResult = {
  removedSessions: number;
  updatedRuns: number;
};

const RUNTIME_DB = getDbPath('runtime');

export function cleanupStaleRuns(hours = 1) {
  ensureDb('runtime');
  return execPythonJson<number>(
    `import sqlite3, json, sys, datetime
conn=sqlite3.connect(sys.argv[1])
cutoff = (datetime.datetime.utcnow() - datetime.timedelta(hours=float(sys.argv[2]))).isoformat() + 'Z'
cur=conn.cursor()
cur.execute("UPDATE runs SET status='failed', last_error=COALESCE(last_error, 'Marked stale by maintenance'), finished_at=COALESCE(finished_at, ?), updated_at=? WHERE status IN ('queued','running','waiting_approval') AND updated_at < ?", (cutoff, cutoff, cutoff))
conn.commit()
print(json.dumps(cur.rowcount))
`,
    [RUNTIME_DB, String(hours)],
  );
}

export function cleanupGeneratedSessions(stateDbPath: string) {
  return execPythonJson<number>(
    `import sqlite3, json, sys
conn=sqlite3.connect(sys.argv[1])
cur=conn.cursor()
cur.execute("SELECT id FROM sessions WHERE title LIKE 'New chat %'")
ids=[r[0] for r in cur.fetchall()]
for sid in ids:
    cur.execute("DELETE FROM messages WHERE session_id=?", (sid,))
    cur.execute("DELETE FROM sessions WHERE id=?", (sid,))
conn.commit()
print(json.dumps(len(ids)))
`,
    [stateDbPath],
  );
}

export function runTrustCleanup(stateDbPath: string) {
  const removedSessions = cleanupGeneratedSessions(stateDbPath);
  const updatedRuns = cleanupStaleRuns(1);
  return { removedSessions, updatedRuns } satisfies CleanupResult;
}
