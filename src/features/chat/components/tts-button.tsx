'use client';

type TTSButtonProps = {
  text: string;
};

export function TTSButton({ text }: TTSButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        }
      }}
      className="rounded-md border border-border px-2 py-1 text-2xs text-muted-foreground"
      aria-label="Play voice"
    >
      TTS
    </button>
  );
}
