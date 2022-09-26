import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getScannerKey(name: string): string {
  return `sysdig_scanner:${name}`;
}

export function createScannerEntity(service: { name: string }): Entity {
  return createIntegrationEntity({
    entityData: {
      source: service,
      assign: {
        _key: getScannerKey(service.name),
        _type: Entities.SCANNER._type,
        _class: Entities.SCANNER._class,
        name: service.name,
        displayName: service.name,
        category: ['image'],
        function: ['scanning'],
      },
    },
  });
}
