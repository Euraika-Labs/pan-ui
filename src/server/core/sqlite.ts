import { execPythonJson } from '@/server/core/python-exec';

export function readSqliteJson<T>(dbPath: string, pythonBody: string): T {
  const script = `import sqlite3, json, sys\nconn = sqlite3.connect(sys.argv[1])\nconn.row_factory = sqlite3.Row\ncur = conn.cursor()\n${pythonBody}`;
  return execPythonJson<T>(script, [dbPath]);
}
