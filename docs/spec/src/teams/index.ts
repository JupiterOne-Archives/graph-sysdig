import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const teamsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/v2/teams/light
     * PATTERN: Fetch Entities
     */
    id: 'fetch-teams',
    name: 'Fetch Teams',
    entities: [
      {
        resourceName: 'Team',
        _type: 'sysdig_team',
        _class: ['Team'],
      },
    ],
    relationships: [
      {
        _type: 'sysdig_account_has_team',
        sourceType: 'sysdig_account',
        _class: RelationshipClass.HAS,
        targetType: 'sysdig_team',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-team-and-user-relationship',
    name: 'Build Team and User Relationship',
    entities: [],
    relationships: [
      {
        _type: 'sysdig_team_has_user',
        sourceType: 'sysdig_team',
        _class: RelationshipClass.HAS,
        targetType: 'sysdig_user',
      },
    ],
    dependsOn: ['fetch-teams', 'fetch-users'],
    implemented: true,
  },
];
