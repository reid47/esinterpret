import { Interpreter } from '../src/Interpreter';
import { NumberValue } from '../src/operations';

test('works', () => {
  const int = new Interpreter();
  const result = int.evaluateScript('47');

  expect(result).toBeInstanceOf(NumberValue);
  expect(result.toPlainValue()).toBe(47);
});
