'use client';

import { useEffect, useState } from 'react';
import { Bot, Loader2, Save, Sparkles, X, Undo2 } from 'lucide-react';
import { useProfileConfig, useUpdateProfileConfig, useAiOptimizeProfile } from '@/features/profiles/api/use-profiles';
import type { ProfileConfig } from '@/lib/types/profile';

type Props = {
  profileId: string;
  profileName: string;
  open: boolean;
  onClose: () => void;
};

const POLICY_OPTIONS = [
  { value: 'safe-chat', label: 'Safe Chat', desc: 'Read-only tools, no filesystem writes' },
  { value: 'research', label: 'Research', desc: 'Web access, read files, no installs' },
  { value: 'builder', label: 'Builder', desc: 'Full dev workflow, approval for risky ops' },
  { value: 'full-power', label: 'Full Power', desc: 'All tools enabled, no guardrails' },
] as const;

const REASONING_OPTIONS = ['low', 'medium', 'high'] as const;
const TERMINAL_BACKENDS = ['local', 'docker', 'modal'] as const;
const APPROVAL_MODES = ['manual', 'auto'] as const;

export function ProfileEditorDialog({ profileId, profileName, open, onClose }: Props) {
  const configQuery = useProfileConfig(open ? profileId : null);
  const updateConfig = useUpdateProfileConfig();
  const aiOptimize = useAiOptimizeProfile();

  const [draft, setDraft] = useState<Partial<ProfileConfig>>({});
  const [aiPurpose, setAiPurpose] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiPending, setAiPending] = useState<Partial<ProfileConfig> | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'model' | 'agent' | 'display' | 'soul'>('model');

  // Reset draft when config loads
  useEffect(() => {
    if (configQuery.data) {
      setDraft({ ...configQuery.data });
      setAiPending(null);
      setAiExplanation('');
    }
  }, [configQuery.data]);

  if (!open) return null;

  function updateField<K extends keyof ProfileConfig>(key: K, value: ProfileConfig[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    await updateConfig.mutateAsync({ profileId, config: draft });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleAiOptimize() {
    const result = await aiOptimize.mutateAsync({ profileId, purpose: aiPurpose, mode: 'optimize' });
    setAiPending(result.suggestion);
    setAiExplanation(result.explanation);
  }

  function applyAiSuggestion() {
    if (!aiPending) return;
    setDraft((prev) => ({ ...prev, ...aiPending }));
    setAiPending(null);
  }

  function dismissAiSuggestion() {
    setAiPending(null);
    setAiExplanation('');
  }

  const tabs = [
    { id: 'model' as const, label: 'Model & Provider' },
    { id: 'agent' as const, label: 'Agent Behavior' },
    { id: 'display' as const, label: 'Display & Memory' },
    { id: 'soul' as const, label: 'Soul / Persona' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Edit Profile — {profileName}</h2>
            <p className="text-sm text-muted-foreground">config.yaml + SOUL.md</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        {/* AI Optimize bar */}
        <div className="border-b border-border bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 px-6 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <input
              type="text"
              value={aiPurpose}
              onChange={(e) => setAiPurpose(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !aiOptimize.isPending) void handleAiOptimize(); }}
              placeholder="Describe what this profile is for… (e.g. 'coding assistant for React projects')"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <button
              type="button"
              onClick={() => void handleAiOptimize()}
              disabled={aiOptimize.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-purple-500 disabled:opacity-50"
            >
              {aiOptimize.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bot className="h-3 w-3" />}
              {aiOptimize.isPending ? 'Thinking…' : 'AI Optimize'}
            </button>
          </div>
        </div>

        {/* AI Suggestion banner */}
        {aiPending && (
          <div className="border-b border-purple-500/20 bg-purple-500/10 px-6 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-300">
                  <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                  AI Suggestion Ready
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{aiExplanation}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.keys(aiPending).map((key) => (
                    <span key={key} className="rounded-md bg-purple-500/20 px-2 py-0.5 text-3xs font-medium text-purple-300">
                      {key}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={applyAiSuggestion} className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-500">
                  <Sparkles className="h-3 w-3" /> Apply
                </button>
                <button type="button" onClick={dismissAiSuggestion} className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
                  <Undo2 className="h-3 w-3" /> Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border px-6 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {configQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {activeTab === 'model' && (
                <div className="space-y-5">
                  <FieldGroup label="Default Model" hint="e.g. claude-sonnet-4-20250514, gpt-4o, claude-opus-4-20250514">
                    <input type="text" value={draft.modelDefault ?? ''} onChange={(e) => updateField('modelDefault', e.target.value)} className="field-input" />
                  </FieldGroup>
                  <FieldGroup label="Provider" hint="e.g. anthropic, openai, copilot, ollama">
                    <input type="text" value={draft.modelProvider ?? ''} onChange={(e) => updateField('modelProvider', e.target.value)} className="field-input" />
                  </FieldGroup>
                  <FieldGroup label="Base URL" hint="Custom API endpoint (leave empty for default)">
                    <input type="text" value={draft.modelBaseUrl ?? ''} onChange={(e) => updateField('modelBaseUrl', e.target.value)} className="field-input" placeholder="https://..." />
                  </FieldGroup>
                  <FieldGroup label="Policy Preset">
                    <div className="grid grid-cols-2 gap-2">
                      {POLICY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField('policyPreset', opt.value)}
                          className={`rounded-xl border p-3 text-left transition ${
                            draft.policyPreset === opt.value
                              ? 'border-primary bg-primary/10 text-foreground'
                              : 'border-border text-muted-foreground hover:border-primary/40'
                          }`}
                        >
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="mt-0.5 text-2xs text-muted-foreground">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </FieldGroup>
                </div>
              )}

              {activeTab === 'agent' && (
                <div className="space-y-5">
                  <FieldGroup label="Max Turns" hint="Maximum autonomous tool-use turns (5–200)">
                    <input type="number" min={5} max={200} value={draft.maxTurns ?? 50} onChange={(e) => updateField('maxTurns', Number(e.target.value))} className="field-input w-32" />
                  </FieldGroup>
                  <FieldGroup label="Reasoning Effort">
                    <div className="flex gap-2">
                      {REASONING_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateField('reasoningEffort', opt)}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition ${
                            draft.reasoningEffort === opt ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary/40'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </FieldGroup>
                  <FieldGroup label="Tool Use Enforcement">
                    <select value={draft.toolUseEnforcement ?? 'auto'} onChange={(e) => updateField('toolUseEnforcement', e.target.value)} className="field-input w-48">
                      <option value="auto">Auto</option>
                      <option value="required">Required</option>
                      <option value="none">None</option>
                    </select>
                  </FieldGroup>
                  <FieldGroup label="Terminal Backend">
                    <div className="flex gap-2">
                      {TERMINAL_BACKENDS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateField('terminalBackend', opt)}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition ${
                            draft.terminalBackend === opt ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary/40'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </FieldGroup>
                  <FieldGroup label="Approvals Mode">
                    <div className="flex gap-2">
                      {APPROVAL_MODES.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateField('approvalsMode', opt)}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition ${
                            draft.approvalsMode === opt ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary/40'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </FieldGroup>
                  <FieldGroup label="Terminal Timeout" hint="Seconds before terminal commands time out">
                    <input type="number" min={10} max={600} value={draft.terminalTimeout ?? 180} onChange={(e) => updateField('terminalTimeout', Number(e.target.value))} className="field-input w-32" />
                  </FieldGroup>
                </div>
              )}

              {activeTab === 'display' && (
                <div className="space-y-5">
                  <FieldGroup label="Display Options">
                    <div className="space-y-3">
                      <Toggle label="Streaming" desc="Stream tokens as they're generated" checked={draft.displayStreaming ?? true} onChange={(v) => updateField('displayStreaming', v)} />
                      <Toggle label="Compact Mode" desc="Reduce visual whitespace" checked={draft.displayCompact ?? false} onChange={(v) => updateField('displayCompact', v)} />
                      <Toggle label="Show Cost" desc="Display token costs after each response" checked={draft.displayShowCost ?? false} onChange={(v) => updateField('displayShowCost', v)} />
                    </div>
                  </FieldGroup>
                  <FieldGroup label="Display Personality" hint="Named personality preset">
                    <input type="text" value={draft.displayPersonality ?? ''} onChange={(e) => updateField('displayPersonality', e.target.value)} className="field-input" placeholder="default" />
                  </FieldGroup>
                  <FieldGroup label="Memory">
                    <div className="space-y-3">
                      <Toggle label="Agent Memory" desc="Persistent notes about the environment and workflows" checked={draft.memoryEnabled ?? true} onChange={(v) => updateField('memoryEnabled', v)} />
                      <Toggle label="User Profile" desc="Remember user preferences and personal details" checked={draft.userProfileEnabled ?? true} onChange={(v) => updateField('userProfileEnabled', v)} />
                    </div>
                  </FieldGroup>
                  <FieldGroup label="Context Compression">
                    <div className="space-y-3">
                      <Toggle label="Compression" desc="Compress old context to save tokens" checked={draft.compressionEnabled ?? true} onChange={(v) => updateField('compressionEnabled', v)} />
                      {draft.compressionEnabled !== false && (
                        <div>
                          <label className="text-xs text-muted-foreground">Threshold: {draft.compressionThreshold ?? 0.7}</label>
                          <input
                            type="range"
                            min={0.1}
                            max={1.0}
                            step={0.05}
                            value={draft.compressionThreshold ?? 0.7}
                            onChange={(e) => updateField('compressionThreshold', Number(e.target.value))}
                            className="mt-1 w-full accent-primary"
                          />
                          <div className="flex justify-between text-3xs text-muted-foreground">
                            <span>Aggressive</span>
                            <span>Conservative</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </FieldGroup>
                </div>
              )}

              {activeTab === 'soul' && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
                    <strong className="text-foreground">SOUL.md</strong> defines the agent&apos;s personality, values, and behavioral boundaries. This is the system prompt that shapes every interaction.
                  </div>
                  <textarea
                    value={draft.soul ?? ''}
                    onChange={(e) => updateField('soul', e.target.value)}
                    className="min-h-72 w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-6 outline-none focus:border-primary"
                    placeholder="You are Pan, an AI workspace assistant by Euraika..."
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div className="text-sm text-muted-foreground">
            {saved && <span className="text-emerald-400">✓ Saved to config.yaml</span>}
            {updateConfig.isPending && <span>Saving…</span>}
            {updateConfig.isError && <span className="text-red-400">Failed to save</span>}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">Cancel</button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={updateConfig.isPending}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Subcomponents ──

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {hint && <p className="mb-2 text-xs text-muted-foreground">{hint}</p>}
      {!hint && <div className="mb-2" />}
      {children}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-3 transition hover:bg-muted/30">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-2xs text-muted-foreground">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
      </button>
    </label>
  );
}
