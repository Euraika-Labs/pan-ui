'use client';

type SessionSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SessionSearch({ value, onChange }: SessionSearchProps) {
  return (
    <div className="border-b border-border/70 px-4 pb-3 pt-1">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search sessions…"
        className="w-full rounded-2xl border border-border/70 bg-background/85 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
