import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { SysdigUser } from '../../types';

import { Entities } from '../constants';

export function getUserKey(id: number): string {
  return `sysdig_user:${id}`;
}

export function createUserEntity(data: SysdigUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getUserKey(data.id as number),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        name: data.username,
        displayName: `${data.firstName} ${data.lastName}`,
        username: data.username,
        id: (data.id as number).toString(),
        dateCreated: data.dateCreated,
        enabled: data.enabled,
        firstName: data.firstName,
        lastName: data.lastName,
        lastSeenOnSecure: data.lastSeenOnSecure,
        products: data.products,
        status: data.status,
        systemRole: data.systemRole,
        version: data.version,
      },
    },
  });
}
