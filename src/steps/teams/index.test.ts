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

test('#fetchTeams', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-teams',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.TEAMS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('#buildTeamAndUsers', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-team-users',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_TEAM_AND_USER_RELATIONSHIP,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
