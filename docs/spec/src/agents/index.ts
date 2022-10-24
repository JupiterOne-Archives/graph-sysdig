import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const agentSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/cloud/v2/dataSources/agents
     * PATTERN: Fetch Entities
     */
    id: 'fetch-agents',
    name: 'Fetch Agents',
    entities: [
      {
        resourceName: 'Agent',
        _type: 'sysdig_agent',
        _class: ['Scanner'],
      },
    ],
    relationships: [
      {
        _type: 'sysdig_account_has_agent',
        sourceType: 'sysdig_account',
        _class: RelationshipClass.HAS,
        targetType: 'sysdig_agent',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
