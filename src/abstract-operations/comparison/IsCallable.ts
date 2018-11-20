import { Value } from '../../values/Value';
import { FunctionValue } from '../../values/FunctionValue';

// ECMA-262 7.2.3
export function IsCallable(value: Value) {
  if (!(value instanceof FunctionValue)) return false;

  if (value.__Call) return true;

  return false;
}
