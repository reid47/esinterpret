import { getResult } from './test-helpers';

test(', operator', () => {
  let result = getResult('1, 2, 3');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(3);

  result = getResult('1, true, "hello"');
  expect(result.type).toBe('String');
  expect(result.value).toBe('hello');
});
