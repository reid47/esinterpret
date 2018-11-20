import * as Nodes from '@babel/types';
import { Realm } from './environment/Realm';
import { ObjectValue } from './values/ObjectValue';
import { PropertyKeyValue, TypeHint } from './types';
import { Value } from './values/Value';
import { assert } from './assert';
import { ArrayExotic } from './values/ArrayExotic';
import { ProxyValue } from './values/ProxyValue';
import { FunctionValue } from './values/FunctionValue';
import { NumberValue } from './values/NumberValue';
import { StringValue } from './values/StringValue';
import { SymbolValue } from './values/SymbolValue';
import { UndefinedValue } from './values/UndefinedValue';
import { NullValue } from './values/NullValue';
import { BooleanValue } from './values/BooleanValue';
import { PropertyDescriptor } from './values/PropertyDescriptor';
import { BoundFunctionExotic } from './values/BoundFunctionExotic';
import { GlobalEnvironmentRecord } from './environment/GlobalEnvironmentRecord';
import { LexicalEnvironment } from './environment/LexicalEnvironment';
import { DeclarativeEnvironmentRecord } from './environment/DeclarativeEnvironmentRecord';
import { ObjectEnvironmentRecord } from './environment/ObjectEnvironmentRecord';

// ECMA-262 6.2.5.1
export function IsAccessorDescriptor(desc: PropertyDescriptor) {
  if (!desc) return false;
  if (!desc.__Get && !desc.__Set) return false;
  return true;
}

// ECMA-262 6.2.5.2
export function IsDataDescriptor(desc: PropertyDescriptor) {
  if (!desc) return false;
  if (!desc.hasOwnProperty('__Value') && !desc.hasOwnProperty('__Writable')) return false;
  return true;
}

// ECMA-262 6.2.5.3
export function IsGenericDescriptor(desc: PropertyDescriptor) {
  if (!desc) return false;
  if (!IsAccessorDescriptor(desc) && !IsDataDescriptor(desc)) return true;
  return false;
}

// ECMA-262 6.2.5.4
export function FromPropertyDescriptor(realm: Realm, desc: PropertyDescriptor) {
  if (!desc) return undefined; // TODO: or UndefinedValue?

  const obj = ObjectCreate(realm, realm.__Intrinsics.__ObjectPrototype);

  assert(obj.__Extensible, 'Object should be extensible');
  assert(
    obj.properties.size === 0 && obj.symbols.size === 0,
    'Object should not have any properties or symbols'
  );

  if (desc.__Value) {
    const created = CreateDataProperty(realm, obj, new StringValue(realm, 'value'), desc.__Value);

    assert(created, 'Could not create value property');
  }

  if (desc.__Writable) {
    const created = CreateDataProperty(
      realm,
      obj,
      new StringValue(realm, 'writable'),
      desc.__Writable
    );

    assert(created, 'Could not create writable property');
  }

  if (desc.__Get) {
    const created = CreateDataProperty(realm, obj, new StringValue(realm, 'get'), desc.__Get);

    assert(created, 'Could not create get property');
  }

  if (desc.__Set) {
    const created = CreateDataProperty(realm, obj, new StringValue(realm, 'set'), desc.__Set);

    assert(created, 'Could not create set property');
  }

  if (desc.__Enumerable) {
    const created = CreateDataProperty(
      realm,
      obj,
      new StringValue(realm, 'enumerable'),
      desc.__Enumerable
    );

    assert(created, 'Could not create enumerable property');
  }

  if (desc.__Configurable) {
    const created = CreateDataProperty(
      realm,
      obj,
      new StringValue(realm, 'configurable'),
      desc.__Configurable
    );

    assert(created, 'Could not create configurable property');
  }

  return obj;
}

// ECMA-262 6.2.5.5
export function ToPropertyDescriptor(realm: Realm, obj: ObjectValue) {
  if (!(obj instanceof ObjectValue)) {
    // TODO: abrupt completion
    throw new TypeError('Expected an object');
  }

  const desc = new PropertyDescriptor();

  // if (HasProperty(obj))
  // TODO: more here
}

// ECMA262 7.1.1
export function ToPrimitive(realm: Realm, input: Value, hint: TypeHint = 'default') {
  assert(input instanceof Value, 'Should be a valid value');

  if (input instanceof ObjectValue) {
    const exoticToPrim = GetMethod(realm, input, realm.__Intrinsics.__Symbol_toPrimitive);

    if (exoticToPrim) {
      const result = Call(realm, exoticToPrim, input, [hint]);
      if (!(result instanceof ObjectValue)) return result;
      throw new TypeError('Could not convert to primitive');
    }

    if (hint === 'default') hint = 'number';

    return OrdinaryToPrimitive(realm, input, hint);
  }

  return input;
}

// ECMA262 7.1.1.1
export function OrdinaryToPrimitive(realm: Realm, obj: ObjectValue, hint: TypeHint = 'default') {
  assert(obj instanceof ObjectValue, 'Should be an object');

  assert(hint === 'number' || hint === 'string', 'Unexpected type hint');

  const methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];

  for (const methodName of methodNames) {
    const method = Get(obj, new StringValue(realm, methodName));

    if (IsCallable(method)) {
      const result = Call(realm, method, obj);
      if (!(result instanceof ObjectValue)) return result;
    }
  }

  throw new TypeError('Could not convert to primitive');
}

// ECMA262 7.1.2
export function ToBoolean(realm: Realm, argument: Value) {
  if (argument instanceof UndefinedValue || argument instanceof NullValue) {
    return new BooleanValue(realm, false);
  }

  if (argument instanceof BooleanValue) {
    return argument;
  }

  if (argument instanceof NumberValue) {
    const number = argument.value;

    if (isNaN(number) || number === 0) {
      return new BooleanValue(realm, false);
    }

    return new BooleanValue(realm, true);
  }

  if (argument instanceof StringValue) {
    const truthy = argument.value.length > 0;
    return new BooleanValue(realm, truthy);
  }

  return new BooleanValue(realm, true);
}

