import { Realm } from '../environment/Realm';
import { ObjectValue } from '../values/ObjectValue';
import { NullValue } from '../values/NullValue';
import { BooleanValue } from '../values/BooleanValue';

// ECMA-262 9.1.12
export function ObjectCreate(
  realm: Realm,
  proto: ObjectValue | NullValue,
  internalSlotsList?: { [key: string]: void }
) {
  internalSlotsList = internalSlotsList || {};

  const obj = new ObjectValue(realm);

  Object.assign(obj, internalSlotsList);

  obj.__Prototype = proto;
  obj.__Extensible = new BooleanValue(realm, true);

  return obj;
}
