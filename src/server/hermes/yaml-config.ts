import YAML from 'yaml';
export { readYamlFile, writeYamlFile } from '@/server/core/yaml';

export function parseYamlFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const normalized = content.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---\n')) {
    return { frontmatter: {}, body: normalized };
  }

  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) {
    throw new Error('YAML frontmatter must end with a closing --- delimiter.');
  }

  const raw = normalized.slice(4, end).trim();
  const frontmatter = raw ? ((YAML.parse(raw) as Record<string, unknown> | null) ?? {}) : {};
  const body = normalized.slice(end + 5);
  return { frontmatter, body };
}

export function validateSkillContent(content: string) {
  const normalized = content.trim();
  if (!normalized) {
    throw new Error('Skill content cannot be empty.');
  }

  const { frontmatter, body } = parseYamlFrontmatter(content);
  if (Object.keys(frontmatter).length > 0) {
    const description = frontmatter.description;
    if (description !== undefined && typeof description !== 'string') {
      throw new Error('Skill frontmatter field "description" must be a string.');
    }

    const tools = frontmatter.tools;
    if (tools !== undefined && !Array.isArray(tools)) {
      throw new Error('Skill frontmatter field "tools" must be a list when provided.');
    }
  }

  if (!body.trim()) {
    throw new Error('Skill body cannot be empty after YAML frontmatter.');
  }
}
