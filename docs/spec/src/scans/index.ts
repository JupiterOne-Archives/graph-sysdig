import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const scansSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/scanning/scanresults/v2/results
     * PATTERN: Fetch Entities
     */
    id: 'fetch-image-scans',
    name: 'Fetch Image Scans',
    entities: [
      {
        resourceName: 'Image Scan',
        _type: 'sysdig_image_scan',
        _class: ['Assessment'],
      },
    ],
    relationships: [
      {
        _type: 'sysdig_account_has_image_scan',
        sourceType: 'sysdig_account',
        _class: RelationshipClass.HAS,
        targetType: 'sysdig_image_scan',
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
    id: 'build-scanner-and-image-scan-relationship',
    name: 'Build Scanner and Image Scan Relationship',
    entities: [],
    relationships: [
      {
        _type: 'sysdig_scanner_performed_image_scan',
        sourceType: 'sysdig_scanner',
        _class: RelationshipClass.PERFORMED,
        targetType: 'sysdig_image_scan',
      },
    ],
    dependsOn: ['fetch-image-scans', 'fetch-scanner-details'],
    implemented: true,
  },
];
