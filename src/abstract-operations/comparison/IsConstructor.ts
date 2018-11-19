import { Value } from '../../values/Value';
import { ObjectValue } from '../../values/ObjectValue';

// ECMA-262 7.2.4
export function IsConstructor(value: Value) {
  if (!(value instanceof ObjectValue)) return false;

  if (value.__Construct) return true;

  return false;
}
