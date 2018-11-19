import { ObjectValue } from '../../values/ObjectValue';
import { PropertyKeyValue } from '../../types';
import { Value } from '../../values/Value';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';
import { PropertyDescriptor } from '../../values/PropertyDescriptor';
import { Realm } from '../../environment/Realm';
import { BooleanValue } from '../../values/BooleanValue';
import { UndefinedValue } from '../../values/UndefinedValue';
import { NullValue } from '../../values/NullValue';
import { ToObject } from '../type-conversion/ToObject';
import { SameValue } from '../comparison/SameValue';
import { Get } from './Get';
import { CreateDataProperty } from './CreateDataProperty';

// ECMA-262 7.3.23
export function CopyDataProperties(
  realm: Realm,
  target: ObjectValue,
  source: ObjectValue,
  excludedItems: PropertyKeyValue[]
) {
  assert(target instanceof ObjectValue, 'Should be an object');
  assert(Array.isArray(excludedItems), 'should be a list');

  if (source instanceof UndefinedValue || source instanceof NullValue) {
    return target;
  }

  const from = ToObject(realm, source);
  const keys = from.__OwnPropertyKeys();

  for (const nextKey of keys) {
    let excluded = false;

    for (const excludedItem of excludedItems) {
      if (SameValue(excludedItem, nextKey)) {
        excluded = true;
      }
    }

    if (!excluded) {
      const desc = from.__GetOwnProperty(nextKey);

      if (desc && desc.__Enumerable && desc.__Enumerable.value === true) {
        const propValue = Get(from, nextKey);
        CreateDataProperty(realm, target, nextKey, propValue);
      }
    }
  }

  return target;
}
