import { ObjectValue } from '../../values/ObjectValue';
import { PropertyKeyValue } from '../../types';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';
import { Realm } from '../../environment/Realm';
import { PropertyDescriptor } from '../../values/PropertyDescriptor';

// ECMA-262 7.3.7
export function DefinePropertyOrThrow(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  desc: PropertyDescriptor
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const success = obj.__DefineOwnProperty(propertyKey, desc);

  if (!success) {
    throw new TypeError('Failed to define property');
  }

  return success;
}
