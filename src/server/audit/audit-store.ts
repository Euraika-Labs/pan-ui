import crypto from 'node:crypto';
import type { AuditEvent } from '@/lib/types/audit';
import { ensureDb, getDbPath } from '@/server/core/db-bootstrap';
import { execPython, execPythonJson } from '@/server/core/python-exec';

const DB_PATH = getDbPath('audit');

function ensureAuditDb() {
  ensureDb('audit');
}

function nowIso() {
  return new Date().toISOString();
}

export function addAuditEvent(action: string, targetType: string, targetId: string, detail: string) {
  ensureAuditDb();
  const id = crypto.randomUUID();
  execPython(
    `import sqlite3, sys
conn=sqlite3.connect(sys.argv[1])
conn.execute("INSERT INTO audit_events (id, created_at, action, target_type, target_id, detail) VALUES (?, ?, ?, ?, ?, ?)", tuple(sys.argv[2:8]))
conn.commit()
`,
    [DB_PATH, id, nowIso(), action, targetType, targetId, detail],
  );
}

export function listAuditEvents(): AuditEvent[] {
  ensureAuditDb();
  return execPythonJson<AuditEvent[]>(
    `import sqlite3, json, sys
conn=sqlite3.connect(sys.argv[1])
conn.row_factory=sqlite3.Row
cur=conn.cursor()
cur.execute("SELECT id, created_at, action, target_type, target_id, detail FROM audit_events ORDER BY created_at DESC LIMIT 200")
print(json.dumps([{'id':r['id'],'createdAt':r['created_at'],'action':r['action'],'targetType':r['target_type'],'targetId':r['target_id'],'detail':r['detail']} for r in cur.fetchall()]))
`,
    [DB_PATH],
  );
}
