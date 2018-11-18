import { ObjectValue } from '../values/ObjectValue';

// ECMA-262 9.1.3.1
export function OrdinaryIsExtensible(obj: ObjectValue) {
  return obj.__Extensible;
}
