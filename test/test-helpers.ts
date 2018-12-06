import { Interpreter } from '../src/Interpreter';

export function getResult(code: string) {
  const interp = new Interpreter();
  return interp.evaluateScript(code);
}
