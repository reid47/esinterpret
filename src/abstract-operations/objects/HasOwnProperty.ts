import { ObjectValue } from '../../values/ObjectValue';
import { PropertyKeyValue } from '../../types';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';

// ECMA-262 7.3.11
export function HasOwnProperty(obj: ObjectValue, propertyKey: PropertyKeyValue) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const desc = obj.__GetOwnProperty(propertyKey);

  if (!desc) return false;

  return true;
}
