import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { fetchImageScans, buildAccountAndImageScansRelationship } from '.';
import { integrationConfig } from '../../../test/config';
import { setupSysdigRecording } from '../../../test/recording';
import { fetchAccountDetails } from '../account';
import { Relationships } from '../constants';

describe('#fetchImageScans', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'fetchImageScans',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchImageScans(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const imageScans = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_image_scan'),
    );
    expect(imageScans.length).toBeGreaterThan(0);
    expect(imageScans).toMatchGraphObjectSchema({
      _class: ['Assessment'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_image_scan' },
          analysisStatus: { type: 'string' },
          analyzedAt: { type: 'number' },
          createdAt: { type: 'number' },
          fullTag: { type: 'string' },
          imageDigest: { type: 'string' },
          imageId: { type: 'string' },
          parentDigest: { type: 'string' },
          tagDetectedAt: { type: 'number' },
          registry: { type: 'string' },
          repository: { type: 'string' },
          tag: { type: 'string' },
          origin: { type: 'string' },
          policyStatus: { type: 'string' },
        },
      },
    });
  });
});

describe('#buildAccountAndImageScansRelationship', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'buildAccountAndImageScansRelationship',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should build image scans and account relationship', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchAccountDetails(context);
    await fetchImageScans(context);
    await buildAccountAndImageScansRelationship(context);

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

    const imageScans = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_image_scan'),
    );
    expect(imageScans.length).toBeGreaterThan(0);
    expect(imageScans).toMatchGraphObjectSchema({
      _class: ['Assessment'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_image_scan' },
          analysisStatus: { type: 'string' },
          analyzedAt: { type: 'number' },
          createdAt: { type: 'number' },
          fullTag: { type: 'string' },
          imageDigest: { type: 'string' },
          imageId: { type: 'string' },
          parentDigest: { type: 'string' },
          tagDetectedAt: { type: 'number' },
          registry: { type: 'string' },
          repository: { type: 'string' },
          tag: { type: 'string' },
          origin: { type: 'string' },
          policyStatus: { type: 'string' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.ACCOUNT_HAS_IMAGE_SCAN._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'sysdig_account_has_image_scan',
          },
        },
      },
    });
  });
});
