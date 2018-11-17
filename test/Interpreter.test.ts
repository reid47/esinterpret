import { Interpreter } from '../src/Interpreter';

let int;

beforeEach(() => {
  int = new Interpreter();
});

test('works', () => {
  expect(int.interpret()).toBeTruthy();
});
