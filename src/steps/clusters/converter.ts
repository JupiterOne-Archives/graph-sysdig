import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { SysdigCluster } from '../../types';
import { Entities } from '../constants';

export function getClusterKey(provider: string, name: string) {
  return `sysdig-cluster:${provider}-${name}`;
}

export function createClusterEntity(data: SysdigCluster): Entity {
  const { agentConnectString, ...cluster } = data;

  return createIntegrationEntity({
    entityData: {
      source: {
        ...cluster,
      },
      assign: {
        _key: getClusterKey(data.provider, data.name),
        _type: Entities.CLUSTER._type,
        _class: Entities.CLUSTER._class,
        customerId: data.customerID,
        accountId: data.accountID,
        provider: data.provider,
        name: data.name,
        region: data.region,
        zone: data.zone,
        agentConnected: data.agentConnected,
        createdOn: parseTimePropertyValue(data.createdAt),
        nodeCount: data.nodeCount,
        clusterResourceGroup: data.clusterResourceGroup,
        version: data.version,
      },
    },
  });
}
