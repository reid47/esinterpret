import { ObjectValue } from '../../values/ObjectValue';
import { PropertyKeyValue } from '../../types';
import { Value } from '../../values/Value';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';
import { PropertyDescriptor } from '../../values/PropertyDescriptor';
import { Realm } from '../../environment/Realm';
import { BooleanValue } from '../../values/BooleanValue';
import { CreateDataProperty } from './CreateDataProperty';
import { ToString } from '../type-conversion/ToString';
import { NumberValue } from '../../values/NumberValue';
import { ArrayCreate } from './ArrayCreate';

// ECMA-262 7.3.16
export function CreateArrayFromList(realm: Realm, elements: Value[]) {
  assert(Array.isArray(elements), 'Should be an array of elements');
  assert(elements.every(el => el instanceof Value), 'All elements should be values');

  const array = ArrayCreate(realm, new NumberValue(realm, 0));

  for (let n = 0, len = elements.length; n < len; n++) {
    const status = CreateDataProperty(
      realm,
      array,
      ToString(realm, new NumberValue(realm, n)),
      elements[n]
    );

    assert(status, 'Failed to create element');
  }

  return array;
}
