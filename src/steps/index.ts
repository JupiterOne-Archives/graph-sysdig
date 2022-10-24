import { accountSteps } from './account';
import { usersSteps } from './users';
import { teamsSteps } from './teams';
import { scansSteps } from './scans';
import { findingsSteps } from './findings';
import { scannerSteps } from './scanner';
import { clusterSteps } from './clusters';
import { agentSteps } from './agents';

const integrationSteps = [
  ...accountSteps,
  ...usersSteps,
  ...teamsSteps,
  ...scansSteps,
  ...findingsSteps,
  ...scannerSteps,
  ...clusterSteps,
  ...agentSteps,
];

export { integrationSteps };
