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
import { createTeamEntity, getTeamKey } from './converter';

export async function fetchTeams({
  instance,
  logger,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateTeams(async (team) => {
    const teamEntity = await jobState.addEntity(createTeamEntity(team));
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: teamEntity,
      }),
    );
  });
}

export async function buildTeamAndUsersRelationship({
  instance,
  logger,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (userEntity) => {
      const user = await apiClient.getUserById(userEntity.id as string);

      for (const teamRole of user.teamRoles) {
        const teamEntity = await jobState.findEntity(
          getTeamKey(teamRole.teamId),
        );

        if (teamEntity && userEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: teamEntity,
              to: userEntity,
            }),
          );
        }
      }
    },
  );
}

export const teamsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.TEAMS,
    name: 'Fetch Teams',
    entities: [Entities.TEAM],
    relationships: [Relationships.ACCOUNT_HAS_TEAM],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchTeams,
  },
  {
    id: Steps.BUILD_TEAM_AND_USER_RELATIONSHIP,
    name: 'Build Team and User Relationship',
    entities: [],
    relationships: [Relationships.TEAM_HAS_USER],
    dependsOn: [Steps.TEAMS, Steps.USERS],
    executionHandler: buildTeamAndUsersRelationship,
  },
];
