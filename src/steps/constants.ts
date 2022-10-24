import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  CLUSTERS: 'fetch-clusters',
  AGENTS: 'fetch-agents',
  TEAMS: 'fetch-teams',
  IMAGE_SCANS: 'fetch-image-scans',
  SCANNER: 'fetch-scanner-details',
  FINDINGS: 'fetch-findings',
  BUILD_TEAM_AND_USER_RELATIONSHIP: 'build-team-and-user-relationship',
  BUILD_CLUSTER_AGENT_RELATIONSHIP: 'build-cluster-and-agent-relationship',
  BUILD_SCANNER_AND_IMAGE_SCAN_RELATIONSHIP:
    'build-scanner-and-image-scan-relationship',
};

export const Entities: Record<
  | 'ACCOUNT'
  | 'USER'
  | 'TEAM'
  | 'IMAGE_SCAN'
  | 'SCANNER'
  | 'FINDING'
  | 'CVE'
  | 'CLUSTER'
  | 'AGENT',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'sysdig_account',
    _class: ['Account'],
  },
  USER: {
    resourceName: 'User',
    _type: 'sysdig_user',
    _class: ['User'],
  },
  TEAM: {
    resourceName: 'Team',
    _type: 'sysdig_team',
    _class: ['Team'],
  },
  IMAGE_SCAN: {
    resourceName: 'Image Scan',
    _type: 'sysdig_image_scan',
    _class: ['Assessment'],
  },
  SCANNER: {
    resourceName: 'Scanner',
    _type: 'sysdig_scanner',
    _class: ['Service'],
  },
  FINDING: {
    resourceName: 'Finding',
    _type: 'sysdig_finding',
    _class: ['Finding'],
  },
  CVE: {
    resourceName: 'CVE',
    _type: 'cve',
    _class: ['Vulnerability'],
  },
  CLUSTER: {
    resourceName: 'Cluster',
    _type: 'sysdig_cluster',
    _class: ['Cluster'],
  },
  AGENT: {
    resourceName: 'Agent',
    _type: 'sysdig_agent',
    _class: ['Scanner'],
  },
};

export const MappedRelationships: Record<
  'FINDING_IS_CVE',
  StepMappedRelationshipMetadata
> = {
  FINDING_IS_CVE: {
    _type: 'sysdig_finding_is_cve',
    sourceType: Entities.FINDING._type,
    _class: RelationshipClass.IS,
    targetType: Entities.CVE._type,
    direction: RelationshipDirection.FORWARD,
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_TEAM'
  | 'ACCOUNT_HAS_SCANNER'
  | 'ACCOUNT_HAS_AGENT'
  | 'ACCOUNT_HAS_CLUSTER'
  | 'AGENT_SCANS_CLUSTER'
  | 'ACCOUNT_HAS_IMAGE_SCAN'
  | 'TEAM_HAS_USER'
  | 'SCANNER_PERFORMED_IMAGE_SCAN'
  | 'IMAGE_SCAN_IDENTIFIED_FINDING',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'sysdig_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_TEAM: {
    _type: 'sysdig_account_has_team',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.TEAM._type,
  },
  ACCOUNT_HAS_SCANNER: {
    _type: 'sysdig_account_has_scanner',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.SCANNER._type,
  },
  ACCOUNT_HAS_AGENT: {
    _type: 'sysdig_account_has_agent',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.AGENT._type,
  },
  ACCOUNT_HAS_CLUSTER: {
    _type: 'sysdig_account_has_cluster',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.CLUSTER._type,
  },
  AGENT_SCANS_CLUSTER: {
    _type: 'sysdig_agent_scans_cluster',
    sourceType: Entities.AGENT._type,
    _class: RelationshipClass.SCANS,
    targetType: Entities.CLUSTER._type,
  },
  TEAM_HAS_USER: {
    _type: 'sysdig_team_has_user',
    sourceType: Entities.TEAM._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_IMAGE_SCAN: {
    _type: 'sysdig_account_has_image_scan',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.IMAGE_SCAN._type,
  },
  SCANNER_PERFORMED_IMAGE_SCAN: {
    _type: 'sysdig_scanner_performed_image_scan',
    sourceType: Entities.SCANNER._type,
    _class: RelationshipClass.PERFORMED,
    targetType: Entities.IMAGE_SCAN._type,
  },
  IMAGE_SCAN_IDENTIFIED_FINDING: {
    _type: 'sysdig_image_scan_identified_finding',
    sourceType: Entities.IMAGE_SCAN._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: Entities.FINDING._type,
  },
};
