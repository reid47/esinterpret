import { PropertyKeyValue } from '../../types';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';
import { Value } from '../../values/Value';
import { Realm } from '../../environment/Realm';
import { BooleanValue } from '../../values/BooleanValue';
import { ObjectValue } from '../../values/ObjectValue';

// ECMA-262 7.3.3
export function Set(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value,
  shouldThrow: BooleanValue
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');
  assert(shouldThrow instanceof BooleanValue, 'Should be a boolean');

  const success = obj.__Set(propertyKey, value, obj);

  if (!success && shouldThrow.value === true) {
    throw new TypeError('Failed to set');
  }

  return success;
}
