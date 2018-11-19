import { Value } from '../../values/Value';
import { ObjectValue } from '../../values/ObjectValue';
import { GetMethod } from '../objects/GetMethod';
import { Realm } from '../../environment/Realm';
import { ToBoolean } from '../type-conversion/ToBoolean';
import { Call } from '../objects/Call';
import { IsCallable } from '../comparison/IsCallable';
import { OrdinaryHasInstance } from '../objects/OrdinaryHasInstance';
import { FunctionValue } from '../../values/FunctionValue';

export default function InstanceofOperator(realm: Realm, value: ObjectValue, target: ObjectValue) {
  if (!(target instanceof ObjectValue)) {
    throw new TypeError('instanceof must be called on object');
  }

  const instOfHandler = GetMethod(realm, target, realm.__Intrinsics.__Symbol_hasInstance);
  if (instOfHandler) {
    return ToBoolean(realm, Call(realm, instOfHandler, target, [value]));
  }

  if (!IsCallable(target)) {
    throw new TypeError('Target is not callable');
  }

  return OrdinaryHasInstance(realm, target as FunctionValue, value);
}
