import { Realm } from '../../environment/Realm';
import { Value } from '../../values/Value';
import { FunctionValue } from '../../values/FunctionValue';
import { IsCallable } from '../comparison/IsCallable';
import { ObjectValue } from '../../values/ObjectValue';
import { assert } from '../../assert';
import { BoundFunctionExotic } from '../../values/BoundFunctionExotic';
import { ProxyValue } from '../../values/ProxyValue';

// ECMA-262 7.3.22
export function GetFunctionRealm(realm: Realm, obj: ObjectValue) {
  assert(obj instanceof ObjectValue && IsCallable(obj), 'should be a callable object');

  if (obj.__Realm) return obj.__Realm;

  if (obj instanceof BoundFunctionExotic) {
    const target = obj.__BoundTargetFunction;
    return GetFunctionRealm(realm, target);
  }

  if (obj instanceof ProxyValue) {
    const proxyTarget = obj.__ProxyTarget;

    if (proxyTarget === null) {
      throw new TypeError('null proxy target');
    }

    return GetFunctionRealm(realm, proxyTarget);
  }

  return realm;
}
