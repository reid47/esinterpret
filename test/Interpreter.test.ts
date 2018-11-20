import { Interpreter } from '../src/Interpreter';

test('works', () => {
  const int = new Interpreter();
  const result = int.evaluateScript('2 + 2');
  // const int = interpret('2 + 2');

  console.log(result);
});