// ECMA262 7.1.3
export function ToNumber(realm: Realm, argument: Value): NumberValue {
  if (argument instanceof UndefinedValue) {
    return new NumberValue(realm, NaN);
  }

  if (argument instanceof NullValue) {
    return new NumberValue(realm, +0);
  }

  if (argument instanceof BooleanValue) {
    const number = argument.value ? 1 : +0;
    return new NumberValue(realm, number);
  }

  if (argument instanceof NumberValue) {
    return argument;
  }

  if (argument instanceof StringValue) {
    return new NumberValue(realm, Number(argument.value));
  }

  if (argument instanceof SymbolValue) {
    throw new TypeError('Cannot convert symbol to number');
  }

  const primValue = ToPrimitive(realm, argument, 'number');

  return ToNumber(realm, primValue);
}

// ECMA-262 7.1.4
export function ToInteger(realm: Realm, argument: Value): NumberValue {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number)) {
    return new NumberValue(realm, +0);
  }

  if (number === 0 || !isFinite(number)) {
    return new NumberValue(realm, number);
  }

  const result = number < 0 ? -Math.floor(Math.abs(number)) : Math.floor(Math.abs(number));
  return new NumberValue(realm, result);
}

// ECMA-262 7.1.5
export function ToInt32(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number === 0 || !isFinite(number)) return +0;

  const int = number < 0 ? -Math.floor(Math.abs(number)) : Math.floor(Math.abs(number));

  const int32bit = int % Math.pow(2, 32);

  return int32bit >= Math.pow(2, 31) ? int32bit - Math.pow(2, 32) : int32bit;
}

// ECMA-262 7.1.6
export function ToUint32(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number === 0 || !isFinite(number)) return +0;

  const int = number < 0 ? -Math.floor(Math.abs(number)) : Math.floor(Math.abs(number));

  return int % Math.pow(2, 32);
}

// ECMA-262 7.1.7
export function ToInt16(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number === 0 || !isFinite(number)) return +0;

  const int = number < 0 ? -Math.floor(Math.abs(number)) : Math.floor(Math.abs(number));

  const int16bit = int % Math.pow(2, 16);

  return int16bit >= Math.pow(2, 15) ? int16bit - Math.pow(2, 16) : int16bit;
}

// ECMA-262 7.1.8
export function ToUint16(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number === 0 || !isFinite(number)) return +0;

  const int = number < 0 ? -Math.floor(Math.abs(number)) : Math.floor(Math.abs(number));

  return int % Math.pow(2, 16);
}

// ECMA-262 7.1.9
export function ToInt8(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number === 0 || !isFinite(number)) return +0;

  const int = number < 0 ? -Math.floor(Math.abs(number)) : Math.floor(Math.abs(number));

  const int8bit = int % Math.pow(2, 8);

  return int8bit >= Math.pow(2, 7) ? int8bit - Math.pow(2, 8) : int8bit;
}

// ECMA-262 7.1.10
export function ToUint8(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number === 0 || !isFinite(number)) return +0;

  const int = number < 0 ? -Math.floor(Math.abs(number)) : Math.floor(Math.abs(number));

  return int % Math.pow(2, 8);
}

// ECMA-262 7.1.11
export function ToUint8Clamp(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number <= 0) return +0;
  if (number >= 255) return 255;

  const f = Math.floor(number);

  if (f + 0.5 < number) return f + 1;

  if (number < f + 0.5) return f;

  if (number % 2 !== 0) return f + 1;

  return f;
}

// ECMA262 7.1.12
export function ToString(realm: Realm, argument: Value): StringValue {
  if (argument instanceof UndefinedValue) {
    return new StringValue(realm, 'undefined');
  }

  if (argument instanceof NullValue) {
    return new StringValue(realm, 'null');
  }

  if (argument instanceof BooleanValue) {
    const bool = argument.value ? 'true' : 'false';
    return new StringValue(realm, bool);
  }

  if (argument instanceof NumberValue) {
    return NumberToString(realm, argument);
  }

  if (argument instanceof StringValue) {
    return argument;
  }

  if (argument instanceof SymbolValue) {
    throw new TypeError('Cannot convert symbol to string');
  }

  const primValue = ToPrimitive(realm, argument, 'string');

  return ToString(realm, primValue);
}

// ECMA-262 7.1.12.1
export function NumberToString(realm: Realm, number: NumberValue): StringValue {
  // Note: here, we take advantage of the fact that this
  // implementation is written in JavaScript. The spec spells
  // out a full algorithm for doing the conversion, but we will
  // let the running JS engine do it for us.
  return new StringValue(realm, '' + number.value);
}

// ECMA262 7.1.13
export function ToObject(realm: Realm, argument: Value): ObjectValue {
  if (argument instanceof UndefinedValue) {
    throw new TypeError('Cannot convert undefined to object');
  }

  if (argument instanceof NullValue) {
    throw new TypeError('Cannot convert null to object');
  }

  if (argument instanceof BooleanValue) {
    // TODO: make sure realm.__Intrinsics.__BooleanPrototype is defined
    // (and others below)
    const obj = new ObjectValue(realm, realm.__Intrinsics.__BooleanPrototype);
    obj.__BooleanData = argument;
    return obj;
  }

  if (argument instanceof NumberValue) {
    const obj = new ObjectValue(realm, realm.__Intrinsics.__NumberPrototype);
    obj.__NumberData = argument;
    return obj;
  }

  if (argument instanceof StringValue) {
    const obj = new ObjectValue(realm, realm.__Intrinsics.__StringPrototype);
    obj.__StringData = argument;
    return obj;
  }

  if (argument instanceof SymbolValue) {
    const obj = new ObjectValue(realm, realm.__Intrinsics.__SymbolPrototype);
    obj.__SymbolData = argument;
    return obj;
  }

  assert(argument instanceof ObjectValue, 'Should be an object if nothing else');

  return argument as ObjectValue;
}

