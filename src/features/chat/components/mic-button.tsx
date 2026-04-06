'use client';

type MicButtonProps = {
  disabled?: boolean;
  onTranscript: (text: string) => void;
};

export function MicButton({ disabled, onTranscript }: MicButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onTranscript('Voice input captured from mock microphone control.')}
      className="rounded-lg border border-border/70 bg-background/80 px-3 py-2 text-sm font-medium text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Voice input"
    >
      Mic
    </button>
  );
}
