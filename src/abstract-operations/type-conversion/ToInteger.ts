import { Value } from '../../values/Value';
import { ToNumber } from './ToNumber';
import { Realm } from '../../environment/Realm';
import { NumberValue } from '../../values/NumberValue';

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
