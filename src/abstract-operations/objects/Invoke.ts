import { PropertyKeyValue } from '../../types';
import { Value } from '../../values/Value';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';
import { Realm } from '../../environment/Realm';
import { GetV } from './GetV';
import { Call } from './Call';

// ECMA-262 7.3.18
export function Invoke(
  realm: Realm,
  value: Value,
  propertyKey: PropertyKeyValue,
  argumentsList: Value[] = []
) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const func = GetV(realm, value, propertyKey);

  return Call(realm, func, value, argumentsList);
}
