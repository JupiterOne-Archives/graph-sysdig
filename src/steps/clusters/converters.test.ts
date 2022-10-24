import { getMockCluster } from '../../../test/mocks';
import { createClusterEntity } from './converter';

describe('#createClusterEntity', () => {
  test('should convert to entity', () => {
    expect(createClusterEntity(getMockCluster())).toMatchSnapshot();
  });
});
