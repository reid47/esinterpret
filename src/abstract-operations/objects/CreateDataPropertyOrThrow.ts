import { ObjectValue } from '../../values/ObjectValue';
import { PropertyKeyValue } from '../../types';
import { Value } from '../../values/Value';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';
import { Realm } from '../../environment/Realm';
import { CreateDataProperty } from './CreateDataProperty';

// ECMA-262 7.3.6
export function CreateDataPropertyOrThrow(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const success = CreateDataProperty(realm, obj, propertyKey, value);

  if (!success) {
    throw new TypeError('Failed to create data property');
  }

  return success;
}
