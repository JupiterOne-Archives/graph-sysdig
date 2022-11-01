import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { scannerSpec } from './scanner';
import { scansSpec } from './scans';
import { teamsSpec } from './teams';
import { usersSpec } from './users';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...accountSpec,
    ...scannerSpec,
    ...scansSpec,
    ...teamsSpec,
    ...usersSpec,
  ],
};