// ECMA-262 7.1.14
export function ToPropertyKey(realm: Realm, argument: Value): PropertyKeyValue {
  const key = ToPrimitive(realm, argument, 'string');

  if (key instanceof SymbolValue) return key;

  return ToString(realm, key);
}

// ECMA-262 7.1.15
export function ToLength(realm: Realm, argument: Value): NumberValue {
  const lenValue = ToInteger(realm, argument);
  const len = lenValue.value;

  if (len <= +0) {
    return new NumberValue(realm, +0);
  }

  return new NumberValue(realm, Math.min(len, Math.pow(2, 53) - 1));
}

// ECMA-262 7.1.16
export function CanonicalNumericIndexString(realm: Realm, string: StringValue) {
  assert(string instanceof StringValue, 'Should be a string');

  if (string.value === '-0') return -0;

  const n = ToNumber(realm, string);

  if (!SameValue(ToString(realm, n), string)) return undefined;

  return n;
}

// ECMA-262 7.1.17
export function ToIndex(realm: Realm, value: Value) {
  let index;

  if (value instanceof UndefinedValue) {
    index = new NumberValue(realm, 0);
  } else {
    const integerIndex = ToInteger(realm, value);

    if (integerIndex.value < 0) {
      throw new RangeError('Index out of range');
    }

    index = ToLength(realm, integerIndex);

    if (!SameValueZero(integerIndex, index)) {
      throw new RangeError('Index out of range');
    }
  }

  return index;
}

// ECMA-262 7.2.1
export function RequireObjectCoercible(value: Value) {
  if (value instanceof UndefinedValue || value instanceof NullValue) {
    // TODO: abrupt completion?
    throw new TypeError('Cannot coerce null or undefined into object');
  }

  return value;
}

// ECMA-262 7.2.2
export function IsArray(value: Value) {
  if (!(value instanceof ObjectValue)) return false;

  if (value instanceof ArrayExotic) return true;

  if (value instanceof ProxyValue) {
    if (value.__ProxyHandler === null) {
      // TODO: NullValue above? abrupt completion below?
      throw new TypeError('No proxy handler');
    }

    return IsArray(value.__ProxyTarget);
  }

  // TODO more

  return false;
}

// ECMA-262 7.2.3
export function IsCallable(value: Value) {
  if (!(value instanceof FunctionValue)) return false;

  if (value.__Call) return true;

  return false;
}

// ECMA-262 7.2.4
export function IsConstructor(value: Value) {
  if (!(value instanceof FunctionValue)) return false;

  if (value.__Construct) return true;

  return false;
}

// ECMA-262 7.2.5
export function IsExtensible(obj: ObjectValue) {
  assert(obj instanceof ObjectValue, 'Should be an object');

  return obj.__IsExtensible();
}

// ECMA-262 7.2.6
export function IsInteger(value: Value) {
  if (!(value instanceof NumberValue)) return false;

  const number = value.value;
  if (!isFinite(number)) return false;
  if (Math.floor(Math.abs(number)) !== Math.abs(number)) return false;

  return true;
}

// ECMA-262 7.2.7
export function IsPropertyKey(arg: any) {
  return arg instanceof StringValue || arg instanceof SymbolValue;
}

// ECMA-262 7.2.8
export function IsRegExp(realm: Realm, value: Value) {
  if (!(value instanceof ObjectValue)) return false;

  const matcher = Get(value, realm.__Intrinsics.__Symbol_match);
  if (matcher) return ToBoolean(realm, matcher);

  if (value.__RegExpMatcher) return true;

  return true;
}

// ECMA-262 7.2.9
export function IsStringPrefix(prefix: StringValue, string: StringValue) {
  assert(prefix instanceof StringValue, 'Should be a string');
  assert(string instanceof StringValue, 'Should be a string');

  const actualPrefix = string.value.substr(0, prefix.value.length);
  return actualPrefix === prefix.value;
}

// ECMA-262 7.2.10
export function SameValue(x: Value, y: Value) {
  if (x.getType() !== y.getType()) return false;

  if (x instanceof NumberValue && y instanceof NumberValue) {
    if (isNaN(x.value) && isNaN(y.value)) return true;
    if (Object.is(x.value, 0) && Object.is(y.value, -0)) return false;
    if (Object.is(x.value, -0) && Object.is(y.value, 0)) return false;
    if (x.value === y.value) return true;
    return false;
  }

  return SameValueNonNumber(x, y);
}

// ECMA-262 7.2.11
export function SameValueZero(x: Value, y: Value) {
  if (x.getType() !== y.getType()) return false;

  if (x instanceof NumberValue && y instanceof NumberValue) {
    if (isNaN(x.value) && isNaN(y.value)) return true;
    if (Object.is(x.value, +0) && Object.is(y.value, -0)) return true;
    if (Object.is(x.value, -0) && Object.is(y.value, +0)) return true;
    if (x.value === y.value) return true;
    return false;
  }

  return SameValueNonNumber(x, y);
}

// ECMA-262 7.2.12
export function SameValueNonNumber(x: Value, y: Value) {
  assert(!(x instanceof NumberValue), 'Should not be a number');
  assert(x.getType() === y.getType(), 'Should be the same types');

  if (x instanceof UndefinedValue) return true;

  if (x instanceof NullValue) return true;

  if (x instanceof StringValue && y instanceof StringValue) {
    return x.value === y.value;
  }

  if (x instanceof BooleanValue && y instanceof BooleanValue) {
    return x.value === y.value;
  }

  if (x instanceof SymbolValue && y instanceof SymbolValue) {
    return x === y;
  }

  return x === y;
}

// ECMA-262 7.3.1
export function Get(obj: ObjectValue, propertyKey: PropertyKeyValue) {
  assert(obj instanceof ObjectValue, 'Should be an object');

  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  return obj.__Get(propertyKey, obj);
}

