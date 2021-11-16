import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { buildAccountAndUsersRelationship, fetchUsers } from '.';
import { integrationConfig } from '../../../test/config';
import { setupSysdigRecording } from '../../../test/recording';
import { fetchAccountDetails } from '../account';
import { Relationships } from '../constants';

describe('#fetchUsers', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'fetchUsers',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchUsers(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
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
          dateCreated: { type: 'number' },
          enabled: { type: 'boolean' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          lastSeenOnSecure: { type: 'number' },
          products: { type: 'array', items: { type: 'string' } },
          status: { type: 'string' },
          systemRole: { type: 'string' },
          version: { type: 'number' },
        },
      },
    });
  });
});

describe('#buildAccountAndUsersRelationship', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'buildAccountAndUsersRelationship',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should build users and account relationship', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchAccountDetails(context);
    await fetchUsers(context);
    await buildAccountAndUsersRelationship(context);

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
          dateCreated: { type: 'number' },
          enabled: { type: 'boolean' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          lastSeenOnSecure: { type: 'number' },
          products: { type: 'array', items: { type: 'string' } },
          status: { type: 'string' },
          systemRole: { type: 'string' },
          version: { type: 'number' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.ACCOUNT_HAS_USER._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'sysdig_account_has_user',
          },
        },
      },
    });
  });
});
