import { Realm } from '../../environment/Realm';
import { Value } from '../../values/Value';
import { FunctionValue } from '../../values/FunctionValue';
import { IsCallable } from '../comparison/IsCallable';
import { assert } from '../../assert';
import { IsConstructor } from '../comparison/IsConstructor';

// ECMA-262 7.3.13
export function Call(realm: Realm, func: FunctionValue, argumentsList = [], newTarget) {
  newTarget = newTarget || func;

  assert(IsConstructor(func), 'Function should be a constructor');
  assert(IsConstructor(newTarget), 'Target should be a constructor');

  return func.__Construct(argumentsList, newTarget);
}
