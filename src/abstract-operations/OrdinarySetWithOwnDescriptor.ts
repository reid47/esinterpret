import { ObjectValue } from '../values/ObjectValue';
import { assert } from '../assert';
import { PropertyKeyValue } from '../types';
import { Value } from '../values/Value';
import { IsPropertyKey } from './comparison/IsPropertyKey';
import { NullValue } from '../values/NullValue';
import { IsDataDescriptor } from './IsDataDescriptor';
import { IsAccessorDescriptor } from './IsAccessorDescriptor';
import { Call } from './objects/Call';
import { PropertyDescriptor } from '../values/PropertyDescriptor';
import { UndefinedValue } from '../values/UndefinedValue';
import { Realm } from '../environment/Realm';
import { BooleanValue } from '../values/BooleanValue';
import { CreateDataProperty } from './objects/CreateDataProperty';

// ECMA-262 9.1.9.2
export function OrdinarySetWithOwnDescriptor(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value,
  receiver: ObjectValue,
  ownDesc: PropertyDescriptor
) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  if (!ownDesc) {
    const parent = obj.__GetPrototypeOf();
    if (!(parent instanceof NullValue)) {
      return parent.__Set(propertyKey, value, receiver);
    } else {
      ownDesc = new PropertyDescriptor();
      ownDesc.__Value = new UndefinedValue(realm);
      ownDesc.__Writable = new BooleanValue(realm, true);
      ownDesc.__Enumerable = new BooleanValue(realm, true);
      ownDesc.__Configurable = new BooleanValue(realm, true);
    }
  }

  if (IsDataDescriptor(ownDesc)) {
    if (ownDesc.__Writable && ownDesc.__Writable.value === false) {
      return false;
    }

    if (!(receiver instanceof ObjectValue)) return false;

    const existingDescriptor = receiver.__GetOwnProperty(propertyKey);
    if (existingDescriptor) {
      if (IsAccessorDescriptor(existingDescriptor)) return false;

      if (existingDescriptor.__Writable && existingDescriptor.__Writable.value === false) {
        return false;
      }

      const valueDesc = new PropertyDescriptor();
      valueDesc.__Value = value;

      return receiver.__DefineOwnProperty(propertyKey, valueDesc);
    } else {
      return CreateDataProperty(realm, receiver, propertyKey, value);
    }
  }

  assert(
    IsAccessorDescriptor(ownDesc),
    'Should be an accessor descriptor if not a data descriptor'
  );

  const setter = ownDesc.__Set;
  if (!setter) return false;

  Call(setter, receiver, [value]);

  return true;
}
