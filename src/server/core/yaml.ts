import fs from 'node:fs';
import YAML from 'yaml';

export function readYamlFile<T = Record<string, unknown>>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    return {} as T;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return (YAML.parse(raw) || {}) as T;
}

export function writeYamlFile(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, YAML.stringify(data), 'utf-8');
}
