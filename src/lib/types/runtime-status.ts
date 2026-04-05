export type ConnectivityStatus = 'healthy' | 'degraded' | 'unreachable';
export type AuthStatus = 'connected' | 'needs-auth' | 'expired';
export type GovernanceStatus = 'enabled' | 'blocked' | 'approval-gated' | 'policy-limited';
export type RiskLevel = 'read' | 'write' | 'execute' | 'admin';
export type ProvenanceLabel = 'built-in' | 'verified' | 'custom' | 'self-hosted' | 'local-process';

export type StatusTone = 'success' | 'warning' | 'danger' | 'muted' | 'accent';

export function connectivityTone(status: ConnectivityStatus): StatusTone {
  switch (status) {
    case 'healthy':
      return 'success';
    case 'degraded':
      return 'warning';
    case 'unreachable':
      return 'danger';
  }
}

export function authTone(status: AuthStatus): StatusTone {
  switch (status) {
    case 'connected':
      return 'success';
    case 'needs-auth':
      return 'warning';
    case 'expired':
      return 'danger';
  }
}

export function governanceTone(status: GovernanceStatus): StatusTone {
  switch (status) {
    case 'enabled':
      return 'success';
    case 'approval-gated':
      return 'warning';
    case 'policy-limited':
      return 'muted';
    case 'blocked':
      return 'danger';
  }
}

export function riskTone(level: RiskLevel): StatusTone {
  switch (level) {
    case 'read':
      return 'muted';
    case 'write':
      return 'warning';
    case 'execute':
      return 'accent';
    case 'admin':
      return 'danger';
  }
}

export function provenanceTone(label: ProvenanceLabel): StatusTone {
  switch (label) {
    case 'built-in':
    case 'verified':
      return 'success';
    case 'custom':
      return 'warning';
    case 'self-hosted':
    case 'local-process':
      return 'accent';
  }
}

export function normalizeExtensionHealth(value: string): ConnectivityStatus | AuthStatus | GovernanceStatus {
  switch (value) {
    case 'healthy':
      return 'healthy';
    case 'needs_configuration':
      return 'needs-auth';
    case 'auth_expired':
      return 'expired';
    case 'disabled_by_policy':
      return 'policy-limited';
    case 'incompatible':
    case 'test_failed':
    default:
      return 'degraded';
  }
}

export function humanizeStatus(value: string) {
  return value.replaceAll('_', ' ');
}
