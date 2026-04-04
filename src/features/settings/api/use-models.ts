'use client';

export type ModelOption = {
  id: string;
  label: string;
  provider: string;
};

export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'Hermes 3 405B', label: 'Hermes 3 405B', provider: 'mock-runtime' },
  { id: 'Hermes 3 70B', label: 'Hermes 3 70B', provider: 'mock-runtime' },
  { id: 'Hermes Fast', label: 'Hermes Fast', provider: 'mock-runtime' },
];