// ECMA-262 7.3.2
export function GetV(realm: Realm, value: Value, propertyKey: PropertyKeyValue) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const obj = ToObject(realm, value);

  return obj.__Get(propertyKey, obj);
}

// ECMA-262 7.3.3
export function Set(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value,
  shouldThrow: BooleanValue
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');
  assert(shouldThrow instanceof BooleanValue, 'Should be a boolean');

  const success = obj.__Set(propertyKey, value, obj);

  if (!success && shouldThrow.value === true) {
    throw new TypeError('Failed to set');
  }

  return success;
}

// ECMA-262 7.3.4
export function CreateDataProperty(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const newDesc = new PropertyDescriptor();
  newDesc.__Value = value;
  newDesc.__Writable = new BooleanValue(realm, true);
  newDesc.__Enumerable = new BooleanValue(realm, true);
  newDesc.__Configurable = new BooleanValue(realm, true);

  return obj.__DefineOwnProperty(propertyKey, newDesc);
}

// ECMA-262 7.3.5
export function CreateMethodProperty(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const newDesc = new PropertyDescriptor();
  newDesc.__Value = value;
  newDesc.__Writable = new BooleanValue(realm, true);
  newDesc.__Enumerable = new BooleanValue(realm, false);
  newDesc.__Configurable = new BooleanValue(realm, true);

  return obj.__DefineOwnProperty(propertyKey, newDesc);
}

// ECMA-262 7.3.6
export function CreateDataPropertyOrThrow(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const success = CreateDataProperty(realm, obj, propertyKey, value);

  if (!success) {
    throw new TypeError('Failed to create data property');
  }

  return success;
}

// ECMA-262 7.3.7
export function DefinePropertyOrThrow(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  desc: PropertyDescriptor
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const success = obj.__DefineOwnProperty(propertyKey, desc);

  if (!success) {
    throw new TypeError('Failed to define property');
  }

  return success;
}

// ECMA-262 7.3.8
export function DeletePropertyOrThrow(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue
) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const success = obj.__Delete(propertyKey);

  if (!success) {
    throw new TypeError('Failed to delete property');
  }

  return success;
}

// ECMA-262 7.3.9
export function GetMethod(realm: Realm, value: Value, propertyKey: PropertyKeyValue) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const func = GetV(realm, value, propertyKey);

  if (func === undefined || func === null) {
    return undefined;
  }

  if (!IsCallable(func)) {
    throw new TypeError('Property is not a callable method');
  }

  return func;
}

// ECMA-262 7.3.10
export function HasProperty(obj: ObjectValue, propertyKey: PropertyKeyValue): boolean {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  return obj.__HasProperty(propertyKey);
}

// ECMA-262 7.3.11
export function HasOwnProperty(obj: ObjectValue, propertyKey: PropertyKeyValue) {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const desc = obj.__GetOwnProperty(propertyKey);

  if (!desc) return false;

  return true;
}

// ECMA-262 7.3.12
export function Call(realm: Realm, func: Value, thisValue: Value, argumentsList = []) {
  if (!IsCallable(func)) {
    // TODO: abrupt completion
    throw new TypeError('Not callable');
  }

  return (func as FunctionValue).__Call(thisValue, argumentsList);
}

// ECMA-262 7.3.13
export function Construct(realm: Realm, func: FunctionValue, argumentsList = [], newTarget) {
  newTarget = newTarget || func;

  assert(IsConstructor(func), 'Function should be a constructor');
  assert(IsConstructor(newTarget), 'Target should be a constructor');

  return func.__Construct(argumentsList, newTarget);
}

// ECMA-262 7.3.14
export function SetIntegrityLevel(realm: Realm, obj: ObjectValue, level: 'sealed' | 'frozen') {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(level === 'sealed' || level === 'frozen', 'Should be a valid integrity level');

  const status = obj.__PreventExtensions();
  if (!status) return false;

  const keys = obj.__OwnPropertyKeys();

  if (level === 'sealed') {
    for (const key of keys) {
      const desc = new PropertyDescriptor();
      desc.__Configurable = new BooleanValue(realm, false);
      DefinePropertyOrThrow(realm, obj, key, desc);
    }
  } else {
    for (const key of keys) {
      const currentDesc = obj.__GetOwnProperty(key);
      if (currentDesc) {
        const desc = new PropertyDescriptor();

        if (IsAccessorDescriptor(currentDesc)) {
          desc.__Configurable = new BooleanValue(realm, false);
        } else {
          desc.__Configurable = new BooleanValue(realm, false);
          desc.__Writable = new BooleanValue(realm, false);
        }

        DefinePropertyOrThrow(realm, obj, key, desc);
      }
    }
  }

  return true;
}

// ECMA-262 7.3.15
export function TestIntegrityLevel(realm: Realm, obj: ObjectValue, level: 'sealed' | 'frozen') {
  assert(obj instanceof ObjectValue, 'Should be an object');
  assert(level === 'sealed' || level === 'frozen', 'Should be a valid integrity level');

  const status = IsExtensible(obj);
  if (status) return false;

  const keys = obj.__OwnPropertyKeys();

  for (const key of keys) {
    const currentDesc = obj.__GetOwnProperty(key);

    if (currentDesc) {
      if (currentDesc.__Configurable && currentDesc.__Configurable.value === true) {
        return false;
      }

      if (level === 'frozen' && IsDataDescriptor(currentDesc)) {
        if (currentDesc.__Writable && currentDesc.__Writable.value === true) {
          return false;
        }
      }
    }
  }

  return true;
}

// ECMA-262 7.3.16
export function CreateArrayFromList(realm: Realm, elements: Value[]) {
  assert(Array.isArray(elements), 'Should be an array of elements');
  assert(elements.every(el => el instanceof Value), 'All elements should be values');

  const array = ArrayCreate(realm, new NumberValue(realm, 0));

  for (let n = 0, len = elements.length; n < len; n++) {
    const status = CreateDataProperty(
      realm,
      array,
      ToString(realm, new NumberValue(realm, n)),
      elements[n]
    );

    assert(status, 'Failed to create element');
  }

  return array;
}

