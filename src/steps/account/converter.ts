import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { SysdigAccount } from '../../types';

import { Entities } from '../constants';

export function getAccountKey(id: number): string {
  return `sysdig_account:${id}`;
}

export function createAccountEntity(data: SysdigAccount): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getAccountKey(data.id as number),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        id: (data.id as number).toString(),
        name: data.name,
        displayName: `${data.firstName} ${data.lastName}`,
        username: data.username,
      },
    },
  });
}
