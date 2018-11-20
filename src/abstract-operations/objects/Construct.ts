import { Realm } from '../../environment/Realm';
import { FunctionValue } from '../../values/FunctionValue';
import { assert } from '../../assert';
import { IsConstructor } from '../comparison/IsConstructor';

// ECMA-262 7.3.13
export function Construct(realm: Realm, func: FunctionValue, argumentsList = [], newTarget) {
  newTarget = newTarget || func;

  assert(IsConstructor(func), 'Function should be a constructor');
  assert(IsConstructor(newTarget), 'Target should be a constructor');

  return func.__Construct(argumentsList, newTarget);
}
