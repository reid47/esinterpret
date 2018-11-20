import { Realm } from '../../environment/Realm';
import { Value } from '../../values/Value';
import { FunctionValue } from '../../values/FunctionValue';
import { IsCallable } from '../comparison/IsCallable';

// ECMA-262 7.3.12
export function Call(realm: Realm, func: Value, thisValue: Value, argumentsList = []) {
  if (!IsCallable(func)) {
    // TODO: abrupt completion
    throw new TypeError('Not callable');
  }

  return (func as FunctionValue).__Call(thisValue, argumentsList);
}
