import {
  createIntegrationEntity,
  createMappedRelationship,
  Entity,
  parseTimePropertyValue,
  Relationship,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { Vulnerability, VulnerablePackage } from '../../types';

import { Entities, MappedRelationships } from '../constants';

export function getFindingKey(id: string): string {
  return `sysdig_finding:${id}`;
}

function getSeverity(score: number): string {
  switch (score) {
    case 7:
      return 'Negligible';
    case 6:
      return 'Low';
    case 5:
      return 'Medium';
    case 3:
      return 'High';
    case 2:
      return 'Critical';
    default:
      return 'Unknown';
  }
}

export function createFindingEntity(data: VulnerablePackage): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getFindingKey(data.id),
        _type: Entities.FINDING._type,
        _class: Entities.FINDING._class,
        id: data.id,
        name: data.vuln.name,
        category: 'Package',
        severity: getSeverity(data.vuln.severity.value),
        numericSeverity: data.vuln.severity.value,
        open: true,
        'vulnerability.name': data.vuln.name,
        'vulnerability.severity.reporter.name':
          data.vuln.severity.reporter.name,
        'vulnerability.severity.reporter.url':
          data.vuln.severity.reporter.url ?? '',
        'vulnerability.severity.value': data.vuln.severity.value,
        'vulnerability.cvssScore.reporter.name':
          data.vuln.cvssScore.reporter.name,
        'vulnerability.cvssScore.reporter.url':
          data.vuln.cvssScore.reporter.url ?? '',
        'vulnerability.cvssScore.value.version':
          data.vuln.cvssScore.value.version,
        'vulnerability.cvssScore.value.score': data.vuln.cvssScore.value.score,
        'vulnerability.cvssScore.value.vector':
          data.vuln.cvssScore.value.vector,
        'vulnerability.exploitable': data.vuln.exploitable,
        'vulnerability.exploit': data.vuln.exploit ?? '',
        'vulnerability.description': data.vuln.description,
        'vulnerability.disclosureDate': parseTimePropertyValue(
          data.vuln.disclosureDate,
        ),
        'vulnerability.solutionDate': parseTimePropertyValue(
          data.vuln.solutionDate,
        ),
        'package.id': data.package.id,
        'package.name': data.package.name,
        'package.version': data.package.version,
        'package.type': data.package.type,
        'package.path': data.package.path,
        'package.running': data.package.running,
        fixedInVersion: data.vuln.name,
      },
    },
  });
}

export function createFindingCveRelationship(
  finding: Entity,
  cve: Vulnerability,
): Relationship {
  const disclosureDate = parseTimePropertyValue(cve.disclosureDate);
  const solutionDate = parseTimePropertyValue(cve.solutionDate);

  return createMappedRelationship({
    _class: RelationshipClass.IS,
    _type: MappedRelationships.FINDING_IS_CVE._type,
    _mapping: {
      sourceEntityKey: finding._key,
      relationshipDirection: RelationshipDirection.FORWARD,
      skipTargetCreation: false,
      targetFilterKeys: [['_type', '_key']],
      targetEntity: {
        _key: cve.name.toLowerCase(),
        _type: Entities.CVE._type,
        id: cve.name,
        score: cve.cvssScore.value.score,
        name: cve.name,
        displayName: cve.name,
        'severity.reporter.name': cve.severity.reporter.name,
        'severity.reporter.url': cve.severity.reporter.url ?? '',
        'severity.value': cve.severity.value,
        'cvssScore.reporter.name': cve.cvssScore.reporter.name,
        'cvssScore.reporter.url': cve.cvssScore.reporter.url ?? '',
        'cvssScore.value.version': cve.cvssScore.value.version,
        'cvssScore.value.score': cve.cvssScore.value.score,
        'cvssScore.value.vector': cve.cvssScore.value.vector,
        exploitable: cve.exploitable,
        exploit: cve.exploit ?? '',
        description: cve.description,
        disclosureDate: disclosureDate,
        solutionDate: solutionDate,
      },
    },
  });
}
