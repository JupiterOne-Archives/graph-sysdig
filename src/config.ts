import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  apiToken: {
    type: 'string',
    mask: true,
  },
  region: {
    type: 'string',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The provider API token used to authenticate requests.
   */
  apiToken: string;
  /**
   * The app's region.
   */
  region: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.apiToken || !config.region) {
    throw new IntegrationValidationError(
      'Config requires all of {apiToken, region}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
