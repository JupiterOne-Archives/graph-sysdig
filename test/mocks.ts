import {
  ImageScanV2,
  Policy,
  PolicyEvaluation,
  SysdigAccount,
  SysdigResult,
  SysdigTeam,
  SysdigUser,
  VulnerablePackage,
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

export function getMockImageScanV2(
  partial?: Partial<ImageScanV2>,
): ImageScanV2 {
  return {
    id: '17144f2f45c295bc2fdcae5db51044ca',
    storedAt: '2022-09-13T03:53:46.858993084Z',
    type: 'dockerImage',
    metadata: {
      imageId:
        'sha256:43d28810c1b4c28a1be3bac8e0e40fcc472b2bfcfcda952544ed99cb874d2b1a',
      pullString: 'debian',
      baseOS: 'debian 11.5',
      digest:
        'debian@sha256:73060f9fdf46e142b63fddde45759f12aea093156445c32ab667338d0563f5c4',
      createdAt: '2022-09-13T00:56:19.369186372Z',
      author: '',
      size: 129313792,
      os: 'linux',
      architecture: 'amd64',
      labels: null,
      layersCount: 1,
    },
    labels: null,
    vulnsBySev: [
      {
        totalCount: 1,
        fixableCount: 1,
      },
    ],
    packageCount: 96,
    packageTypes: ['os'],
    fixablePackages: [],
    runningFixablePackages: null,
    policyEvaluations: [
      {
        id: '17144f2f45c295bc9785414e83306ba9',
        name: 'Sysdig Best Practices',
        identifier: 'sysdig_best_practices',
        policyType: 'alwaysApply',
        evaluationResult: 'failed',
        failuresCount: {
          imageConfigCreationDate: 0,
          imageConfigDefaultUser: 0,
          imageConfigEnvVariable: 0,
          imageConfigInstructionIsPkgManager: 0,
          imageConfigInstructionNotRecommended: 0,
          imageConfigLabel: 0,
          imageConfigSensitiveInformationAndSecrets: 0,
          vulnDenyList: 0,
          vulnSeverityAndThreats: 2,
        },
        creationTimestamp: '2022-09-02T11:58:59.03062Z',
        updateTimestamp: '2022-09-02T11:58:59.03062Z',
      },
    ],
    isEVEEnabled: false,
  };
}

export function getMockFinding(
  partial?: Partial<VulnerablePackage>,
): VulnerablePackage {
  return {
    id: '17140adb60b1639af116c091e3277af6',
    vuln: {
      name: 'CVE-2022-1587',
      severity: {
        reporter: {
          name: 'nvd',
          url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-1587',
        },
        value: 2,
      },
      cvssScore: {
        reporter: {
          name: 'nvd',
          url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-1587',
        },
        value: {
          version: '3.1',
          score: 9.1,
          vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:H',
        },
      },
      additionalCVSSScores: [
        {
          reporter: {
            name: 'nvd',
            url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-1587',
          },
          value: {
            version: '2.0',
            score: 6.4,
            vector: 'AV:N/AC:L/Au:N/C:P/I:N/A:P',
          },
        },
        {
          reporter: {
            name: 'vulndb',
            url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-1587',
          },
          value: {
            version: '3.0',
            score: 8.2,
            vector: 'CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:H',
          },
        },
      ],
      exploitable: false,
      exploit: null,
      description: 'test',
      disclosureDate: '2022-03-26T00:00:00Z',
      solutionDate: '2022-04-15T00:00:00Z',
    },
    package: {
      id: '17140adb60b1639ad35b4c1a76a5fba9',
      name: 'libpcre2-8-0',
      version: '10.36-2',
      type: 'os',
      path: '/var/lib/dpkg/status',
      running: true,
    },
    fixedInVersion: '10.36-2+deb11u1',
    ...partial,
  };
}

export function getMockPolicyEvaluation(
  partial?: Partial<PolicyEvaluation>,
): PolicyEvaluation {
  return {
    id: '17144f2f45c295bc9785414e83306ba9',
    name: 'Sysdig Best Practices',
    identifier: 'sysdig_best_practices',
    policyType: 'alwaysApply',
    evaluationResult: 'failed',
    failuresCount: {
      imageConfigCreationDate: 0,
      imageConfigDefaultUser: 0,
      imageConfigEnvVariable: 0,
      imageConfigInstructionIsPkgManager: 0,
      imageConfigInstructionNotRecommended: 0,
      imageConfigLabel: 0,
      imageConfigSensitiveInformationAndSecrets: 0,
      vulnDenyList: 0,
      vulnSeverityAndThreats: 2,
    },
    creationTimestamp: '2022-09-02T11:58:59.03062Z',
    updateTimestamp: '2022-09-02T11:58:59.03062Z',
    ...partial,
  };
}

export function getMockPolicy(partial?: Partial<Policy>): Policy {
  return {
    id: 17384,
    name: 'Sysdig Best Practices',
    identifier: 'sysdig_best_practices',
    description: 'Recommended out of the box image scanning checks.',
    policyType: 'alwaysApply',
    bundles: [],
    creationTimestamp: '2022-09-02T11:58:59.03062Z',
    updateTimestamp: '2022-09-02T11:58:59.03062Z',
    ...partial,
  };
}
