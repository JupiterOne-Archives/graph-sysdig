import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  Steps,
  Entities,
  Relationships,
  MappedRelationships,
} from '../constants';
import { createFindingCveRelationship, createFindingEntity } from './converter';

export async function fetchFindings({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.IMAGE_SCAN._type },
    async (imageScanEntity) => {
      if (imageScanEntity?.id) {
        await apiClient.iterateFindings(
          imageScanEntity.id as string,
          async (vulnerability) => {
            const vulnerabilityDetails = await apiClient.fetchFindingDetails(
              imageScanEntity.id as string,
              vulnerability.id,
            );

            const findingEntity = await jobState.addEntity(
              createFindingEntity(vulnerabilityDetails),
            );

            await jobState.addRelationships([
              createDirectRelationship({
                _class: RelationshipClass.IDENTIFIED,
                from: imageScanEntity,
                to: findingEntity,
              }),

              createFindingCveRelationship(
                findingEntity,
                vulnerabilityDetails.vuln,
              ),
            ]);
          },
        );
      }
    },
  );
}

export const findingsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FINDINGS,
    name: 'Fetch Findings',
    entities: [Entities.FINDING],
    relationships: [Relationships.IMAGE_SCAN_IDENTIFIED_FINDING],
    mappedRelationships: [MappedRelationships.FINDING_IS_CVE],
    dependsOn: [Steps.IMAGE_SCANS],
    executionHandler: fetchFindings,
  },
];
