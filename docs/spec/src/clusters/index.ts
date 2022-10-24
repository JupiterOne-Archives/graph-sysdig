import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const clusterSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/cloud/v2/dataSources/clusters
     * PATTERN: Fetch Entities
     */
    id: 'fetch-clusters',
    name: 'Fetch Clusters',
    entities: [
      {
        resourceName: 'Cluster',
        _type: 'sysdig_cluster',
        _class: ['Cluster'],
      },
    ],
    relationships: [
      {
        _type: 'sysdig_account_has_cluster',
        sourceType: 'sysdig_account',
        _class: RelationshipClass.HAS,
        targetType: 'sysdig_cluster',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-cluster-and-agent-relationship',
    name: 'Build Cluster and Agent Relationship',
    entities: [],
    relationships: [
      {
        _type: 'sysdig_agent_scans_cluster',
        sourceType: 'sysdig_agent',
        _class: RelationshipClass.SCANS,
        targetType: 'sysdig_cluster',
      },
    ],
    dependsOn: ['fetch-agents', 'fetch-clusters'],
    implemented: true,
  },
];
