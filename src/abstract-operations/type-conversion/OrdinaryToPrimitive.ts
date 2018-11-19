import { assert } from '../../assert';
import { TypeHint } from '../../types';
import { ObjectValue } from '../../values/ObjectValue';
import { Realm } from '../../environment/Realm';
import { Call } from '../objects/Call';
import { Get } from '../objects/Get';
import { IsCallable } from '../comparison/IsCallable';

// ECMA262 7.1.1.1
export function OrdinaryToPrimitive(realm: Realm, obj: ObjectValue, hint: TypeHint = 'default') {
  assert(obj instanceof ObjectValue, 'Should be an object');

  assert(hint === 'number' || hint === 'string', 'Unexpected type hint');

  const methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];

  for (const methodName of methodNames) {
    const method = Get(obj, methodName);

    if (IsCallable(method)) {
      const result = Call(realm, method, obj);
      if (!(result instanceof ObjectValue)) return result;
    }
  }

  throw new TypeError('Could not convert to primitive');
}
