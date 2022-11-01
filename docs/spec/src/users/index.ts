import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const usersSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/v2/users/light
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'sysdig_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'sysdig_account_has_user',
        sourceType: 'sysdig_account',
        _class: RelationshipClass.HAS,
        targetType: 'sysdig_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
