'use client';

import { useEffect, useMemo, useState } from 'react';

type SkillEditorProps = {
  content: string;
  readOnly?: boolean;
  targetPath?: string;
  scopeLabel?: string;
  onSave: (content: string) => Promise<void> | void;
};

export function SkillEditor({ content, readOnly, targetPath, scopeLabel, onSave }: SkillEditorProps) {
  const [value, setValue] = useState(content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(content);
  }, [content]);

  const changed = value !== content;
  const lineCount = useMemo(() => value.split('\n').length, [value]);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
        <p><strong>Edit mode:</strong> {readOnly ? 'Read-only until copied into profile scope.' : 'Saving writes the local SKILL.md file directly.'}</p>
        {scopeLabel ? <p className="mt-1"><strong>Target scope:</strong> {scopeLabel}</p> : null}
        {targetPath ? <p className="mt-1 break-all"><strong>Target path:</strong> {targetPath}</p> : null}
        <p className="mt-1"><strong>Validation:</strong> YAML frontmatter and body content are checked before save.</p>
      </div>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        readOnly={readOnly}
        className="min-h-72 w-full rounded-2xl border border-border bg-card p-4 font-mono text-sm outline-none focus:border-primary"
      />
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">{lineCount} lines {changed ? '· unsaved changes' : '· no local changes'}</p>
        <button
          type="button"
          onClick={async () => {
            setSaving(true);
            try {
              await onSave(value);
            } finally {
              setSaving(false);
            }
          }}
          disabled={readOnly || !changed || saving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save skill'}
        </button>
      </div>
    </div>
  );
}
