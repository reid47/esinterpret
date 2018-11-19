import { ObjectValue } from '../values/ObjectValue';
import { assert } from '../assert';
import { PropertyKeyValue } from '../types';
import { Value } from '../values/Value';
import { IsPropertyKey } from './comparison/IsPropertyKey';
import { OrdinarySetWithOwnDescriptor } from './OrdinarySetWithOwnDescriptor';
import { Realm } from '../environment/Realm';

// ECMA-262 9.1.9.1
export function OrdinarySet(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value,
  receiver: ObjectValue
) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const ownDesc = obj.__GetOwnProperty(propertyKey);

  return OrdinarySetWithOwnDescriptor(realm, obj, propertyKey, value, receiver, ownDesc);
}
