import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('#fetchImageScans', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-image-scans',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.IMAGE_SCANS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('#buildScannerAndImageScans', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-scanner-image-scans',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_SCANNER_AND_IMAGE_SCAN_RELATIONSHIP,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
