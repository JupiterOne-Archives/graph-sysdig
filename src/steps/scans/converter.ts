import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { ImageScanV2, SysdigResult } from '../../types';
import { Entities } from '../constants';

export function getImageScanKey(id: string): string {
  return `sysdig_image_scan:${id}`;
}

export function createImageScanEntity(data: SysdigResult): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        ...data,
        createdOn: data.createdAt,
      },
      assign: {
        _key: getImageScanKey(data.imageId),
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

export function createImageScanEntityV2(data: ImageScanV2): Entity {
  const storedAt = parseTimePropertyValue(data.storedAt);
  const createdAt = parseTimePropertyValue(data.metadata.createdAt);
  const vulnsBySev = data.vulnsBySev?.map((vuln) => vuln.fixableCount ?? 0);

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getImageScanKey(data.id),
        _type: Entities.IMAGE_SCAN._type,
        _class: Entities.IMAGE_SCAN._class,
        id: data.id,
        name: data.metadata.pullString,
        storedAt,
        type: data.type,
        'metadata.imageId': data.metadata.imageId,
        'metadata.pullString': data.metadata.pullString,
        'metadata.baseOS': data.metadata.baseOS,
        'metadata.digest': data.metadata.digest,
        'metadata.createdAt': createdAt,
        'metadata.author': data.metadata.author,
        'metadata.size': data.metadata.size,
        'metadata.os': data.metadata.os,
        'metadata.architecture': data.metadata.architecture,
        'metadata.labels': data.metadata.labels,
        'metadata.layersCount': data.metadata.layersCount,
        vulnsBySev,
        packageCount: data.packageCount,
        packageTypes: data.packageTypes,
        fixablePackages: data.fixablePackages,
        runningFixablePackages: data.runningFixablePackages,
        category: 'Image Scan',
        summary: 'Image Scan',
        internal: false,
      },
    },
  });
}
