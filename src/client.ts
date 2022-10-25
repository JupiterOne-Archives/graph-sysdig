import fetch, { Response } from 'node-fetch';
import { retry } from '@lifeomic/attempt';
import {
  IntegrationProviderAPIError,
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
  SysdigResult,
  SysdigResultResponse,
  SysdigTeam,
  SysdigUser,
  VulnerablePackage,
} from './types';
import { URL_FORMAT } from './regions';

export type ResourceIteratee<T> = (page: T) => Promise<void>;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {
    if (URL_FORMAT.REGION_APP.includes(config.region)) {
      this.baseUri = `https://${this.config.region}.app.sysdig.com`;
    } else {
      this.baseUri = `https://app.${this.config.region}.sysdig.com`;
    }
  }

  private readonly paginateEntitiesPerPage = 100; // some endpoints have a maximum of 100 entities per call
  private baseUri: string;
  private withBaseUri(path: string): string {
    return `${this.baseUri}/${path}`;
  }

  private checkStatus = (response: Response) => {
    if (response.ok) {
      return response;
    } else {
      throw new IntegrationProviderAPIError(response);
    }
  };

  private async request(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<Response> {
    try {
      // Handle rate-limiting
      const response = await retry(
        async () => {
          const res: Response = await fetch(uri, {
            method,
            headers: {
              Authorization: `Bearer ${this.config.apiToken}`,
              Accept: 'application/json',
            },
          });
          return this.checkStatus(res);
        },
        {
          delay: 5000,
          maxAttempts: 10,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            )
              context.abort();
          },
        },
      );
      return response;
    } catch (err) {
      //eslint-disable-next-line
      console.error(JSON.stringify(err));
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const statusRoute = this.withBaseUri('api/benchmarks/v2/status');
    try {
      await this.request(statusRoute, 'GET');
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        endpoint: statusRoute,
        status: err.code,
        statusText: err.message,
      });
    }
  }

  public async getCurrentUser(): Promise<SysdigAccount> {
    const response = await this.request(this.withBaseUri(`api/user/me`), 'GET');
    const userResponse = await response.json();
    return userResponse.user;
  }

  public async getUserById(userId: string): Promise<SysdigAccount> {
    const response = await this.request(
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
      const response = await this.request(endpoint, 'GET');

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
      const response = await this.request(endpoint, 'GET');

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
      const response = await this.request(endpoint, 'GET');

      body = await response.json();

      if (body.results) {
        for (const result of body.results) {
          await pageIteratee(result);
        }
      }
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.metadata.total);
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
      const response = await this.request(endpoint, 'GET');

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

    const response = await this.request(endpoint, 'GET');
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
      const response = await this.request(endpoint, 'GET');

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

    const response = await this.request(endpoint, 'GET');
    const body = response.json();
    return body;
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
