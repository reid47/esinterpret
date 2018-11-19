import { ObjectValue } from '../../values/ObjectValue';
import { PropertyKeyValue } from '../../types';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';
import { Realm } from '../../environment/Realm';

// ECMA-262 7.3.8
export function DeletePropertyOrThrow(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const success = obj.__Delete(propertyKey);

  if (!success) {
    throw new TypeError('Failed to delete property');
  }

  return success;
}
