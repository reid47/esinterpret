import { getResult } from './test-helpers';

test('numeric literals', () => {
  let result = getResult('47');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(47);

  result = getResult('-47');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(-47);
});

test('string literals', () => {
  const result = getResult('1; "hello!"');
  expect(result.type).toBe('String');
  expect(result.value).toBe('hello!');
});

test('boolean literals', () => {
  let result = getResult('true');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('false');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);
});

test('null literals', () => {
  const result = getResult('null');
  expect(result.type).toBe('Null');
  expect(result.value).toBe(null);
});
