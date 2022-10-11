import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupProjectRecording } from '../../../test/recording';
import {
  Entities,
  MappedRelationships,
  Relationships,
  Steps,
} from '../constants';

let recording: Recording;

jest.setTimeout(50000000);

afterEach(async () => {
  await recording.stop();
});

test('#fetchFindings', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-findings',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FINDINGS);
  const { collectedEntities, collectedRelationships, encounteredTypes } =
    await executeStepWithDependencies(stepConfig);

  expect(encounteredTypes).toMatchSnapshot();
  expect(
    collectedEntities.some((e) => e._type === Entities.FINDING._type),
  ).toBeTruthy();

  expect(
    collectedRelationships.some(
      (e) => e._type === Relationships.IMAGE_SCAN_IDENTIFIED_FINDING._type,
    ),
  ).toBeTruthy();

  expect(
    collectedRelationships.some(
      (e) => e._type === MappedRelationships.FINDING_IS_CVE._type,
    ),
  ).toBeTruthy();
});
