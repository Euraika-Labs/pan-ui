'use client';

type SessionSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SessionSearch({ value, onChange }: SessionSearchProps) {
  return (
    <div className="border-b border-border p-4 pb-3">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search sessions…"
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
      />
    </div>
  );
}
