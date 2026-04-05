import type {
  ExtensionApprovalPolicy,
  ExtensionAuthState,
  ExtensionGovernanceState,
  ExtensionProvenance,
  ExtensionRiskLevel,
} from '@/lib/types/extension';
import type { SkillProvenance, SkillScope } from '@/lib/types/skill';

export function describeSkillScope(scope: SkillScope, ownerProfileId?: string | null) {
  if (scope === 'builtin') return 'Built in for every workspace';
  if (scope === 'global') return 'Installed for all profiles';
  return ownerProfileId ? `Profile scoped · ${ownerProfileId}` : 'Profile scoped';
}

export function describeSkillProvenance(provenance: SkillProvenance) {
  switch (provenance) {
    case 'built-in':
      return 'Official';
    case 'verified':
      return 'Verified';
    case 'custom':
      return 'Community';
    case 'local-process':
      return 'Local';
    default:
      return provenance;
  }
}

export function describeExtensionProvenance(provenance?: ExtensionProvenance | null) {
  switch (provenance) {
    case 'built-in':
      return 'Official';
    case 'verified':
      return 'Verified';
    case 'custom':
      return 'Community';
    case 'self-hosted':
      return 'Self-hosted';
    case 'local-process':
      return 'Local process';
    default:
      return 'Unknown source';
  }
}

export function describeRiskLevel(risk: ExtensionRiskLevel) {
  switch (risk) {
    case 'read':
    case 'low':
      return 'Low risk';
    case 'write':
    case 'medium':
      return 'Writes data';
    case 'execute':
      return 'Executes commands';
    case 'admin':
    case 'high':
      return 'High privilege';
    default:
      return risk;
  }
}

export function describeAuthState(authState?: ExtensionAuthState) {
  const value = String(authState ?? 'unknown');

  if (value === 'needs-auth') return 'Needs auth';
  if (value === 'expired') return 'Auth expired';
  if (value === 'none') return 'No auth required';
  if (value === 'unknown') return 'Auth unknown';
  return 'Auth connected';
}

export function describeGovernance(governance?: ExtensionGovernanceState) {
  switch (governance) {
    case 'enabled':
      return 'Enabled by policy';
    case 'blocked':
      return 'Blocked by policy';
    case 'approval-gated':
      return 'Approval required';
    case 'policy-limited':
      return 'Policy limited';
    default:
      return 'Governance unknown';
  }
}

export function describeApprovalPolicy(policy?: ExtensionApprovalPolicy) {
  switch (policy) {
    case 'auto':
      return 'Auto approve';
    case 'on-request':
      return 'On request';
    case 'always':
      return 'Always ask';
    default:
      return 'Policy inherited';
  }
}

export function describeCapabilityScope(scope: 'global' | 'profile' | 'session') {
  switch (scope) {
    case 'global':
      return 'Visible to every profile';
    case 'profile':
      return 'Visible only in this profile';
    case 'session':
      return 'Loaded only in the active session';
    default:
      return scope;
  }
}
