import { SysdigAccount, SysdigTeam, SysdigUser } from '../src/types';

export function getMockAccount(
  partial?: Partial<SysdigAccount>,
): SysdigAccount {
  return {
    username: 'user@email.com',
    firstName: 'Test',
    lastName: 'User',
    name: 'user@email.com',
    id: 10006755,
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
