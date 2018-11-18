import { Realm } from '../environment/Realm';
import { ObjectValue } from '../values/ObjectValue';
import { PropertyKeyValue } from '../types';
import { assert } from '../assert';
import { IsPropertyKey } from './IsPropertyKey';
import { NullValue } from '../values/NullValue';

// ECMA-262 9.1.7.1
export function OrdinaryHasProperty(realm: Realm, obj: ObjectValue, propertyKey: PropertyKeyValue) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const hasOwn = obj.__GetOwnProperty(propertyKey);
  if (hasOwn) return true;

  const parent = obj.__GetPrototypeOf();
  if (!(parent instanceof NullValue)) {
    return parent.__HasProperty(propertyKey);
  }

  return false;
}
