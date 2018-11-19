import { Value } from '../../values/Value';
import { UndefinedValue } from '../../values/UndefinedValue';
import { Realm } from '../../environment/Realm';
import { NullValue } from '../../values/NullValue';
import { BooleanValue } from '../../values/BooleanValue';
import { NumberValue } from '../../values/NumberValue';
import { StringValue } from '../../values/StringValue';
import { SymbolValue } from '../../values/SymbolValue';
import { ObjectValue } from '../../values/ObjectValue';
import { assert } from '../../assert';

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
