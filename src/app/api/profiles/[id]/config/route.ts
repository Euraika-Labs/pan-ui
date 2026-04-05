import { NextResponse } from 'next/server';
import { readProfileConfig, writeProfileConfig, type ProfileConfig } from '@/server/hermes/profile-config';
import { aiGenerateJSON } from '@/server/hermes/ai-generate';
import { addAuditEvent } from '@/server/audit/audit-store';

type Params = { params: Promise<{ id: string }> };

/** GET — read full editable config for a profile */
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const config = readProfileConfig(id);
    return NextResponse.json({ config });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 404 });
  }
}

/** PATCH — update profile config fields */
export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = (await req.json()) as { config: Partial<ProfileConfig> };
  try {
    writeProfileConfig(id, body.config);
    addAuditEvent('profile_config_updated', 'profile', id, `Updated config for profile '${id}'`);
    const config = readProfileConfig(id);
    return NextResponse.json({ config });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/** POST — AI-powered profile optimization */
export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = (await req.json()) as { purpose?: string; mode?: 'optimize' | 'create' };
  const purpose = body.purpose || '';
  const mode = body.mode || 'optimize';

  try {
    const currentConfig = readProfileConfig(id);

    const prompt = mode === 'create'
      ? buildCreatePrompt(id, purpose)
      : buildOptimizePrompt(id, purpose, currentConfig);

    const suggestion = await aiGenerateJSON<{
      config: Partial<ProfileConfig>;
      soul?: string;
      explanation: string;
    }>(prompt, {
      system: SYSTEM_PROMPT,
      temperature: 0.6,
    });

    // Merge soul into config if provided separately
    if (suggestion.soul && !suggestion.config.soul) {
      suggestion.config.soul = suggestion.soul;
    }

    return NextResponse.json({
      suggestion: suggestion.config,
      explanation: suggestion.explanation,
      currentConfig,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

const SYSTEM_PROMPT = `You are a Hermes Agent profile optimization assistant. You help users configure their AI agent profiles for optimal performance based on their intended use case.

You understand the Hermes Agent config.yaml structure deeply:
- modelDefault: the LLM model to use (e.g. "claude-sonnet-4-20250514", "gpt-4o", "claude-opus-4-20250514")
- modelProvider: provider name (e.g. "anthropic", "openai", "copilot")
- maxTurns: max autonomous tool-use turns (5-200, default 50)
- reasoningEffort: "low", "medium", "high" — controls thinking depth
- toolUseEnforcement: "required", "auto", "none"
- policyPreset: "safe-chat" (read-only), "research" (web+read), "builder" (full dev), "full-power" (no guardrails)
- toolsets: list of enabled toolsets
- terminalBackend: "local", "docker", "modal"
- displayStreaming: enable token streaming
- displayShowCost: show token costs
- displayCompact: compact output mode
- memoryEnabled: persistent agent memory
- userProfileEnabled: persistent user profile
- approvalsMode: "manual" (require approval for risky tools), "auto"
- compressionEnabled: context compression
- compressionThreshold: 0.0-1.0, when to trigger compression
- soul: the system prompt / personality definition (SOUL.md)

Return JSON with this exact structure:
{
  "config": { ...only the fields you recommend changing... },
  "soul": "...optional SOUL.md content if you recommend changing it...",
  "explanation": "A concise explanation of what you changed and why, in 2-4 sentences."
}`;

function buildOptimizePrompt(profileId: string, purpose: string, current: ProfileConfig): string {
  return `Optimize the Hermes Agent profile "${profileId}" for the following purpose:

${purpose ? `User's stated purpose: "${purpose}"` : 'The user wants general optimization for better performance.'}

Current configuration:
${JSON.stringify(current, null, 2)}

Analyze the current config and suggest improvements. Consider:
1. Is the model appropriate for the use case?
2. Are the agent settings (maxTurns, reasoningEffort) well-tuned?
3. Is the policy preset appropriate?
4. Should memory/compression settings be adjusted?
5. Would a better SOUL.md (system prompt) help?
6. Are there settings that should be enabled/disabled?

Only include fields you want to change. Don't repeat settings that are already good.`;
}

function buildCreatePrompt(profileId: string, purpose: string): string {
  return `Create an optimal Hermes Agent profile configuration for a new profile named "${profileId}".

${purpose ? `Purpose: "${purpose}"` : 'General-purpose AI assistant profile.'}

Generate a complete recommended configuration including:
1. Appropriate model selection
2. Agent behavior settings (maxTurns, reasoningEffort)
3. Policy preset that matches the use case
4. Memory and compression settings
5. A tailored SOUL.md system prompt that defines the agent's personality and behavior for this use case

Be specific and opinionated — give the best config for this purpose, not generic defaults.`;
}
