import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Steps, Entities, Relationships } from '../constants';
import { createImageScanEntity } from './converter';

export async function fetchImageScans({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateImageScans(async (scan) => {
    await jobState.addEntity(createImageScanEntity(scan));
  });
}

export async function buildAccountAndImageScansRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.IMAGE_SCAN._type },
    async (imageScanEntity) => {
      if (accountEntity && imageScanEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: accountEntity,
            to: imageScanEntity,
          }),
        );
      }
    },
  );
}

export const scansSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.IMAGE_SCANS,
    name: 'Fetch Image Scans',
    entities: [Entities.IMAGE_SCAN],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchImageScans,
  },
  {
    id: Steps.BUILD_ACCOUNT_AND_IMAGE_SCAN_RELATIONSHIP,
    name: 'Build Account and Image Scan Relationship',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_IMAGE_SCAN],
    dependsOn: [Steps.IMAGE_SCANS, Steps.ACCOUNT],
    executionHandler: buildAccountAndImageScansRelationship,
  },
];
