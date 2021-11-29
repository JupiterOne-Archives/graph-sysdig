import { getMockUser } from '../../../test/mocks';
import { createUserEntity } from './converter';

describe('#createUserEntity', () => {
  test('should convert to entity', () => {
    expect(createUserEntity(getMockUser())).toMatchSnapshot();
  });
});
