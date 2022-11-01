import { getMockImageScanV2 } from '../../../test/mocks';
import { createImageScanEntityV2 } from './converter';

describe('#createImageScanEntity', () => {
  test('should convert to entity', () => {
    expect(createImageScanEntityV2(getMockImageScanV2())).toMatchSnapshot();
  });
});
