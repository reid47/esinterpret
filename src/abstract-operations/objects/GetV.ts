import { PropertyKeyValue } from '../../types';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';
import { Value } from '../../values/Value';
import { ToObject } from '../type-conversion/ToObject';
import { Realm } from '../../environment/Realm';

// ECMA-262 7.3.2
export function GetV(realm: Realm, value: Value, propertyKey: PropertyKeyValue) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const obj = ToObject(realm, value);

  return obj.__Get(propertyKey, obj);
}
