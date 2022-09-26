import {
  Recording,
  setupRecording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupProjectRecording(input: SetupRecordingInput): Recording {
  return setupRecording({
    mutateEntry: mutations.unzipGzippedRecordingEntry,
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
