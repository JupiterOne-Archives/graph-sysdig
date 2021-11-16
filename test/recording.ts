import {
  Recording,
  setupRecording,
  SetupRecordingInput,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupSysdigRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    options: {
      matchRequestsBy: {
        url: {
          hostname: false,
        },
      },
    },
  });
}
