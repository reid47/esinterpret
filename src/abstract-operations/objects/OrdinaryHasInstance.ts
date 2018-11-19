import { PropertyKeyValue } from '../../types';
import { Value } from '../../values/Value';
import { assert } from '../../assert';
import { IsPropertyKey } from '../comparison/IsPropertyKey';
import { Realm } from '../../environment/Realm';
import { GetV } from './GetV';
import { Call } from './Call';
import { FunctionValue } from '../../values/FunctionValue';
import { ObjectValue } from '../../values/ObjectValue';
import { IsCallable } from '../comparison/IsCallable';
import { Get } from './Get';
import { NullValue } from '../../values/NullValue';
import { SameValue } from '../comparison/SameValue';
import InstanceofOperator from '../operators/InstanceofOperator';
import { StringValue } from '../../values/StringValue';

// ECMA-262 7.3.19
export function OrdinaryHasInstance(realm: Realm, ctor: FunctionValue, obj: ObjectValue) {
  if (!IsCallable(ctor)) return false;

  if (ctor.__BoundTargetFunction) {
    const boundCtor = ctor.__BoundTargetFunction;
    return InstanceofOperator(realm, obj, boundCtor);
  }

  if (!(obj instanceof ObjectValue)) return false;

  const proto = Get(ctor, new StringValue(realm, 'prototype'));

  if (!(proto instanceof ObjectValue)) {
    throw new TypeError('Constructor should have object prototype');
  }

  let o: ObjectValue | NullValue = obj;

  while (true) {
    o = (o as ObjectValue).__GetPrototypeOf();

    if (o instanceof NullValue) return false;

    if (SameValue(proto, o)) return true;
  }

  return false;
}
