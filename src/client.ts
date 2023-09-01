import fetch, { Response } from 'node-fetch';
import { retry, sleep } from '@lifeomic/attempt';
import {
  IntegrationLogger,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  ImageScanV2,
  PaginatedImageScansV2,
  PaginatedTeams,
  PaginatedUsers,
  PaginatedVulnerabilities,
  SysdigAccount,
  SysdigAgent,
  SysdigCluster,
  SysdigResult,
  SysdigResultResponse,
  SysdigTeam,
  SysdigUser,
  VulnerablePackage,
} from './types';
import { URL_FORMAT } from './regions';
import { fatalRequestError, retryableRequestError } from './error';

export type ResourceIteratee<T> = (page: T) => Promise<void>;

export class APIClient {
  private readonly logger: IntegrationLogger;

  constructor(readonly config: IntegrationConfig, logger: IntegrationLogger) {
    this.logger = logger;
    if (URL_FORMAT.REGION_APP.includes(config.region)) {
      this.baseUri = `http://${this.config.region}.app.sysdig.com`;
    } else {
      this.baseUri = `http://app.${this.config.region}.sysdig.com`;
    }
  }

  private readonly paginateEntitiesPerPage = 100; // some endpoints have a maximum of 100 entities per call
  private baseUri: string;
  private withBaseUri(path: string): string {
    return `${this.baseUri}/${path}`;
  }

  private async request(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<Response> {
    const response = await fetch(uri, {
      method,
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
        Accept: 'application/json',
      },
    });
    return response;
  }

