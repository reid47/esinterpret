import { ObjectValue } from '../../values/ObjectValue';
import { assert } from '../../assert';

// ECMA-262 7.2.5
export function IsExtensible(obj: ObjectValue) {
  assert(obj instanceof ObjectValue, 'Should be an object');

  return obj.__IsExtensible();
}
