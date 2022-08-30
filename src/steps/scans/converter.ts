import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { SysdigResult } from '../../types';

import { Entities } from '../constants';

export function getImageScanKey(id: string, analyzedAt: number): string {
  return `sysdig_image_scan:${id}:${analyzedAt}`;
}

export function createImageScanEntity(data: SysdigResult): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getImageScanKey(data.imageId, data.analyzedAt),
        _type: Entities.IMAGE_SCAN._type,
        _class: Entities.IMAGE_SCAN._class,
        name: data.repository,
        analysisStatus: data.analysisStatus,
        analyzedAt: data.analyzedAt,
        createdAt: data.createdAt,
        fullTag: data.fullTag,
        imageDigest: data.imageDigest,
        imageId: data.imageId,
        parentDigest: data.parentDigest,
        tagDetectedAt: data.tagDetectedAt,
        registry: data.registry,
        repository: data.repository,
        tag: data.tag,
        origin: data.origin,
        policyStatus: data.policyStatus,
        category: 'Image Scan',
        summary: 'Image Scan',
        internal: false,
      },
    },
  });
}
