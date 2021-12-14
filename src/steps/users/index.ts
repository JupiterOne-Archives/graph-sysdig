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
import { createUserEntity } from './converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateUsers(async (user) => {
    const userDetails = await apiClient.getUserById(user.id.toString());

    await jobState.addEntity(
      createUserEntity(instance.config.region, userDetails),
    );
  });
}

export async function buildAccountAndUsersRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (userEntity) => {
      if (accountEntity && userEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: accountEntity,
            to: userEntity,
          }),
        );
      }
    },
  );
}

export const usersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.BUILD_ACCOUNT_AND_USER_RELATIONSHIP,
    name: 'Build Account and User Relationship',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.USERS, Steps.ACCOUNT],
    executionHandler: buildAccountAndUsersRelationship,
  },
];
