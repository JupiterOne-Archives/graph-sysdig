import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const scannerSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: <n/a>
     * PATTERN: Singleton
     */
    id: 'fetch-scanner-details',
    name: 'Fetch Scanner Details',
    entities: [
      {
        resourceName: 'Scanner',
        _type: 'sysdig_scanner',
        _class: ['Service'],
      },
    ],
    relationships: [
      {
        _type: 'sysdig_account_has_scanner',
        sourceType: 'sysdig_account',
        _class: RelationshipClass.HAS,
        targetType: 'sysdig_scanner',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
