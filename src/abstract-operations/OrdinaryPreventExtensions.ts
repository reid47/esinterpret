import { ObjectValue } from '../values/ObjectValue';
import { BooleanValue } from '../values/BooleanValue';
import { Realm } from '../environment/Realm';

// ECMA-262 9.1.4.1
export function OrdinaryPreventExtensions(realm: Realm, obj: ObjectValue) {
  obj.__Extensible = new BooleanValue(realm, false);
  return new BooleanValue(realm, true);
}
