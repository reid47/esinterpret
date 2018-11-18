import { ObjectValue } from '../values/ObjectValue';
import { PropertyKeyValue } from '../types';
import { Value } from '../values/Value';
import { assert } from '../assert';
import { IsPropertyKey } from './IsPropertyKey';
import { PropertyDescriptor } from '../values/PropertyDescriptor';
import { Realm } from '../environment/Realm';
import { BooleanValue } from '../values/BooleanValue';

// ECMA-262 7.3.4
export function CreateDataProperty(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const newDesc = new PropertyDescriptor();
  newDesc.__Value = value;
  newDesc.__Writable = new BooleanValue(realm, true);
  newDesc.__Enumerable = new BooleanValue(realm, true);
  newDesc.__Configurable = new BooleanValue(realm, true);

  return obj.__DefineOwnProperty(propertyKey, newDesc);
}
