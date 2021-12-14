import {
  SysdigAccount,
  SysdigResult,
  SysdigTeam,
  SysdigUser,
} from '../src/types';

export function getMockAccount(
  partial?: Partial<SysdigAccount>,
): SysdigAccount {
  return {
    name: 'user@email.com',
    teamRoles: [
      {
        teamId: 10006123,
        teamName: 'Monitor Operations',
        teamTheme: '#7BB0B2',
        userId: 10006755,
        userName: 'user@email.com',
        role: 'ROLE_TEAM_MANAGER',
        admin: true,
      },
    ],
    ...getMockUser(partial),
    ...partial,
  };
}

export function getMockUser(partial?: Partial<SysdigUser>): SysdigUser {
  return {
    id: 10001234,
    version: 2,
    username: 'user@email.dev',
    enabled: true,
    systemRole: 'ROLE_CUSTOMER',
    firstName: 'John',
    lastName: 'Doe',
    lastSeenOnSecure: 1636466812758,
    dateCreated: 1636399070571,
    status: 'confirmed',
    products: ['SDC', 'SDS'],
    ...partial,
  };
}

export function getMockTeam(partial?: Partial<SysdigTeam>): SysdigTeam {
  return {
    id: 10012321,
    version: 1,
    dateCreated: 1636399070709,
    lastUpdated: 1636399070379,
    customerId: 1001111,
    immutable: true,
    name: 'Secure Operations',
    theme: '#7BB0B2',
    description: 'Immutable Secure team with full visibility',
    show: 'host',
    origin: 'SYSDIG',
    canUseSysdigCapture: true,
    canUseAgentCli: true,
    canUseCustomEvents: true,
    canUseAwsMetrics: true,
    canUseBeaconMetrics: true,
    canUseRapidResponse: false,
    defaultTeamRole: 'ROLE_TEAM_EDIT',
    userCount: 2,
    entryPoint: {
      module: 'Explore',
    },
    products: ['SDS'],
    default: true,
  };
}

export function getMockImageScan(partial?: Partial<SysdigTeam>): SysdigResult {
  return {
    analysisStatus: 'analyzed',
    analyzedAt: 1638870815,
    createdAt: 1638870765,
    fullTag: 'quay.io/bitnami/nginx:latest',
    imageDigest:
      'sha256:253a0fef1f5b8baaa691fcfd8a437d800ff91186fb62e19b56ff6b0de5a50355',
    imageId: '29616510799237b94b21e67dbf112411ccea244ed875cd54370d2167ec62b05d',
    parentDigest:
      'sha256:253a0fef1f5b8baaa691fcfd8a437d800ff91186fb62e19b56ff6b0de5a50355',
    tagDetectedAt: 1638870765,
    registry: 'quay.io',
    repository: 'bitnami/nginx',
    tag: 'latest',
    origin: 'sysdig-secure-ui',
    policyStatus: 'WARN',
  };
}
