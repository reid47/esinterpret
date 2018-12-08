import {
  ObjectValue,
  Realm,
  NullValue,
  BooleanValue,
  NumberValue,
  StringValue,
  UndefinedValue,
  JsValue,
  SymbolValue
} from './types';

export function createUndefinedValue(realm: Realm): UndefinedValue {
  return {
    realm,
    type: 'Undefined',
    value: undefined
  };
}

export function createNullValue(realm: Realm): NullValue {
  return {
    realm,
    type: 'Null',
    value: null
  };
}

export function createBooleanValue(realm: Realm, value: boolean): BooleanValue {
  return {
    realm,
    type: 'Boolean',
    value
  };
}

export function createNumberValue(realm: Realm, value: number): NumberValue {
  return {
    realm,
    type: 'Number',
    value
  };
}

export function createStringValue(realm: Realm, value: string): StringValue {
  return {
    realm,
    type: 'String',
    value
  };
}

export function createObjectValue(realm: Realm): ObjectValue {
  return {
    realm,
    type: 'Object',
    extensible: createBooleanValue(realm, false),
    prototype: createNullValue(realm),
    properties: new Map(),
    symbols: new Map()
  };
}

export function sameTypes(x: JsValue, y: JsValue) {
  return x.type === y.type;
}

export function isValue(obj: any) {
  return obj && typeof obj === 'object' && 'type' in obj && 'realm' in obj;
}

export function isObjectValue(obj: any): obj is ObjectValue {
  return isValue(obj) && obj.type === 'Object';
}

export function isUndefinedValue(obj: any): obj is UndefinedValue {
  return isValue(obj) && obj.type === 'Undefined';
}

export function isNullValue(obj: any): obj is NullValue {
  return isValue(obj) && obj.type === 'Null';
}

export function isStringValue(obj: any): obj is StringValue {
  return isValue(obj) && obj.type === 'String';
}

export function isBooleanValue(obj: any): obj is BooleanValue {
  return isValue(obj) && obj.type === 'Boolean';
}

export function isSymbolValue(obj: any): obj is SymbolValue {
  return isValue(obj) && obj.type === 'Symbol';
}

export function isNumberValue(obj: any): obj is NumberValue {
  return isValue(obj) && obj.type === 'Number';
}

export function isReference(obj: any) {
  // TODO
  return false;
}
