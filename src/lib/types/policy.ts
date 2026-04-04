export type PolicyPreset = 'safe-chat' | 'research' | 'builder' | 'full-power';

export type ApprovalRequest = {
  id: string;
  summary: string;
  riskClass: string;
  policyPreset: PolicyPreset;
};
