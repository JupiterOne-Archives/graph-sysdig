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
import { SysdigAgent } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Steps, Entities, Relationships } from '../constants';
import { createClusterEntity, getClusterKey } from './converter';

export async function fetchClusters({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateClusters(async (cluster) => {
    const clusterEntity = await jobState.addEntity(
      createClusterEntity(cluster),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: clusterEntity,
      }),
    );
  });
}

export async function buildClusterAgentRelationship({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.AGENT._type },
    async (agentEntity) => {
      const agent = getRawData<SysdigAgent>(agentEntity);
      if (!agent) {
        logger.warn(
          { _key: agentEntity._key },
          'Could not get raw data for agent entity',
        );
        return;
      }

      const clusterEntity = await jobState.findEntity(
        getClusterKey(agent.labels.provider, agent.clusterName),
      );

      if (clusterEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.SCANS,
            from: agentEntity,
            to: clusterEntity,
          }),
        );
      }
    },
  );
}

export const clusterSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CLUSTERS,
    name: 'Fetch Clusters',
    entities: [Entities.CLUSTER],
    relationships: [Relationships.ACCOUNT_HAS_CLUSTER],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchClusters,
  },
  {
    id: Steps.BUILD_CLUSTER_AGENT_RELATIONSHIP,
    name: 'Build Cluster and Agent Relationship',
    entities: [],
    relationships: [Relationships.AGENT_SCANS_CLUSTER],
    dependsOn: [Steps.AGENTS, Steps.CLUSTERS],
    executionHandler: buildClusterAgentRelationship,
  },
];
