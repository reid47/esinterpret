import { Interpreter } from '../src/Interpreter';
import { parse } from '@babel/parser';

const interpret = code => {
  const ast = parse(code);
  return new Interpreter({ ast });
};

test('works', () => {
  const int = interpret('47');
  // const int = interpret('2 + 2');

  expect(int.lastExpressionValue()).toBe(47);
});
