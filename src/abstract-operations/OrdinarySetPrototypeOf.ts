import { ObjectValue } from '../values/ObjectValue';
import { assert } from '../assert';
import { Value } from '../values/Value';
import { NullValue } from '../values/NullValue';
import { SameValue } from './comparison/SameValue';

// ECMA-262 9.1.2.1
export function OrdinarySetPrototypeOf(obj: ObjectValue, newProto: Value) {
  assert(
    newProto instanceof ObjectValue || newProto instanceof NullValue,
    'Prototype should be an object or null'
  );

  if (SameValue(newProto, obj.__Prototype)) return true;
  if (!obj.__Extensible) return false;

  let p = newProto;
  let done = false;

  while (!done) {
    if (p instanceof NullValue) {
      done = true;
    } else if (SameValue(p, obj)) {
      return false;
    } else {
      if (p.__GetPrototypeOf !== ObjectValue.__GetPrototypeOf) {
        // TODO: not sure when this condition is true
        done = true;
      } else {
        p = p.__Prototype;
      }
    }
  }

  obj.__Prototype = newProto;

  return true;
}
