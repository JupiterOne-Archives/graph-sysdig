import { getMockAgent } from '../../../test/mocks';
import { createAgentEntity } from './converter';

describe('#createAgentEntity', () => {
  test('should convert to entity', () => {
    expect(createAgentEntity(getMockAgent())).toMatchSnapshot();
  });
});
