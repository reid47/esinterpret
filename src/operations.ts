import { Realm, ObjectValue, NullValue, JsValue, TypeHint } from './types';
import {
  createObjectValue,
  createBooleanValue,
  createNullValue,
  isObjectValue
} from './values';
import { assert } from './assert';

// ECMA-262 6.2.4.8
export function getValue(value: JsValue) {
  // TODO: References here
  return value;
}

// ECMA-262 7.1.2
export function toBoolean(argument: JsValue): boolean {
  switch (argument.type) {
    case 'Undefined':
      return false;
    case 'Null':
      return false;
    case 'Boolean':
      return !!argument.value;
    case 'Number':
      if (argument.value === 0 || isNaN(argument.value)) return false;
      return true;
    case 'String':
      return argument.value.length !== 0;
    case 'Symbol':
      return true;
    case 'Object':
      return true;
    default:
      assert(false, `unexpected type: ${argument.type}`);
  }
}

// ECMA-262 7.1.1
export function toPrimitive(input: JsValue, hint: TypeHint) {
  if (isObjectValue(input)) {
    // TODO
    throw new Error('Not yet implemented');
  }

  return input;
}

// ECMA-262 7.1.3
export function toNumber(argument: JsValue): number {
  switch (argument.type) {
    case 'Undefined':
      return NaN;
    case 'Null':
      return +0;
    case 'Boolean':
      return argument.value ? 1 : +0;
    case 'Number':
      return argument.value;
    case 'String':
      return Number(argument.value);
    case 'Symbol':
      throw new TypeError('Could not convert symbol to number');
    case 'Object': {
      const primValue = toPrimitive(argument, 'number');
      return toNumber(primValue);
    }
    default:
      assert(false, `unexpected type: ${argument.type}`);
  }
}

export function toInt32(argument: JsValue): number {
  const number = toNumber(argument);

  if (isNaN(number) || number === 0 || number === Infinity) {
    return 0;
  }

  const int32bit = Math.floor(Math.abs(number)) % Math.pow(2, 32);
  if (int32bit >= Math.pow(2, 31)) return int32bit - Math.pow(2, 32);
  return int32bit;
}

// ECMA-262 7.1.13
export function toObject(realm: Realm, argument: JsValue) {
  switch (argument.type) {
    case 'Undefined':
      throw new TypeError('Cannot convert undefined to object');
    case 'Null':
      throw new TypeError('Cannot convert null to object');
    case 'Boolean': {
      const booleanObj = createObjectValue(realm);
      booleanObj.booleanData = argument.value;
      return booleanObj;
    }
    case 'Number': {
      const numberObj = createObjectValue(realm);
      numberObj.numberData = argument.value;
      return numberObj;
    }
    case 'String': {
      const stringObj = createObjectValue(realm);
      stringObj.stringData = argument.value;
      return stringObj;
    }
    case 'Symbol': {
      const symbolObj = createObjectValue(realm);
      symbolObj.symbolData = argument.value;
      return symbolObj;
    }
    case 'Object':
      return argument;
    default:
      assert(false, `unexpected type: ${argument.type}`);
  }
}

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
