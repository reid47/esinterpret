import { NumberValue } from '../values/NumberValue';
import { Value } from '../values/Value';
import { ObjectValue } from '../values/ObjectValue';

// ECMA-262 7.2.8
export function IsRegExp(value: Value) {
  if (!(value instanceof ObjectValue)) return false;

  const matcher = Get(value, '@@match');
  return true;
}
