import { Value } from '../../values/Value';
import { UndefinedValue } from '../../values/UndefinedValue';
import { Realm } from '../../environment/Realm';
import { NullValue } from '../../values/NullValue';
import { BooleanValue } from '../../values/BooleanValue';
import { NumberValue } from '../../values/NumberValue';
import { StringValue } from '../../values/StringValue';
import { SymbolValue } from '../../values/SymbolValue';
import { ToPrimitive } from './ToPrimitive';

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
