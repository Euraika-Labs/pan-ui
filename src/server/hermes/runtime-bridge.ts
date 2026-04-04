import fs from 'node:fs';
import path from 'node:path';
import { execCli } from '@/server/core/cli';
import { execPythonJson } from '@/server/core/python-exec';
import { detectHermesActiveProfileFromHome } from '@/server/hermes/profile-context';

type RuntimeSession = {
  id: string;
  title: string | null;
  preview: string | null;
  started_at: number;
  model: string | null;
};

type RuntimeStatus = {
  available: boolean;
  hermesPath?: string;
  hermesVersion?: string;
  hermesHome?: string;
  activeProfile?: string;
  configPath?: string;
  modelDefault?: string;
  provider?: string;
  memoryProvider?: string;
  mcpServers: Array<{ name: string; command?: string; url?: string }>;
  profiles: string[];
  skillsCount: number;
  sessionsCount: number;
  recentSessions: RuntimeSession[];
  userMemoryPath?: string;
  agentMemoryPath?: string;
};

function runPythonJson(script: string, args: string[] = []) {
  return execPythonJson(script, args);
}

function detectHermesPath() {
  try {
    return execCli('bash', ['-lc', 'command -v hermes']).trim();
  } catch {
    return null;
  }
}

export function getHermesHome() {
  return process.env.HERMES_HOME || path.join(process.env.HOME || '', '.hermes');
}

export function getHermesRuntimeStatus(): RuntimeStatus {
  const hermesPath = detectHermesPath();
  const hermesHome = getHermesHome();
  if (!hermesPath || !fs.existsSync(hermesHome)) {
    return { available: false, profiles: [], mcpServers: [], skillsCount: 0, sessionsCount: 0, recentSessions: [] };
  }

  const configPath = path.join(hermesHome, 'config.yaml');
  const memoriesDir = path.join(hermesHome, 'memories');
  const skillsDir = path.join(hermesHome, 'skills');
  const profilesDir = path.join(hermesHome, 'profiles');
  const stateDbPath = path.join(hermesHome, 'state.db');

  const version = (() => {
    try {
      return execCli('hermes', ['--version']).split('\n')[0].trim();
    } catch {
      return undefined;
    }
  })();

  const config = fs.existsSync(configPath)
    ? (runPythonJson(
        "import json, sys, yaml; from pathlib import Path; p=Path(sys.argv[1]); data=yaml.safe_load(p.read_text()) or {}; print(json.dumps(data))",
        [configPath],
      ) as Record<string, unknown>)
    : {};

  const detectedActive = detectHermesActiveProfileFromHome();
  const profiles = [detectedActive, ...((fs.existsSync(profilesDir) ? fs.readdirSync(profilesDir).filter((name) => fs.statSync(path.join(profilesDir, name)).isDirectory()) : []) as string[])].filter((value, index, array) => array.indexOf(value) === index);

  const recentSessions = fs.existsSync(stateDbPath)
    ? (runPythonJson(
        "import sqlite3, json, sys\nconn=sqlite3.connect(sys.argv[1])\ncur=conn.cursor()\ncur.execute(\"SELECT s.id, COALESCE(s.title, ''), s.started_at, s.model, (SELECT m.content FROM messages m WHERE m.session_id=s.id AND m.role='user' ORDER BY m.timestamp ASC LIMIT 1) FROM sessions s ORDER BY s.started_at DESC LIMIT 10\")\nrows=cur.fetchall()\nprint(json.dumps([{'id':r[0],'title':r[1] or None,'started_at':r[2],'model':r[3],'preview':(r[4][:160] if r[4] else None)} for r in rows]))",
        [stateDbPath],
      ) as RuntimeSession[])
    : [];

  const sessionsCount = fs.existsSync(stateDbPath)
    ? (runPythonJson(
        "import sqlite3, json, sys\nconn=sqlite3.connect(sys.argv[1])\ncur=conn.cursor()\ncur.execute('SELECT COUNT(*) FROM sessions')\nprint(json.dumps(cur.fetchone()[0]))",
        [stateDbPath],
      ) as number)
    : 0;

  const skillsCount = fs.existsSync(skillsDir)
    ? (runPythonJson(
        "import json, sys\nfrom pathlib import Path\nroot=Path(sys.argv[1])\ncount=sum(1 for p in root.rglob('SKILL.md'))\nprint(json.dumps(count))",
        [skillsDir],
      ) as number)
    : 0;

  const mcpServers = ((config.mcp_servers as Record<string, { command?: string; url?: string }> | undefined) || {});

  const activeProfile = detectedActive;

  return {
    available: true,
    hermesPath,
    hermesVersion: version,
    hermesHome,
    activeProfile,
    configPath,
    modelDefault: (config.model as { default?: string } | undefined)?.default,
    provider: (config.model as { provider?: string } | undefined)?.provider,
    memoryProvider: (config.memory as { provider?: string } | undefined)?.provider,
    mcpServers: Object.entries(mcpServers).map(([name, value]) => ({ name, command: value.command, url: value.url })),
    profiles,
    skillsCount,
    sessionsCount,
    recentSessions,
    userMemoryPath: path.join(memoriesDir, 'USER.md'),
    agentMemoryPath: path.join(memoriesDir, 'MEMORY.md'),
  };
}
