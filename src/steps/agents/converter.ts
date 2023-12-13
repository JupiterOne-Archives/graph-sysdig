import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { SysdigAgent } from '../../types';
import { Entities } from '../constants';

export function createAgentEntity(data: SysdigAgent): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: `sysdig-agent:${data.clusterName}-${data.machineId}-${data.labels.provider}-${data.labels.hostname}`,
        _type: Entities.AGENT._type,
        _class: Entities.AGENT._class,
        name: data.labels.hostname,
        agentStatus: data.agentStatus,
        clusterName: data.clusterName,
        accountId: data.labels.accountId,
        hostname: data.labels.hostname,
        machineId: data.labels.machineId,
        provider: data.labels.provider,
        agentConnectString: data.moreOptions.agentConnectString,
        category: ['application'],
      },
    },
  });
}
