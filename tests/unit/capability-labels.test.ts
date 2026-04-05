import { describe, expect, it } from 'vitest';
import {
  describeApprovalPolicy,
  describeAuthState,
  describeCapabilityScope,
  describeExtensionProvenance,
  describeGovernance,
  describeRiskLevel,
  describeSkillProvenance,
  describeSkillScope,
} from '@/lib/presentation/capability-labels';

describe('capability labels', () => {
  it('formats skill scope and provenance labels', () => {
    expect(describeSkillScope('builtin')).toBe('Built in for every workspace');
    expect(describeSkillScope('profile', 'research')).toBe('Profile scoped · research');
    expect(describeSkillProvenance('built-in')).toBe('Official');
    expect(describeSkillProvenance('custom')).toBe('Community');
  });

  it('formats extension trust and risk labels', () => {
    expect(describeExtensionProvenance('local-process')).toBe('Local process');
    expect(describeRiskLevel('execute')).toBe('Executes commands');
    expect(describeRiskLevel('medium')).toBe('Writes data');
    expect(describeGovernance('approval-gated')).toBe('Approval required');
  });

  it('formats auth, approval, and capability scope labels', () => {
    expect(describeAuthState('needs-auth')).toBe('Needs auth');
    expect(describeAuthState('unknown')).toBe('Auth unknown');
    expect(describeApprovalPolicy('always')).toBe('Always ask');
    expect(describeCapabilityScope('session')).toBe('Loaded only in the active session');
  });
});
