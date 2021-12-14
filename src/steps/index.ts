import { accountSteps } from './account';
import { usersSteps } from './users';
import { teamsSteps } from './teams';
import { scansSteps } from './scans';

const integrationSteps = [
  ...accountSteps,
  ...usersSteps,
  ...teamsSteps,
  ...scansSteps,
];

export { integrationSteps };
