import fetch, { Response } from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  PaginatedTeams,
  PaginatedUsers,
  SysdigAccount,
  SysdigResult,
  SysdigResultResponse,
  SysdigTeam,
  SysdigUser,
} from './types';

export type ResourceIteratee<T> = (page: T) => Promise<void>;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private readonly paginateEntitiesPerPage = 250;

  private withBaseUri(path: string): string {
    return `https://${this.config.region}.app.sysdig.com/${path}`;
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
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    if (!response.ok) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: response.status,
        statusText: response.statusText,
      });
    }
    return response;
  }

  public async verifyAuthentication(): Promise<void> {
    const statusRoute = this.withBaseUri('api/v1/secure/overview/status');
    try {
      await this.request(statusRoute, 'GET');
    } catch (err) {
      return;
      // TODO INT:5412  @zemberdotnet
      // reenable auth
      /*
      throw new IntegrationProviderAuthenticationError({
        endpoint: statusRoute,
        status: err.code,
        statusText: err.message,
      });
      */
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
   * @param iteratee receives each resource to produce entities/relationships
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

      if (!response.ok) {
        throw new IntegrationProviderAPIError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      }

      body = await response.json();

      for (const user of body.users) {
        await pageIteratee(user);
      }
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.total);
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
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

      if (!response.ok) {
        throw new IntegrationProviderAPIError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      }

      body = await response.json();

      for (const team of body.teams) {
        await pageIteratee(team);
      }
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.total);
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
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

      if (!response.ok) {
        throw new IntegrationProviderAPIError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      }

      body = await response.json();

      for (const result of body.results) {
        await pageIteratee(result);
      }
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.metadata.total);
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
