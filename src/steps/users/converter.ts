import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { SysdigAccount } from '../../types';
import { getWebLink } from '../../util/links';

import { Entities } from '../constants';

export function getUserKey(id: number): string {
  return `sysdig_user:${id}`;
}

function isAdmin(data: SysdigAccount) {
  return data.teamRoles.every((r) => r.admin === true);
}

export function createUserEntity(region: string, data: SysdigAccount): Entity {
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
        createdOn: parseTimePropertyValue(data.dateCreated),
        enabled: data.enabled,
        firstName: data.firstName,
        lastName: data.lastName,
        lastSeenOnSecure: parseTimePropertyValue(data.lastSeenOnSecure),
        products: data.products,
        status: data.status,
        systemRole: data.systemRole,
        version: data.version,
        active: data.status === 'confirmed',
        admin: isAdmin(data),
        webLink: getWebLink(region, `/#/settings/users/${data.id}`),
      },
    },
  });
}
