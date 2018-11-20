import { ObjectValue } from '../values/ObjectValue';
import { assert } from '../assert';
import { PropertyKeyValue } from '../types';
import { IsPropertyKey } from './comparison/IsPropertyKey';
import { NullValue } from '../values/NullValue';
import { IsDataDescriptor } from './IsDataDescriptor';
import { IsAccessorDescriptor } from './IsAccessorDescriptor';
import { Call } from './objects/Call';
import { Realm } from '../environment/Realm';
import { Value } from '../values/Value';

// ECMA-262 9.1.8.1
export function OrdinaryGet(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  receiver: ObjectValue
): Value {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const desc = obj.__GetOwnProperty(propertyKey);
  if (!desc) {
    const parent = obj.__GetPrototypeOf();
    if (parent instanceof NullValue) return undefined;
    return parent.__Get(propertyKey, receiver);
  }

  if (IsDataDescriptor(desc)) return desc.__Value;

  assert(IsAccessorDescriptor(desc), 'Should be an accessor descriptor if not a data descriptor');

  const getter = desc.__Get;
  if (!getter) return undefined;

  return Call(realm, getter, receiver);
}
