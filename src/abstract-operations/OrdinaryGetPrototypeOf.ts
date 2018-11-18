import { ObjectValue } from '../values/ObjectValue';

// ECMA-262 9.1.1.1
export function OrdinaryGetPrototypeOf(obj: ObjectValue) {
  return obj.__Prototype;
}
