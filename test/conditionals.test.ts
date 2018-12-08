import { getResult } from './test-helpers';

test('ternary', () => {
  let result = getResult('true ? 47 : 0');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(47);

  result = getResult('"wow" ? 47 : 0');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(47);

  result = getResult('0 ? 47 : 0');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(0);

  result = getResult('false ? 1 : 0 ? 2 : 3');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(3);
});
