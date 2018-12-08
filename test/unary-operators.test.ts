import { getResult } from './test-helpers';

test('- operator', () => {
  let result = getResult('-47');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(-47);

  result = getResult('-(-47)');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(47);
});

test('+ operator', () => {
  let result = getResult('+47');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(47);

  result = getResult('+(-47)');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(-47);

  result = getResult('+"hello"');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(NaN);

  result = getResult('+true');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(1);

  result = getResult('+false');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(0);
});

test('~ operator', () => {
  let result = getResult('~47');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(-48);

  result = getResult('~"hi"');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(-1);
});

test('! operator', () => {
  let result = getResult('!true');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('!false');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('!!false');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('!null');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);
});

test('typeof operator', () => {
  let result = getResult('typeof 47');
  expect(result.type).toBe('String');
  expect(result.value).toBe('number');

  result = getResult('typeof "hello"');
  expect(result.type).toBe('String');
  expect(result.value).toBe('string');

  result = getResult('typeof true');
  expect(result.type).toBe('String');
  expect(result.value).toBe('boolean');

  result = getResult('typeof false');
  expect(result.type).toBe('String');
  expect(result.value).toBe('boolean');

  result = getResult('typeof null');
  expect(result.type).toBe('String');
  expect(result.value).toBe('object');
});

test('void operator', () => {
  let result = getResult('void 47');
  expect(result.type).toBe('Undefined');
  expect(result.value).toBe(undefined);

  result = getResult('void (+"hello")');
  expect(result.type).toBe('Undefined');
  expect(result.value).toBe(undefined);
});
