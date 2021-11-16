import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const usersSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Singleton
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
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