// ECMA-262 7.3.17
export function CreateListFromArrayLike(realm: Realm, obj: ObjectValue, elementTypes) {
  elementTypes = elementTypes || [
    UndefinedValue,
    NullValue,
    BooleanValue,
    StringValue,
    SymbolValue,
    NumberValue,
    ObjectValue
  ];

  if (!(obj instanceof ObjectValue)) {
    throw new TypeError('Should be an object');
  }

  const len = ToLength(realm, Get(obj, new StringValue(realm, 'length'))).value;
  const list = [];

  for (let index = 0; index < len; index++) {
    const indexName = ToString(realm, new NumberValue(realm, index));
    const next = Get(obj, indexName);

    if (!elementTypes.contains(next.getType())) {
      throw new TypeError('Disallowed type in list');
    }

    list.push(next);
  }

  return list;
}

// ECMA-262 7.3.18
export function Invoke(
  realm: Realm,
  value: Value,
  propertyKey: PropertyKeyValue,
  argumentsList: Value[] = []
) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const func = GetV(realm, value, propertyKey);

  return Call(realm, func, value, argumentsList);
}

// ECMA-262 7.3.19
export function OrdinaryHasInstance(realm: Realm, ctor: FunctionValue, obj: ObjectValue) {
  if (!IsCallable(ctor)) return false;

  if (ctor.__BoundTargetFunction) {
    const boundCtor = ctor.__BoundTargetFunction;
    return InstanceofOperator(realm, obj, boundCtor);
  }

  if (!(obj instanceof ObjectValue)) return false;

  const proto = Get(ctor, new StringValue(realm, 'prototype'));

  if (!(proto instanceof ObjectValue)) {
    throw new TypeError('Constructor should have object prototype');
  }

  let o: ObjectValue | NullValue = obj;

  while (true) {
    o = (o as ObjectValue).__GetPrototypeOf();

    if (o instanceof NullValue) return false;

    if (SameValue(proto, o)) return true;
  }

  return false;
}

// ECMA-262 7.3.20
export default function SpeciesConstructor(
  realm: Realm,
  obj: ObjectValue,
  defaultConstructor: FunctionValue
) {
  assert(obj instanceof ObjectValue, 'should be an object');

  const ctor = Get(obj, new StringValue(realm, 'constructor'));

  if (!ctor) return defaultConstructor;

  const species = Get(ctor as ObjectValue, realm.__Intrinsics.__Symbol_species);

  if (species === undefined || species === null) {
    return defaultConstructor;
  }

  if (IsConstructor(species)) return species;

  throw new TypeError('Could not get constructor');
}

// ECMA-262 7.3.21
export function EnumerableOwnPropertyNames(
  realm: Realm,
  obj: ObjectValue,
  kind: 'key' | 'value' | 'key+value'
) {
  assert(obj instanceof ObjectValue, 'should be an object');

  const ownKeys = obj.__OwnPropertyKeys();

  const properties = [];

  for (const key of ownKeys) {
    if (key instanceof StringValue) {
      const desc = obj.__GetOwnProperty(key);

      if (desc && desc.__Enumerable && desc.__Enumerable.value === true) {
        if (kind === 'key') {
          properties.push(key);
        } else {
          const value = Get(obj, key);
          if (kind === 'value') {
            properties.push(value);
          } else {
            assert(kind === 'key+value', 'should have kind key+value');

            const entry = CreateArrayFromList(realm, [key, value]);
            properties.push(entry);
          }
        }
      }
    }
  }

  return properties;
}

// ECMA-262 7.3.22
export function GetFunctionRealm(realm: Realm, obj: ObjectValue) {
  assert(obj instanceof ObjectValue && IsCallable(obj), 'should be a callable object');

  if (obj.__Realm) return obj.__Realm;

  if (obj instanceof BoundFunctionExotic) {
    const target = obj.__BoundTargetFunction;
    return GetFunctionRealm(realm, target);
  }

  if (obj instanceof ProxyValue) {
    const proxyTarget = obj.__ProxyTarget;

    if (proxyTarget === null) {
      throw new TypeError('null proxy target');
    }

    return GetFunctionRealm(realm, proxyTarget);
  }

  return realm;
}

// ECMA-262 7.3.23
export function CopyDataProperties(
  realm: Realm,
  target: ObjectValue,
  source: ObjectValue,
  excludedItems: PropertyKeyValue[]
) {
  assert(target instanceof ObjectValue, 'Should be an object');
  assert(Array.isArray(excludedItems), 'should be a list');

  if (source instanceof UndefinedValue || source instanceof NullValue) {
    return target;
  }

  const from = ToObject(realm, source);
  const keys = from.__OwnPropertyKeys();

  for (const nextKey of keys) {
    let excluded = false;

    for (const excludedItem of excludedItems) {
      if (SameValue(excludedItem, nextKey)) {
        excluded = true;
      }
    }

    if (!excluded) {
      const desc = from.__GetOwnProperty(nextKey);

      if (desc && desc.__Enumerable && desc.__Enumerable.value === true) {
        const propValue = Get(from, nextKey);
        CreateDataProperty(realm, target, nextKey, propValue);
      }
    }
  }

  return target;
}

// ECMA-262 8.1.2.2
export function NewDeclarativeEnvironment(realm: Realm, parentEnv: LexicalEnvironment) {
  const env = new LexicalEnvironment(realm);
  const envRec = new DeclarativeEnvironmentRecord(realm);
  env.environmentRecord = envRec;
  env.parent = parentEnv;
  return env;
}

