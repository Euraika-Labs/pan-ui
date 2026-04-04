'use client';

import { useEffect, useState } from 'react';

type SkillEditorProps = {
  content: string;
  readOnly?: boolean;
  onSave: (content: string) => Promise<void> | void;
};

export function SkillEditor({ content, readOnly, onSave }: SkillEditorProps) {
  const [value, setValue] = useState(content);

  useEffect(() => {
    setValue(content);
  }, [content]);

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        readOnly={readOnly}
        className="min-h-72 w-full rounded-2xl border border-border bg-card p-4 font-mono text-sm outline-none focus:border-primary"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {readOnly ? 'Bundled skills are view-only in this mock implementation.' : 'Edit the skill source directly and save changes.'}
        </p>
        <button
          type="button"
          onClick={() => void onSave(value)}
          disabled={readOnly}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save skill
        </button>
      </div>
    </div>
  );
}
