import { getMockImageScan } from '../../../test/mocks';
import { createImageScanEntity } from './converter';

describe('#createImageScanEntity', () => {
  test('should convert to entity', () => {
    expect(createImageScanEntity(getMockImageScan())).toMatchSnapshot();
  });
});
