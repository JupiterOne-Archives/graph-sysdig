import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_API_TOKEN = 'dummy-acme-client-secret';
const DEFAULT_REGION = 'us2';

export const integrationConfig: IntegrationConfig = {
  apiToken: process.env.API_TOKEN || DEFAULT_API_TOKEN,
  region: process.env.REGION || DEFAULT_REGION,
};
