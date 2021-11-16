import { accountSteps } from './account';
import { usersSteps } from './users';
import { teamsSteps } from './teams';

const integrationSteps = [...accountSteps, ...usersSteps, ...teamsSteps];

export { integrationSteps };
