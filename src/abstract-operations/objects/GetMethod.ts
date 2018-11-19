import { ObjectValue } from '../../values/ObjectValue';
import { PropertyKeyValue } from '../../types';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';
import { Value } from '../../values/Value';
import { GetV } from './GetV';
import { Realm } from '../../environment/Realm';
import { IsCallable } from '../comparison/IsCallable';

// ECMA-262 7.3.9
export function GetMethod(realm: Realm, value: Value, propertyKey: PropertyKeyValue) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const func = GetV(realm, value, propertyKey);

  if (func === undefined || func === null) {
    return undefined;
  }

  if (!IsCallable(func)) {
    throw new TypeError('Property is not a callable method');
  }

  return func;
}