// ECMA-262 8.1.2.5
export function NewGlobalEnvironment(realm: Realm, globalObj, thisValue) {
  const env = new LexicalEnvironment(realm);
  const objRec = new ObjectEnvironmentRecord(globalObj);
  const declRec = new DeclarativeEnvironmentRecord(realm);
  const globalRec = new GlobalEnvironmentRecord(realm);

  globalRec.__ObjectRecord = objRec;
  globalRec.__GlobalThisValue = thisValue;
  globalRec.__DeclarativeRecord = declRec;
  globalRec.__VarNames = [];

  env.environmentRecord = globalRec;
  env.parent = null;

  return env;
}

// ECMA-262 8.2.1
export function CreateRealm() {
  const realm = new Realm();

  CreateIntrinsics(realm);

  realm.__GlobalObject = undefined;
  realm.__GlobalEnv = undefined;
  realm.__TemplateMap = [];

  return realm;
}

// ECMA-262 8.2.2
export function CreateIntrinsics(realm: Realm) {
  const intrinsics: any = {};
  realm.__Intrinsics = intrinsics;

  const objProto = ObjectCreate(realm, new NullValue(realm));
  intrinsics.__ObjectPrototype = objProto;

  const thrower = void '?'; // TODO
  intrinsics.__ThrowTypeError = thrower;

  // const funcProto = CreateBuiltinFunction(realm);
  // intrinsics.__FunctionPrototype = funcProto;

  // thrower.__SetPrototypeOf(funcProto);

  // TODO: lots more here

  return intrinsics;
}

// ECMA-262 9.1.1.1
export function OrdinaryGetPrototypeOf(obj: ObjectValue) {
  return obj.__Prototype;
}

