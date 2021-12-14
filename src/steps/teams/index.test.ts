import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import {
  buildAccountAndTeamsRelationship,
  buildTeamAndUsersRelationship,
  fetchTeams,
} from '.';
import { integrationConfig } from '../../../test/config';
import { setupSysdigRecording } from '../../../test/recording';
import { fetchAccountDetails } from '../account';
import { Relationships } from '../constants';
import { fetchUsers } from '../users';

describe('#fetchTeams', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'fetchTeams',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchTeams(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const teams = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_team'),
    );
    expect(teams.length).toBeGreaterThan(0);
    expect(teams).toMatchGraphObjectSchema({
      _class: ['Team'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_team' },
          id: { type: 'string' },
          version: { type: 'number' },
          customerId: { type: 'number' },
          immutable: { type: 'boolean' },
          name: { type: 'string' },
          theme: { type: 'string' },
          description: { type: 'string' },
          show: { type: 'string' },
          origin: { type: 'string' },
          canUseSysdigCapture: { type: 'boolean' },
          canUseAgentCli: { type: 'boolean' },
          canUseCustomEvents: { type: 'boolean' },
          canUseAwsMetrics: { type: 'boolean' },
          canUseBeaconMetrics: { type: 'boolean' },
          canUseRapidResponse: { type: 'boolean' },
          defaultTeamRole: { type: 'string' },
          userCount: { type: 'number' },
          entryPointModule: { type: 'string' },
          products: { type: 'array', items: { type: 'string' } },
          default: { type: 'boolean' },
        },
      },
    });
  });
});

describe('#buildAccountAndTeamsRelationship', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'buildAccountAndTeamsRelationship',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should build team and account relationship', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchAccountDetails(context);
    await fetchTeams(context);
    await buildAccountAndTeamsRelationship(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
      collectedRelationships: context.jobState.collectedRelationships,
    }).toMatchSnapshot();

    const account = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_account'),
    );
    expect(account.length).toBe(1);
    expect(account).toMatchGraphObjectSchema({
      _class: ['Account'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_account' },
          name: { type: 'string' },
          username: { type: 'string' },
          displayName: { type: 'string' },
          id: { type: 'string' },
        },
      },
    });

    const teams = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_team'),
    );
    expect(teams.length).toBeGreaterThan(0);
    expect(teams).toMatchGraphObjectSchema({
      _class: ['Team'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_team' },
          id: { type: 'string' },
          version: { type: 'number' },
          customerId: { type: 'number' },
          immutable: { type: 'boolean' },
          name: { type: 'string' },
          theme: { type: 'string' },
          description: { type: 'string' },
          show: { type: 'string' },
          origin: { type: 'string' },
          canUseSysdigCapture: { type: 'boolean' },
          canUseAgentCli: { type: 'boolean' },
          canUseCustomEvents: { type: 'boolean' },
          canUseAwsMetrics: { type: 'boolean' },
          canUseBeaconMetrics: { type: 'boolean' },
          canUseRapidResponse: { type: 'boolean' },
          defaultTeamRole: { type: 'string' },
          userCount: { type: 'number' },
          entryPointModule: { type: 'string' },
          products: { type: 'array', items: { type: 'string' } },
          default: { type: 'boolean' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.ACCOUNT_HAS_TEAM._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'sysdig_account_has_team',
          },
        },
      },
    });
  });
});

describe('#buildTeamAndUsersRelationship', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'buildTeamAndUsersRelationship',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should build team and users relationship', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchUsers(context);
    await fetchTeams(context);
    await buildTeamAndUsersRelationship(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
      collectedRelationships: context.jobState.collectedRelationships,
    }).toMatchSnapshot();

    const users = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_user'),
    );
    expect(users.length).toBeGreaterThan(0);
    expect(users).toMatchGraphObjectSchema({
      _class: ['User'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_user' },
          name: { type: 'string' },
          username: { type: 'string' },
          displayName: { type: 'string' },
          id: { type: 'string' },
          enabled: { type: 'boolean' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          lastSeenOnSecure: { type: 'number' },
          products: { type: 'array', items: { type: 'string' } },
          status: { type: 'string' },
          systemRole: { type: 'string' },
          version: { type: 'number' },
          admin: { type: 'boolean' },
        },
      },
    });

    const teams = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_team'),
    );
    expect(teams.length).toBeGreaterThan(0);
    expect(teams).toMatchGraphObjectSchema({
      _class: ['Team'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_team' },
          id: { type: 'string' },
          version: { type: 'number' },
          customerId: { type: 'number' },
          immutable: { type: 'boolean' },
          name: { type: 'string' },
          theme: { type: 'string' },
          description: { type: 'string' },
          show: { type: 'string' },
          origin: { type: 'string' },
          canUseSysdigCapture: { type: 'boolean' },
          canUseAgentCli: { type: 'boolean' },
          canUseCustomEvents: { type: 'boolean' },
          canUseAwsMetrics: { type: 'boolean' },
          canUseBeaconMetrics: { type: 'boolean' },
          canUseRapidResponse: { type: 'boolean' },
          defaultTeamRole: { type: 'string' },
          userCount: { type: 'number' },
          entryPointModule: { type: 'string' },
          products: { type: 'array', items: { type: 'string' } },
          default: { type: 'boolean' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.TEAM_HAS_USER._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'sysdig_team_has_user',
          },
        },
      },
    });
  });
});
