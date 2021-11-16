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
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateTeams(async (team) => {
    await jobState.addEntity(createTeamEntity(team));
  });
}

export async function buildAccountAndTeamsRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.TEAM._type },
    async (teamEntity) => {
      if (accountEntity && teamEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: accountEntity,
            to: teamEntity,
          }),
        );
      }
    },
  );
}

export async function buildTeamAndUsersRelationship({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

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
    relationships: [],
    dependsOn: [],
    executionHandler: fetchTeams,
  },
  {
    id: Steps.BUILD_ACCOUNT_AND_TEAM_RELATIONSHIP,
    name: 'Build Account and Team Relationship',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_TEAM],
    dependsOn: [Steps.TEAMS, Steps.ACCOUNT],
    executionHandler: buildAccountAndTeamsRelationship,
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
