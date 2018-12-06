import { Realm, ObjectValue, NullValue } from './types';
import {
  createObjectValue,
  createBooleanValue,
  createNullValue
} from './values';

// ECMA-262 8.2.1
export function createRealm(): Realm {
  const realm = {
    globalObject: undefined,
    globalEnv: undefined,
    templateMap: [],
    intrinsics: undefined
  };

  createIntrinsics(realm);

  return realm;
}

// ECMA-262 8.2.2
export function createIntrinsics(realm: Realm) {
  realm.intrinsics = {};

  const objProto = objectCreate(realm, createNullValue(realm));
  realm.intrinsics.objectPrototype = objProto;

  const thrower = void '?'; // TODO
  realm.intrinsics.__ThrowTypeError = thrower;

  // const funcProto = CreateBuiltinFunction(realm);
  // intrinsics.__FunctionPrototype = funcProto;

  // thrower.__SetPrototypeOf(funcProto);

  // TODO: lots more here
}

// ECMA-262 9.1.12
export function objectCreate(
  realm: Realm,
  proto: ObjectValue | NullValue,
  internalSlotsList?: { [key: string]: void }
) {
  internalSlotsList = internalSlotsList || {};

  const obj = createObjectValue(realm);

  Object.assign(obj, internalSlotsList);

  obj.prototype = proto;
  obj.extensible = createBooleanValue(realm, true);

  return obj;
}
