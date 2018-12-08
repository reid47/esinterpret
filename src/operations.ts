import {
  Realm,
  ObjectValue,
  NullValue,
  JsValue,
  TypeHint,
  StringValue
} from './types';
import * as values from './values';
import { assert } from './assert';
import { NotImplementedError } from './errors';

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
export function toPrimitive(input: JsValue, hint: TypeHint = 'default') {
  if (values.isObjectValue(input)) {
    throw new NotImplementedError('object to primitive conversion');
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
      assert(false, `unexpected type: ${argument}`);
  }
}

// ECMA-262 7.1.5
export function toInt32(argument: JsValue): number {
  const int32bit = toUint32(argument);
  if (int32bit >= Math.pow(2, 31)) return int32bit - Math.pow(2, 32);
  return int32bit;
}

// ECMA-262 7.1.6
export function toUint32(argument: JsValue): number {
  const number = toNumber(argument);

  if (isNaN(number) || number === 0 || number === Infinity) {
    return 0;
  }

  return (Math.sign(number) * Math.floor(Math.abs(number))) % Math.pow(2, 32);
}

// ECMA-262 7.1.13
export function toObject(realm: Realm, argument: JsValue) {
  switch (argument.type) {
    case 'Undefined':
      throw new TypeError('Cannot convert undefined to object');
    case 'Null':
      throw new TypeError('Cannot convert null to object');
    case 'Boolean': {
      const booleanObj = values.createObjectValue(realm);
      booleanObj.booleanData = argument.value;
      return booleanObj;
    }
    case 'Number': {
      const numberObj = values.createObjectValue(realm);
      numberObj.numberData = argument.value;
      return numberObj;
    }
    case 'String': {
      const stringObj = values.createObjectValue(realm);
      stringObj.stringData = argument.value;
      return stringObj;
    }
    case 'Symbol': {
      const symbolObj = values.createObjectValue(realm);
      symbolObj.symbolData = argument.value;
      return symbolObj;
    }
    case 'Object':
      return argument;
    default:
      assert(false, `unexpected type: ${argument.type}`);
  }
}

// ECMA-262 7.2.9
export function isStringPrefix(p: StringValue, q: StringValue) {
  return q.value.startsWith(p.value);
}

// ECMA-262 7.2.12
export function sameValueNonNumber(x: JsValue, y: JsValue) {
  assert(values.sameTypes(x, y), 'values should have same type');
  return x.value === y.value;
}

// ECMA-262 7.2.13
export function abstractRelationalComparison(
  x: JsValue,
  y: JsValue,
  leftFirst: boolean
): boolean | undefined {
  let px, py;
  if (leftFirst) {
    px = toPrimitive(x, 'number');
    py = toPrimitive(y, 'number');
  } else {
    py = toPrimitive(y, 'number');
    px = toPrimitive(x, 'number');
  }

  if (values.isStringValue(px) && values.isStringValue(py)) {
    if (isStringPrefix(py, px)) return false;
    if (isStringPrefix(px, py)) return true;
    return px.value < py.value;
  }

  const nx = toNumber(px);
  const ny = toNumber(py);

  if (isNaN(nx) || isNaN(ny)) return undefined;
  if (Object.is(nx, +0) && Object.is(ny, -0)) return false;
  if (Object.is(nx, -0) && Object.is(ny, +0)) return false;
  if (Object.is(nx, +Infinity)) return false;
  if (Object.is(ny, +Infinity)) return true;
  if (Object.is(ny, -Infinity)) return false;
  if (Object.is(nx, -Infinity)) return true;

  return nx < ny;
}

// ECMA 7.2.14
export function abstractEqualityComparison(x: JsValue, y: JsValue) {
  if (values.sameTypes(x, y)) return strictEqualityComparison(x, y);

  if (values.isNullValue(x) && values.isUndefinedValue(y)) return true;
  if (values.isUndefinedValue(x) && values.isNullValue(y)) return true;
  if (values.isNumberValue(x) && values.isStringValue(y)) {
    return x.value === toNumber(y);
  }
  if (values.isStringValue(x) && values.isNumberValue(y)) {
    return toNumber(x) === y.value;
  }
  if (values.isBooleanValue(x)) return toNumber(x) === y.value;
  if (values.isBooleanValue(y)) return x.value === toNumber(y);

  if (
    (values.isStringValue(x) ||
      values.isNumberValue(x) ||
      values.isSymbolValue(x)) &&
    values.isObjectValue(y)
  ) {
    return x.value === toPrimitive(y).value;
  }

  if (
    values.isObjectValue(x) &&
    (values.isStringValue(y) ||
      values.isNumberValue(y) ||
      values.isSymbolValue(y))
  ) {
    return toPrimitive(x).value === y.value;
  }

  return false;
}

// ECMA 7.2.15
export function strictEqualityComparison(x: JsValue, y: JsValue) {
  if (!values.sameTypes(x, y)) return false;

  if (values.isNumberValue(x)) {
    if (isNaN(x.value) || isNaN(y.value)) return false;
    return x.value === y.value;
  }

  return sameValueNonNumber(x, y);
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

  const objProto = objectCreate(realm, values.createNullValue(realm));
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

  const obj = values.createObjectValue(realm);

  Object.assign(obj, internalSlotsList);

  obj.prototype = proto;
  obj.extensible = values.createBooleanValue(realm, true);

  return obj;
}
