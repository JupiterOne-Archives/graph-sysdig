import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { fetchAccountDetails } from '.';
import { integrationConfig } from '../../../test/config';
import { setupSysdigRecording } from '../../../test/recording';

describe('#fetchAccountDetails', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'fetchAccountDetails',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchAccountDetails(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
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
  });
});
