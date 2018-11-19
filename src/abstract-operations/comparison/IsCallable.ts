import { Value } from '../../values/Value';
import { ObjectValue } from '../../values/ObjectValue';

// ECMA-262 7.2.3
export function IsCallable(value: Value) {
  if (!(value instanceof ObjectValue)) return false;

  if (value.__Call) return true;

  return false;
}
