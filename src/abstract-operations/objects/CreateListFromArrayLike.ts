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
import { UndefinedValue } from '../../values/UndefinedValue';
import { NullValue } from '../../values/NullValue';
import { StringValue } from '../../values/StringValue';
import { SymbolValue } from '../../values/SymbolValue';
import { ToLength } from '../type-conversion/ToLength';
import { Get } from './Get';

// ECMA-262 7.3.17
export function CreateListFromArrayLike(realm: Realm, obj: ObjectValue, elementTypes) {
  elementTypes = elementTypes || [
    UndefinedValue,
    NullValue,
    BooleanValue,
    StringValue,
    SymbolValue,
    NumberValue,
    ObjectValue
  ];

  if (!(obj instanceof ObjectValue)) {
    throw new TypeError('Should be an object');
  }

  const len = ToLength(realm, Get(obj, new StringValue(realm, 'length'))).value;
  const list = [];

  for (let index = 0; index < len; index++) {
    const indexName = ToString(realm, new NumberValue(realm, index));
    const next = Get(obj, indexName);

    if (!elementTypes.contains(next.getType())) {
      throw new TypeError('Disallowed type in list');
    }

    list.push(next);
  }

  return list;
}
