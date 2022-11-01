import { createScannerEntity } from './converter';

describe('#createScannerEntity', () => {
  test('should convert to entity', () => {
    expect(createScannerEntity({ name: 'Sysdig Scanner' })).toMatchSnapshot();
  });
});