  private async retryRequest(
    url: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<Response> {
    return retry(
      async () => {
        let response: Response | undefined;
        try {
          response = await this.request(url, method);
        } catch (err) {
          this.logger.info(
            { code: err.code, err, url },
            'Error sending request',
          );
          throw err;
        }

        if (response.ok) {
          return response;
        }

        try {
          const errorBody: { status?: number; message?: string } =
            await response.json();
          const message = errorBody.message;
          this.logger.info(
            { errMessage: message },
            'Encountered error from API',
          );
        } catch (e) {
          // pass
        }

        if (isRetryableRequest(response)) {
          throw retryableRequestError(url, response);
        } else {
          throw fatalRequestError(url, response);
        }
      },
      {
        delay: 5000,
        maxAttempts: 10,
        handleError: async (err, context) => {
          if (!err.retryable) {
            // can't retry this? just abort
            context.abort();
            return;
          }

          if (err.status === 429) {
            const retryAfter = err.retryAfter ? err.retryAfter * 1000 : 5000;
            this.logger.info(
              { retryAfter },
              `Received a rate limit error.  Waiting before retrying.`,
            );
            await sleep(retryAfter);
          }
        },
      },
    );
  }

  public async verifyAuthentication(): Promise<void> {
    const statusRoute = this.withBaseUri('api/benchmarks/v2/status');
    try {
      await this.retryRequest(statusRoute, 'GET');
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        endpoint: statusRoute,
        status: err.code,
        statusText: err.message,
      });
    }
  }

  public async getCurrentUser(): Promise<SysdigAccount> {
    const response = await this.retryRequest(
      this.withBaseUri(`api/user/me`),
      'GET',
    );
    const userResponse = await response.json();
    return userResponse.user;
  }

  public async getUserById(userId: string): Promise<SysdigAccount> {
    const response = await this.retryRequest(
      this.withBaseUri(`api/users/${userId}`),
      'GET',
    );
    const userResponse = await response.json();
    return userResponse.user;
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    pageIteratee: ResourceIteratee<SysdigUser>,
  ): Promise<void> {
    let body: PaginatedUsers;
    let offset = -1;

    do {
      offset += 1;
      const endpoint = this.withBaseUri(
        `api/v2/users/light?limit=${this.paginateEntitiesPerPage}&offset=${offset}`,
      );
      const response = await this.retryRequest(endpoint, 'GET');

      body = await response.json();

      for (const user of body.users) {
        await pageIteratee(user);
      }
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.total);
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iterateTeams(
    pageIteratee: ResourceIteratee<SysdigTeam>,
  ): Promise<void> {
    let body: PaginatedTeams;
    let offset = -1;

    do {
      offset += 1;
      const endpoint = this.withBaseUri(
        `api/v2/teams/light?limit=${this.paginateEntitiesPerPage}&offset=${offset}`,
      );
      const response = await this.retryRequest(endpoint, 'GET');

      body = await response.json();

      for (const team of body.teams) {
        await pageIteratee(team);
      }
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.total);
  }

  /**
   * Iterates each image scan resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iterateImageScans(
    pageIteratee: ResourceIteratee<SysdigResult>,
  ): Promise<void> {
    let body: SysdigResultResponse;
    let offset = -1;

    do {
      offset += 1;
      const endpoint = this.withBaseUri(
        `api/scanning/v1/resultsDirect?limit=${this.paginateEntitiesPerPage}&offset=${offset}`,
      );
      const response = await this.retryRequest(endpoint, 'GET');

      body = await response.json();

      if (body.results) {
        for (const result of body.results) {
          await pageIteratee(result);
        }
      }
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.metadata.total);
  }

  /**
   * Iterates each cluster resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iterateClusters(
    pageIteratee: ResourceIteratee<SysdigCluster>,
  ): Promise<void> {
    const endpoint = this.withBaseUri(`api/cloud/v2/dataSources/clusters`);
    const response = await this.retryRequest(endpoint, 'GET');
    const clusters = await response.json();

    if (clusters) {
      for (const cluster of clusters) {
        await pageIteratee(cluster);
      }
    }
  }

  /**
   * Iterates each cluster resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iterateAgents(
    pageIteratee: ResourceIteratee<SysdigAgent>,
  ): Promise<void> {
    const endpoint = this.withBaseUri(`api/cloud/v2/dataSources/agents`);
    const response = await this.retryRequest(endpoint, 'GET');
    const body = await response.json();

    if (body.details) {
      for (const agent of body.details) {
        await pageIteratee(agent);
      }
    }
  }

  /**
   * Iterates each image scan resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iterateImageScansV2(
    pageIteratee: ResourceIteratee<ImageScanV2>,
  ): Promise<void> {
    let body: PaginatedImageScansV2;
    let endpoint = this.withBaseUri(
      `api/scanning/scanresults/v2/results?limit=${this.paginateEntitiesPerPage}`,
    );

    do {
      const response = await this.retryRequest(endpoint, 'GET');

      body = await response.json();

      if (body.data?.length > 0) {
        for (const scanResult of body.data) {
          await pageIteratee(scanResult);
        }
      }

      endpoint = this.withBaseUri(
        `api/scanning/v2/results?limit=${this.paginateEntitiesPerPage}&cursor=${body.page.next}`,
      );
    } while (body.page.next);
  }

  /**
   * Fetches the details of an image scan resource in the provider.
   */
  public async fetchImageScansV2Details(imageId: string): Promise<ImageScanV2> {
    const endpoint = this.withBaseUri(
      `api/scanning/scanresults/v2/results/${imageId}`,
    );

    const response = await this.retryRequest(endpoint, 'GET');
    const body = await response.json();
    return body;
  }

  /**
   * Iterates each finding resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iterateFindings(
    imageId: string,
    pageIteratee: ResourceIteratee<VulnerablePackage>,
  ): Promise<void> {
    let body: PaginatedVulnerabilities;
    let offset = 0;
    // for testing purposes only
    // uncomment below line to limit the findings per image scan
    // offset = 62;

    do {
      const endpoint = this.withBaseUri(
        `api/scanning/scanresults/v2/results/${imageId}/vulnPkgs?limit=${this.paginateEntitiesPerPage}&offset=${offset}`,
      );
      const response = await this.retryRequest(endpoint, 'GET');

      body = await response.json();

      for (const finding of body.data) {
        await pageIteratee(finding);
      }

      offset += this.paginateEntitiesPerPage;
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.page.matched);
  }

  /**
   * Fetches the details of a finding from an image scan resource in the provider.
   */
  public async fetchFindingDetails(
    imageId: string,
    findingId: string,
  ): Promise<VulnerablePackage> {
    const endpoint = this.withBaseUri(
      `api/scanning/scanresults/v2/results/${imageId}/vulnPkgs/${findingId}`,
    );

    const response = await this.retryRequest(endpoint, 'GET');
    const body = response.json();
    return body;
  }
}

/**
 * Function for determining if a request is retryable
 * based on the returned status.
 */
function isRetryableRequest({ status }: Response): boolean {
  return (
    // 5xx error from provider (their fault, might be retryable)
    // 429 === too many requests, we got rate limited so safe to try again
    status >= 500 || status === 429
  );
}

export function createAPIClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): APIClient {
  return new APIClient(config, logger);
}
