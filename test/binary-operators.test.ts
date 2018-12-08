import { getResult } from './test-helpers';

test('** operator', () => {
  let result = getResult('4 ** 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(16);

  result = getResult('3 ** 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(9);

  result = getResult('(-4) ** 5');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(-1024);
});

test('* operator', () => {
  let result = getResult('4 * 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(8);

  result = getResult('3 * 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(6);

  result = getResult('(-4) * 5');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(-20);
});

test('/ operator', () => {
  let result = getResult('4 / 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(2);

  result = getResult('1024 / 5');
  expect(result.type).toBe('Number');
  expect(result.value).toBeCloseTo(204.8);

  result = getResult('100 / -5');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(-20);
});

test('% operator', () => {
  let result = getResult('4 % 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(0);

  result = getResult('1024 % 5');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(4);
});

test('+ operator', () => {
  let result = getResult('4 + 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(6);

  result = getResult('1024 + 5');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(1029);
});

test('- operator', () => {
  let result = getResult('4 - 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(2);

  result = getResult('1024 - 5');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(1019);
});

test('<< operator', () => {
  let result = getResult('4 << 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(16);

  result = getResult('1024 << 5');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(32768);
});

test('>> operator', () => {
  let result = getResult('4 >> 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(1);

  result = getResult('1024 >> 5');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(32);

  result = getResult('-10 >> 3');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(-2);
});

test('>>> operator', () => {
  let result = getResult('4 >>> 2');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(1);

  result = getResult('-1024 >>> 10');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(4194303);
});

test('< operator', () => {
  let result = getResult('4 < 2');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('4 < 4');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('-3 < 10');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('"a" < "b"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('"a" < "apple"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);
});

test('> operator', () => {
  let result = getResult('4 > 2');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('4 > 4');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('-3 > 10');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('"a" > "b"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('"a" > "apple"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);
});

test('<= operator', () => {
  let result = getResult('4 <= 2');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('4 <= 4');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('-3 <= 10');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('"a" <= "b"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('"a" <= "apple"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);
});

test('>= operator', () => {
  let result = getResult('4 >= 2');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('4 >= 4');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('-3 >= 10');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('"a" >= "b"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('"a" >= "apple"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);
});

test('== operator', () => {
  let result = getResult('4 == 4');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('4 == "4"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('4 == 5');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('4 == "5"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);
});

test('!= operator', () => {
  let result = getResult('4 != 5');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('4 != "5"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('4 != 4');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('4 != "4"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);
});

test('=== operator', () => {
  let result = getResult('4 === 4');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('4 === "4"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('4 === 5');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('4 === "5"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);
});

test('!== operator', () => {
  let result = getResult('4 !== 5');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('4 !== "5"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('4 !== 4');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('4 !== "4"');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);
});

test('& operator', () => {
  let result = getResult('12345 & 123');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(57);

  result = getResult('12345 & "hello"');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(0);

  result = getResult('12345 & "123"');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(57);
});

test('^ operator', () => {
  let result = getResult('12345 ^ 123');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(12354);

  result = getResult('12345 ^ "hello"');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(12345);

  result = getResult('12345 ^ "123"');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(12354);
});

test('| operator', () => {
  let result = getResult('12345 | 123');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(12411);

  result = getResult('12345 | "hello"');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(12345);

  result = getResult('12345 | "123"');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(12411);
});

test('&& operator', () => {
  let result = getResult('true && true');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('true && 1');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(1);

  result = getResult('1 && true');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('true && false');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);
});

test('|| operator', () => {
  let result = getResult('true || true');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('true || 0');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('0 || true');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('true || false');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(true);

  result = getResult('false || false');
  expect(result.type).toBe('Boolean');
  expect(result.value).toBe(false);

  result = getResult('47 || false');
  expect(result.type).toBe('Number');
  expect(result.value).toBe(47);
});
