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

test('#fetchClusters', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-clusters',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.CLUSTERS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('#buildClusterAgentRelationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-cluster-agent-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_CLUSTER_AGENT_RELATIONSHIP,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
