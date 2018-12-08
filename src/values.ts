import {
  ObjectValue,
  Realm,
  NullValue,
  BooleanValue,
  NumberValue,
  StringValue,
  UndefinedValue
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

export function isValue(obj: any) {
  return obj && typeof obj === 'object' && 'type' in obj && 'realm' in obj;
}

export function isObjectValue(obj: any): obj is ObjectValue {
  return isValue(obj) && obj.type === 'Object';
}

export function isReference(obj: any) {
  // TODO
  return false;
}
