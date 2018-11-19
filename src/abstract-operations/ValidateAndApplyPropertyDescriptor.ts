import { ObjectValue } from '../values/ObjectValue';
import { PropertyKeyValue } from '../types';
import { BooleanValue } from '../values/BooleanValue';
import { PropertyDescriptor } from '../values/PropertyDescriptor';
import { UndefinedValue } from '../values/UndefinedValue';
import { assert } from '../assert';
import { IsPropertyKey } from './comparison/IsPropertyKey';
import { IsGenericDescriptor } from './IsGenericDescriptor';
import { IsDataDescriptor } from './IsDataDescriptor';
import { Realm } from '../environment/Realm';
import { SameValue } from './comparison/SameValue';

// ECMA-262 9.1.6.3
export function ValidateAndApplyPropertyDescriptor(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  extensible: BooleanValue,
  desc: PropertyDescriptor,
  current?: PropertyDescriptor
) {
  // 1.
  if (!(obj instanceof UndefinedValue)) {
    assert(IsPropertyKey(propertyKey), 'Should be a valid property key');
  }

  // 2.
  if (!current) {
    if (extensible.value === false) return false;

    assert(extensible.value === true, 'Should be extensible');

    if (IsGenericDescriptor(desc) || IsDataDescriptor(desc)) {
      if (!(obj instanceof UndefinedValue)) {
        const newDescriptor = new PropertyDescriptor();

        newDescriptor.__Value = desc.__Value || new UndefinedValue(realm);
        newDescriptor.__Writable = desc.__Writable || new BooleanValue(realm, false);
        newDescriptor.__Enumerable = desc.__Enumerable || new BooleanValue(realm, false);
        newDescriptor.__Configurable = desc.__Configurable || new BooleanValue(realm, false);

        obj.__InternalSetPropertyBinding(propertyKey, newDescriptor);
      }
    } else {
      if (!(obj instanceof UndefinedValue)) {
        const newDescriptor = new PropertyDescriptor();

        newDescriptor.__Get = desc.__Get || new UndefinedValue(realm);
        newDescriptor.__Set = desc.__Set || new UndefinedValue(realm);
        newDescriptor.__Enumerable = desc.__Enumerable || new BooleanValue(realm, false);
        newDescriptor.__Configurable = desc.__Configurable || new BooleanValue(realm, false);

        obj.__InternalSetPropertyBinding(propertyKey, newDescriptor);
      }
    }

    return true;
  }

  // 3.
  if (
    !desc.__Value &&
    !desc.__Writable &&
    !desc.__Get &&
    !desc.__Set &&
    !desc.__Enumerable &&
    !desc.__Configurable
  ) {
    return true;
  }

  // 4.
  if (current.__Configurable && current.__Configurable.value === false) {
    if (desc.__Configurable && desc.__Configurable.value === true) {
      return false;
    }

    if (desc.__Enumerable && current.__Enumerable.value === !desc.__Enumerable.value) {
      return false;
    }
  }

  if (IsGenericDescriptor(desc)) {
    // 5.
  } else if (IsDataDescriptor(current) !== IsDataDescriptor(desc)) {
    // 6.
    if (current.__Configurable.value === false) return false;

    if (IsDataDescriptor(current)) {
      if (!(obj instanceof UndefinedValue)) {
        current.__Writable = undefined;
        current.__Value = undefined;
        current.__Get = new UndefinedValue(realm);
        current.__Set = new UndefinedValue(realm);
      }
    } else {
      if (!(obj instanceof UndefinedValue)) {
        current.__Get = undefined;
        current.__Set = undefined;
        current.__Writable = new BooleanValue(realm, false);
        current.__Value = new UndefinedValue(realm);
      }
    }
  } else if (IsDataDescriptor(current) && IsDataDescriptor(desc)) {
    // 7.
    if (
      current.__Configurable &&
      current.__Configurable.value === false &&
      current.__Writable &&
      current.__Writable.value === false
    ) {
      if (desc.__Writable && desc.__Writable.value) return false;
      if (desc.__Value && !SameValue(desc.__Value, current.__Value)) return false;
      return true;
    }
  } else {
    // 8.
    if (current.__Configurable && current.__Configurable.value === false) {
      if (desc.__Set && !SameValue(desc.__Set, current.__Set)) return false;
      if (desc.__Get && !SameValue(desc.__Get, current.__Get)) return false;
      return true;
    }
  }

  // 9.
  if (!(obj instanceof UndefinedValue)) {
    for (const field in desc) {
      if (desc[field] !== undefined) {
        current[field] = desc[field];
      }
    }
  }

  // 10.
  return true;
}
