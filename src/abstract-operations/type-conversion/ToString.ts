import { Value } from '../../values/Value';
import { UndefinedValue } from '../../values/UndefinedValue';
import { Realm } from '../../environment/Realm';
import { NullValue } from '../../values/NullValue';
import { BooleanValue } from '../../values/BooleanValue';
import { NumberValue } from '../../values/NumberValue';
import { StringValue } from '../../values/StringValue';
import { SymbolValue } from '../../values/SymbolValue';
import { ToPrimitive } from './ToPrimitive';
import { NumberToString } from './NumberToString';

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
