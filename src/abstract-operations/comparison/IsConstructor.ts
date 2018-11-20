import { Value } from '../../values/Value';
import { FunctionValue } from '../../values/FunctionValue';

// ECMA-262 7.2.4
export function IsConstructor(value: Value) {
  if (!(value instanceof FunctionValue)) return false;

  if (value.__Construct) return true;

  return false;
}