// ECMA-262 9.1.2.1
export function OrdinarySetPrototypeOf(obj: ObjectValue, newProto: Value) {
  assert(
    newProto instanceof ObjectValue || newProto instanceof NullValue,
    'Prototype should be an object or null'
  );

  if (SameValue(newProto, obj.__Prototype)) return true;
  if (!obj.__Extensible) return false;

  let p = newProto as ObjectValue | NullValue;
  let done = false;

  while (!done) {
    if (p instanceof NullValue) {
      done = true;
    } else if (SameValue(p, obj)) {
      return false;
    } else {
      if (p.__GetPrototypeOf !== ObjectValue.prototype.__GetPrototypeOf) {
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

// ECMA-262 9.1.3.1
export function OrdinaryIsExtensible(obj: ObjectValue) {
  return obj.__Extensible && obj.__Extensible.value === true;
}

// ECMA-262 9.1.4.1
export function OrdinaryPreventExtensions(realm: Realm, obj: ObjectValue) {
  obj.__Extensible = new BooleanValue(realm, false);
  return new BooleanValue(realm, true);
}

// ECMA-262 9.1.5.1
export function OrdinaryGetOwnProperty(
  obj: ObjectValue,
  propertyKey: PropertyKeyValue
): PropertyDescriptor | undefined {
  assert(IsPropertyKey(propertyKey), 'Property key should be either a string or a symbol');

  const propertyBinding = obj.__InternalGetPropertyBinding(propertyKey);
  if (!propertyBinding) return undefined;

  const descriptor = new PropertyDescriptor();

  if (IsDataDescriptor(propertyBinding)) {
    descriptor.__Value = propertyBinding.__Value;
    descriptor.__Writable = propertyBinding.__Writable;
  } else if (IsAccessorDescriptor(propertyBinding)) {
    descriptor.__Get = propertyBinding.__Get;
    descriptor.__Set = propertyBinding.__Set;
  }

  descriptor.__Enumerable = propertyBinding.__Enumerable;
  descriptor.__Configurable = propertyBinding.__Configurable;

  return descriptor;
}

// ECMA-262 9.1.6.1
export function OrdinaryDefineOwnProperty(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  desc: PropertyDescriptor
) {
  const current = obj.__GetOwnProperty(propertyKey);
  const extensible = obj.__Extensible;
  return ValidateAndApplyPropertyDescriptor(realm, obj, propertyKey, extensible, desc, current);
}

// ECMA-262 9.1.6.3
export function ValidateAndApplyPropertyDescriptor(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  extensible: BooleanValue,
  desc: PropertyDescriptor,
  current?: PropertyDescriptor
) {
  // 1.
  if (!(obj instanceof UndefinedValue)) {
    assert(IsPropertyKey(propertyKey), 'Should be a valid property key');
  }

  // 2.
  if (!current) {
    if (extensible.value === false) return false;

    assert(extensible.value === true, 'Should be extensible');

    if (IsGenericDescriptor(desc) || IsDataDescriptor(desc)) {
      if (!(obj instanceof UndefinedValue)) {
        const newDescriptor = new PropertyDescriptor();

        newDescriptor.__Value = desc.__Value || new UndefinedValue(realm);
        newDescriptor.__Writable = desc.__Writable || new BooleanValue(realm, false);
        newDescriptor.__Enumerable = desc.__Enumerable || new BooleanValue(realm, false);
        newDescriptor.__Configurable = desc.__Configurable || new BooleanValue(realm, false);

        obj.__InternalSetPropertyBinding(propertyKey, newDescriptor);
      }
    } else {
      if (!(obj instanceof UndefinedValue)) {
        const newDescriptor = new PropertyDescriptor();

        newDescriptor.__Get = desc.__Get || new UndefinedValue(realm);
        newDescriptor.__Set = desc.__Set || new UndefinedValue(realm);
        newDescriptor.__Enumerable = desc.__Enumerable || new BooleanValue(realm, false);
        newDescriptor.__Configurable = desc.__Configurable || new BooleanValue(realm, false);

        obj.__InternalSetPropertyBinding(propertyKey, newDescriptor);
      }
    }

    return true;
  }

  // 3.
  if (
    !desc.__Value &&
    !desc.__Writable &&
    !desc.__Get &&
    !desc.__Set &&
    !desc.__Enumerable &&
    !desc.__Configurable
  ) {
    return true;
  }

  // 4.
  if (current.__Configurable && current.__Configurable.value === false) {
    if (desc.__Configurable && desc.__Configurable.value === true) {
      return false;
    }

    if (desc.__Enumerable && current.__Enumerable.value === !desc.__Enumerable.value) {
      return false;
    }
  }

  if (IsGenericDescriptor(desc)) {
    // 5.
  } else if (IsDataDescriptor(current) !== IsDataDescriptor(desc)) {
    // 6.
    if (current.__Configurable.value === false) return false;

    if (IsDataDescriptor(current)) {
      if (!(obj instanceof UndefinedValue)) {
        current.__Writable = undefined;
        current.__Value = undefined;
        current.__Get = new UndefinedValue(realm);
        current.__Set = new UndefinedValue(realm);
      }
    } else {
      if (!(obj instanceof UndefinedValue)) {
        current.__Get = undefined;
        current.__Set = undefined;
        current.__Writable = new BooleanValue(realm, false);
        current.__Value = new UndefinedValue(realm);
      }
    }
  } else if (IsDataDescriptor(current) && IsDataDescriptor(desc)) {
    // 7.
    if (
      current.__Configurable &&
      current.__Configurable.value === false &&
      current.__Writable &&
      current.__Writable.value === false
    ) {
      if (desc.__Writable && desc.__Writable.value) return false;
      if (desc.__Value && !SameValue(desc.__Value, current.__Value)) return false;
      return true;
    }
  } else {
    // 8.
    if (current.__Configurable && current.__Configurable.value === false) {
      if (desc.__Set && !SameValue(desc.__Set, current.__Set)) return false;
      if (desc.__Get && !SameValue(desc.__Get, current.__Get)) return false;
      return true;
    }
  }

  // 9.
  if (!(obj instanceof UndefinedValue)) {
    for (const field in desc) {
      if (desc[field] !== undefined) {
        current[field] = desc[field];
      }
    }
  }

  // 10.
  return true;
}

// ECMA-262 9.1.7.1
export function OrdinaryHasProperty(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue
): boolean {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const hasOwn = obj.__GetOwnProperty(propertyKey);
  if (hasOwn) return true;

  const parent = obj.__GetPrototypeOf();
  if (!(parent instanceof NullValue)) {
    return parent.__HasProperty(propertyKey);
  }

  return false;
}

// ECMA-262 9.1.8.1
export function OrdinaryGet(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  receiver: ObjectValue
): Value {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const desc = obj.__GetOwnProperty(propertyKey);
  if (!desc) {
    const parent = obj.__GetPrototypeOf();
    if (parent instanceof NullValue) return undefined;
    return parent.__Get(propertyKey, receiver);
  }

  if (IsDataDescriptor(desc)) return desc.__Value;

  assert(IsAccessorDescriptor(desc), 'Should be an accessor descriptor if not a data descriptor');

  const getter = desc.__Get;
  if (!getter) return undefined;

  return Call(realm, getter, receiver);
}

// ECMA-262 9.1.9.1
export function OrdinarySet(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value,
  receiver: ObjectValue
) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const ownDesc = obj.__GetOwnProperty(propertyKey);

  return OrdinarySetWithOwnDescriptor(realm, obj, propertyKey, value, receiver, ownDesc);
}

// ECMA-262 9.1.9.2
export function OrdinarySetWithOwnDescriptor(
  realm: Realm,
  obj: ObjectValue,
  propertyKey: PropertyKeyValue,
  value: Value,
  receiver: ObjectValue,
  ownDesc: PropertyDescriptor
) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  if (!ownDesc) {
    const parent = obj.__GetPrototypeOf();
    if (!(parent instanceof NullValue)) {
      return parent.__Set(propertyKey, value, receiver);
    } else {
      ownDesc = new PropertyDescriptor();
      ownDesc.__Value = new UndefinedValue(realm);
      ownDesc.__Writable = new BooleanValue(realm, true);
      ownDesc.__Enumerable = new BooleanValue(realm, true);
      ownDesc.__Configurable = new BooleanValue(realm, true);
    }
  }

  if (IsDataDescriptor(ownDesc)) {
    if (ownDesc.__Writable && ownDesc.__Writable.value === false) {
      return false;
    }

    if (!(receiver instanceof ObjectValue)) return false;

    const existingDescriptor = receiver.__GetOwnProperty(propertyKey);
    if (existingDescriptor) {
      if (IsAccessorDescriptor(existingDescriptor)) return false;

      if (existingDescriptor.__Writable && existingDescriptor.__Writable.value === false) {
        return false;
      }

      const valueDesc = new PropertyDescriptor();
      valueDesc.__Value = value;

      return receiver.__DefineOwnProperty(propertyKey, valueDesc);
    } else {
      return CreateDataProperty(realm, receiver, propertyKey, value);
    }
  }

  assert(
    IsAccessorDescriptor(ownDesc),
    'Should be an accessor descriptor if not a data descriptor'
  );

  const setter = ownDesc.__Set;
  if (!setter) return false;

  Call(realm, setter, receiver, [value]);

  return true;
}

// ECMA-262 9.1.10.1
export function OrdinaryDelete(obj: ObjectValue, propertyKey: PropertyKeyValue) {
  assert(IsPropertyKey(propertyKey), 'Should be a valid property key');

  const desc = obj.__GetOwnProperty(propertyKey);
  if (!desc) return true;

  if (desc.__Configurable && desc.__Configurable.value === true) {
    obj.__InternalDeletePropertyBinding(propertyKey);
    return true;
  }

  return false;
}

// ECMA-262 9.1.11.1
export function OrdinaryOwnPropertyKeys(obj: ObjectValue) {
  const keys = [];

  // obj.properties.forEach((value, key) => {
  //   const stringKey = typeof key === 'string' ? key : key.value;

  // });

  for (const symbolKey of obj.symbols.keys()) {
    keys.push(symbolKey);
  }

  return keys;
}

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

// ECMA-262 9.3.3
export function CreateBuiltinFunction(realm: Realm, steps, internalSlotsList, prototype) {}

// ECMA-262 9.4.2.2
export function ArrayCreate(realm: Realm, length: NumberValue, proto?: ObjectValue) {
  assert(length instanceof NumberValue, 'Length should a number');
  assert(length.value >= 0, 'Length should be >= 0');

  if (Object.is(-0, length.value)) {
    length.value = +0;
  }

  if (length.value > Math.pow(2, 32) - 1) {
    throw new RangeError('Length out of range');
  }

  proto = proto || realm.__Intrinsics.__ArrayPrototype;

  const array = new ArrayExotic(realm);

  array.__Prototype = proto;
  array.__Extensible = new BooleanValue(realm, true);

  const lengthDesc = new PropertyDescriptor();
  lengthDesc.__Value = length;
  lengthDesc.__Writable = new BooleanValue(realm, true);
  lengthDesc.__Enumerable = new BooleanValue(realm, false);
  lengthDesc.__Configurable = new BooleanValue(realm, false);
  OrdinaryDefineOwnProperty(realm, array, new StringValue(realm, 'length'), lengthDesc);

  return array;
}

// ECMA-262 12.10.4
export function InstanceofOperator(realm: Realm, value: ObjectValue, target: ObjectValue) {
  if (!(target instanceof ObjectValue)) {
    throw new TypeError('instanceof must be called on object');
  }

  const instOfHandler = GetMethod(realm, target, realm.__Intrinsics.__Symbol_hasInstance);
  if (instOfHandler) {
    return ToBoolean(realm, Call(realm, instOfHandler, target, [value]));
  }

  if (!IsCallable(target)) {
    throw new TypeError('Target is not callable');
  }

  return OrdinaryHasInstance(realm, target as FunctionValue, value);
}

// TODO: move to another file?
const getBoundNames = (decl: Nodes.Declaration): string[] => {
  const names = [];

  if (decl.type === 'VariableDeclaration') {
    decl.declarations.forEach(declarator => {
      const id = declarator.id;
      if (id.type === 'Identifier') names.push(id.name);
      // TODO: this is incomplete, since the declarator could be
      // a number of things (e.g. an array destructuring pattern),
      // rather than just an identifier, and then we would find the
      // bind names differently
    });
  } else if (decl.type === 'FunctionDeclaration' || decl.type === 'ClassDeclaration') {
    names.push(decl.id);
  }

  return names;
};

// ECMA-262 15.1.11
export function GlobalDeclarationInstantiation(script: Nodes.File, env: LexicalEnvironment) {
  // 1.
  const envRec = env.environmentRecord as GlobalEnvironmentRecord;
  const realm = envRec.__Realm;

  // 2.
  assert(envRec instanceof GlobalEnvironmentRecord, 'should be a global environment record');

  // 3.
  const lexNames: StringValue[] = []; // TODO

  // 4.
  const varNames: StringValue[] = []; // TODO

  // 5.
  for (const name of lexNames) {
    if (envRec.HasVarDeclaration(name)) {
      throw new SyntaxError(`Already defined: '${name.value}'`);
    }

    if (envRec.HasLexicalDeclaration(name)) {
      throw new SyntaxError(`Already defined: '${name.value}'`);
    }

    const hasRestrictedGlobal = envRec.HasRestrictedGlobalProperty(name);
    if (hasRestrictedGlobal) {
      throw new SyntaxError(`Restricted global: '${name.value}'`);
    }
  }

  // 6.
  for (const name of varNames) {
    if (envRec.HasLexicalDeclaration(name)) {
      throw new SyntaxError(`Already defined: '${name.value}'`);
    }
  }

  // 7.
  const varDeclarations: Nodes.Declaration[] = []; // TODO

  // 8.
  const functionsToInitialize = [];

  // 9.
  const declaredFunctionNames = [];

  // 10.
  for (const decl of varDeclarations.reverse()) {
    if (decl.type !== 'VariableDeclaration') {
      assert(decl.type === 'FunctionDeclaration', 'should be a function declaration');

      const boundNames = getBoundNames(decl);
      const fn = boundNames[0];

      if (declaredFunctionNames.indexOf(fn) === -1) {
        const fnDefinable = envRec.CanDeclareGlobalFunction(new StringValue(realm, fn));

        if (!fnDefinable) {
          throw new TypeError(`Cannot define function: ${fn}`);
        }

        declaredFunctionNames.push(fn);
        functionsToInitialize.unshift(decl);
      }
    }
  }

  // 11.
  const declaredVarNames: string[] = [];

  // 12.
  for (const decl of varDeclarations.reverse()) {
    if (decl.type === 'VariableDeclaration') {
      const boundNames = getBoundNames(decl);

      for (const vn of boundNames) {
        if (declaredFunctionNames.indexOf(vn) === -1) {
          const vnDefinable = envRec.CanDeclareGlobalVar(new StringValue(realm, vn));

          if (!vnDefinable) {
            throw new TypeError(`Cannot define variable: ${vn}`);
          }

          if (declaredVarNames.indexOf(vn) === -1) {
            declaredVarNames.push(vn);
          }
        }
      }
    }
  }

  // 15.
  const lexDeclarations: Nodes.VariableDeclaration[] = [];

  for (const decl of script.program.body) {
    if (decl.type === 'VariableDeclaration' && decl.kind !== 'var') {
      lexDeclarations.push(decl);
    }
  }

  // 16.
  for (const decl of lexDeclarations) {
    for (const dn of getBoundNames(decl)) {
      if (decl.kind === 'const') {
        envRec.CreateImmutableBinding(new StringValue(realm, dn), true);
      } else {
        envRec.CreateMutableBinding(new StringValue(realm, dn), false);
      }
    }
  }

  // 17.
  // TODO

  // 18.
  for (const vn of declaredVarNames) {
    envRec.CreateGlobalVarBinding(new StringValue(realm, vn), false);
  }
}
