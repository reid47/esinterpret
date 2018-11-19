import { Value } from '../../values/Value';
import { UndefinedValue } from '../../values/UndefinedValue';
import { Realm } from '../../environment/Realm';
import { NullValue } from '../../values/NullValue';
import { BooleanValue } from '../../values/BooleanValue';
import { NumberValue } from '../../values/NumberValue';
import { StringValue } from '../../values/StringValue';

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
