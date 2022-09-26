import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Steps, Entities, Relationships } from '../constants';
import { createScannerEntity } from './converter';

export const SCANNER_ENTITY_KEY = 'entity:scanner';

export async function fetchScannerDetails({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  const service = {
    name: 'Sysdig Scanner',
  };

  const scannerEntity = await jobState.addEntity(createScannerEntity(service));

  await jobState.setData(SCANNER_ENTITY_KEY, scannerEntity);
  await jobState.addRelationship(
    createDirectRelationship({
      _class: RelationshipClass.HAS,
      from: accountEntity,
      to: scannerEntity,
    }),
  );
}

export const scannerSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.SCANNER,
    name: 'Fetch Scanner Details',
    entities: [Entities.SCANNER],
    relationships: [Relationships.ACCOUNT_HAS_SCANNER],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchScannerDetails,
  },
];
