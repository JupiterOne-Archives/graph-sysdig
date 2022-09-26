import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const findingsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/scanning/scanresults/v2/results/{imageScanId}/vulnPkgs
     * PATTERN: Fetch Relationships
     */
    id: 'fetch-findings',
    name: 'Fetch Findings',
    entities: [
      {
        resourceName: 'Finding',
        _type: 'sysdig_finding',
        _class: ['Finding'],
      },
    ],
    relationships: [
      {
        _type: 'sysdig_image_scan_identified_finding',
        sourceType: 'sysdig_image_scan',
        _class: RelationshipClass.IDENTIFIED,
        targetType: 'sysdig_finding',
      },
      {
        _type: 'sysdig_account_has_policy',
        sourceType: 'sysdig_finding_is_cve',
        _class: RelationshipClass.IS,
        targetType: 'cve',
      },
    ],
    dependsOn: ['fetch-image-scans'],
    implemented: true,
  },
];
