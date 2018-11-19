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
import { ArrayExotic } from '../../values/ArrayExotic';
import { OrdinaryDefineOwnProperty } from '../OrdinaryDefineOwnProperty';
import { StringValue } from '../../values/StringValue';

// ECMA-262 9.4.2.2
export function ArrayCreate(realm: Realm, length: NumberValue, proto?: ObjectValue) {
  assert(length instanceof NumberValue, 'Length should a number');
  assert(length.value >= 0, 'Length should be >= 0');

  if (Object.is(-0, length.value)) {
    length.value = +0;
  }

  if (length.value > Math.pow(2, 32) - 1) {
    throw new RangeError('Length out of range');
  }

  proto = proto || realm.__Intrinsics.__ArrayPrototype;

  const array = new ArrayExotic(realm);

  array.__Prototype = proto;
  array.__Extensible = new BooleanValue(realm, true);

  const lengthDesc = new PropertyDescriptor();
  lengthDesc.__Value = length;
  lengthDesc.__Writable = new BooleanValue(realm, true);
  lengthDesc.__Enumerable = new BooleanValue(realm, false);
  lengthDesc.__Configurable = new BooleanValue(realm, false);
  OrdinaryDefineOwnProperty(realm, array, new StringValue(realm, 'length'), lengthDesc);

  return array;
}
