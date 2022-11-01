import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { SysdigTeam } from '../../types';

import { Entities } from '../constants';

export function getTeamKey(id: number): string {
  return `sysdig_team:${id}`;
}

export function createTeamEntity(data: SysdigTeam): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getTeamKey(data.id as number),
        _type: Entities.TEAM._type,
        _class: Entities.TEAM._class,
        id: data.id.toString(),
        version: data.version,
        createdOn: data.dateCreated,
        updatedOn: data.lastUpdated,
        customerId: data.customerId,
        immutable: data.immutable,
        name: data.name,
        theme: data.theme,
        description: data.description,
        show: data.show,
        origin: data.origin,
        canUseSysdigCapture: data.canUseSysdigCapture,
        canUseAgentCli: data.canUseAgentCli,
        canUseCustomEvents: data.canUseCustomEvents,
        canUseAwsMetrics: data.canUseAwsMetrics,
        canUseBeaconMetrics: data.canUseBeaconMetrics,
        canUseRapidResponse: data.canUseRapidResponse,
        defaultTeamRole: data.defaultTeamRole,
        userCount: data.userCount,
        entryPointModule: data.entryPoint.module,
        products: data.products,
        default: data.default,
      },
    },
  });
}
