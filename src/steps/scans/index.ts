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
import { SCANNER_ENTITY_KEY } from '../scanner';
import {
  createImageScanEntity,
  createImageScanEntityV2,
  getImageScanKey,
} from './converter';

export async function fetchImageScans({
  instance,
  logger,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

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
      const imageScanEntity = await jobState.addEntity(
        createImageScanEntity(scan),
      );
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: imageScanEntity,
        }),
      );
    }
  });

  await apiClient.iterateImageScansV2(async (scan) => {
    const imageScanDetails = await apiClient.fetchImageScansV2Details(scan.id);
    const imageScanEntity = await jobState.addEntity(
      createImageScanEntityV2(imageScanDetails),
    );
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: imageScanEntity,
      }),
    );
  });
}

export async function buildScannerAndImageScansRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const scannerEntity = (await jobState.getData(SCANNER_ENTITY_KEY)) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.IMAGE_SCAN._type },
    async (imageScanEntity) => {
      if (scannerEntity && imageScanEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.PERFORMED,
            from: scannerEntity,
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
    relationships: [Relationships.ACCOUNT_HAS_IMAGE_SCAN],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchImageScans,
  },
  {
    id: Steps.BUILD_SCANNER_AND_IMAGE_SCAN_RELATIONSHIP,
    name: 'Build Scanner and Image Scan Relationship',
    entities: [],
    relationships: [Relationships.SCANNER_PERFORMED_IMAGE_SCAN],
    dependsOn: [Steps.IMAGE_SCANS, Steps.SCANNER],
    executionHandler: buildScannerAndImageScansRelationship,
  },
];
