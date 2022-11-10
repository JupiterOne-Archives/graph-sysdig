type PaginationData = {
  offset: number;
  total: number;
};

export type SysdigAccount = SysdigUser & {
  firstName: string;
  id: number;
  lastName: string;
  username: string;
  name: string;
  teamRoles: {
    teamId: number;
    teamName: string;
    teamTheme: string;
    userId: number;
    userName: string;
    role: string;
    admin: boolean;
  }[];
};

export type SysdigUser = {
  id: number;
  version: number;
  username: string;
  enabled: boolean;
  systemRole: string;
  firstName: string;
  lastName: string;
  lastSeenOnSecure: number;
  dateCreated: number;
  status: string;
  products: string[];
};

export type PaginatedUsers = {
  users: SysdigUser[];
} & PaginationData;

export type SysdigTeam = {
  id: number;
  version: number;
  dateCreated: number;
  lastUpdated: number;
  customerId: number;
  immutable: boolean;
  name: string;
  theme: string;
  description: string;
  show: string;
  origin: string;
  canUseSysdigCapture: boolean;
  canUseAgentCli: boolean;
  canUseCustomEvents: boolean;
  canUseAwsMetrics: boolean;
  canUseBeaconMetrics: boolean;
  canUseRapidResponse: boolean;
  defaultTeamRole: string;
  userCount: number;
  entryPoint: {
    module: string;
  };
  products: string[];
  default: boolean;
};

export type PaginatedTeams = {
  teams: SysdigTeam[];
} & PaginationData;

export type SysdigResult = {
  analysisStatus: string;
  analyzedAt: number;
  createdAt: number;
  fullTag: string;
  imageDigest: string;
  imageId: string;
  parentDigest: string;
  tagDetectedAt: number;
  registry: string;
  repository: string;
  tag: string;
  origin: string;
  policyStatus: string;
};

export type SysdigResultMetadata = {
  total: number;
  policyStatus: {
    totalPassed: number;
    totalFailed: number;
    totalNotEvaluated: number;
  };
  origins: {
    'sysdig-secure-ui': number;
  };
  allOrigins: string[];
  allRegistries: string[];
};

export type SysdigResultOptions = {
  sort: string;
  sortBy: string;
  offset: number;
  limit: number;
  canLoadMore: boolean;
};

export type SysdigResultResponse = {
  options: SysdigResultOptions;
  results: SysdigResult[];
  totalRows: number;
  metadata: SysdigResultMetadata;
};

export type ImageScansV2Pagination = {
  returned: number;
  matched: number;
  next: string | null;
};

export type ImageScanV2 = {
  id: string;
  storedAt: string;
  type: string;
  metadata: {
    imageId: string;
    pullString: string;
    baseOS: string;
    digest: string;
    createdAt: string;
    author: string;
    size: number;
    os: string;
    architecture: string;
    labels: any;
    layersCount: number;
  };
  labels: any;
  vulnsBySev: {
    totalCount: number;
    fixableCount: number;
  }[];
  packageCount: number;
  packageTypes: string[];
  fixablePackages: {
    id: string;
    type: string;
    name: string;
    version: string;
    vulnsBySev: any[];
    exploitCount: number;
    suggestedFix: string;
  }[];
  runningFixablePackages: any;
  policyEvaluations: PolicyEvaluation[];
  isEVEEnabled: boolean;
};

export type PolicyEvaluation = {
  id: string;
  name: string;
  identifier: string;
  policyType: string;
  evaluationResult: string;
  failuresCount: {
    imageConfigCreationDate: number;
    imageConfigDefaultUser: number;
    imageConfigEnvVariable: number;
    imageConfigInstructionIsPkgManager: number;
    imageConfigInstructionNotRecommended: number;
    imageConfigLabel: number;
    imageConfigSensitiveInformationAndSecrets: number;
    vulnDenyList: number;
    vulnSeverityAndThreats: number;
  };
  creationTimestamp: string;
  updateTimestamp: string;
};

export type PolicyEvaluations = {
  data: PolicyEvaluation[];
};

export type PaginatedImageScansV2 = {
  page: ImageScansV2Pagination;
  data: ImageScanV2[];
};

export type VulnerablePackagesPagination = {
  returned: number;
  offset: number;
  matched: number;
};

export type VulnerablePackage = {
  id: string;
  vuln: Vulnerability;
  package: {
    id: string;
    name: string;
    version: string;
    type: string;
    path: string;
    running: boolean;
  };
  fixedInVersion: string;
};

export type Vulnerability = {
  name: string;
  severity: {
    reporter: {
      name: string;
      url: string | null;
    };
    value: number;
  };
  cvssScore: CvssScore;
  additionalCVSSScores: CvssScore[];
  exploitable: boolean;
  exploit: any;
  description: string;
  disclosureDate: string;
  solutionDate: string;
};

export type CvssScore = {
  reporter: {
    name: string;
    url: string | null;
  };
  value: {
    version: string;
    score: number;
    vector: string;
  };
};

export type PaginatedVulnerabilities = {
  page: VulnerablePackagesPagination;
  data: VulnerablePackage[];
};

export type Policy = {
  id: number;
  name: string;
  identifier: string;
  description: string;
  policyType: string;
  bundles: RuleBundle[];
  creationTimestamp: string;
  updateTimestamp: string;
};

export type Policies = {
  policies: Policy[];
};

export type RuleBundle = {
  id: number;
  name: string;
  identifier: string;
  description: string;
  bundleType: string;
  rules: Rule;
  creationTimestamp: string;
  updateTimestamp: string;
};

export type Rule = {
  ruleType: number;
  predicates: string;
};

export type Predicate = {
  type: string;
  extra?: any;
};
