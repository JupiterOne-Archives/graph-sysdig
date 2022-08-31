import {
  createDirectRelationship,
  Entity,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { SysdigResult } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Steps, Entities, Relationships } from '../constants';
import { createImageScanEntity, getImageScanKey } from './converter';

export async function fetchImageScans({
  instance,
  logger,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateImageScans(async (scan) => {
    if (jobState.hasKey(getImageScanKey(scan.imageId))) {
      const scanEntity = (await jobState.findEntity(
        getImageScanKey(scan.imageId),
      )) as Entity;

      const originalScan = getRawData<SysdigResult>(scanEntity);
      logger.warn(
        {
          imageId: originalScan?.imageId === scan.imageId,
          createdDate: originalScan?.createdAt === scan.createdAt,
          analyzedDate: originalScan?.analyzedAt === scan.analyzedAt,
          repository: originalScan?.repository === scan.repository,
          origin: originalScan?.origin === scan.origin,
          registry: originalScan?.registry === scan.registry,
          imageDigest: originalScan?.imageDigest === scan.imageDigest,
          parentDigest: originalScan?.parentDigest === scan.parentDigest,
          fullTag: originalScan?.fullTag === scan.fullTag,
        },
        'duplicate image scan key detected. skipping creation.',
      );
    } else {
      await jobState.addEntity(createImageScanEntity(scan));
    }
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
