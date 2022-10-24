import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Steps, Entities, Relationships } from '../constants';
import { createAgentEntity } from './converter';

export async function fetchAgents({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateAgents(async (agent) => {
    const agentEntity = await jobState.addEntity(createAgentEntity(agent));

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: agentEntity,
      }),
    );
  });
}

export const agentSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.AGENTS,
    name: 'Fetch Agents',
    entities: [Entities.AGENT],
    relationships: [Relationships.ACCOUNT_HAS_AGENT],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchAgents,
  },
];
