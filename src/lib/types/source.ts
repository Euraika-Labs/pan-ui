import type { ProvenanceLabel } from '@/lib/types/runtime-status';

export type ChatSource = {
  id: string;
  title: string;
  href?: string;
  snippet?: string;
  sourceType: 'web' | 'file' | 'workspace' | 'integration' | 'unknown';
  provenance: ProvenanceLabel;
  note?: string;
  label?: string;
};
