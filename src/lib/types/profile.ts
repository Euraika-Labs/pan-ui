export type Profile = {
  id: string;
  name: string;
  modelDefault?: string;
  policyPreset?: 'safe-chat' | 'research' | 'builder' | 'full-power';
  sessionCount?: number;
  skillCount?: number;
  extensionCount?: number;
  active?: boolean;
};
