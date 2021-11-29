import { getMockTeam } from '../../../test/mocks';
import { createTeamEntity } from './converter';

describe('#createTeamEntity', () => {
  test('should convert to entity', () => {
    expect(createTeamEntity(getMockTeam())).toMatchSnapshot();
  });
});
