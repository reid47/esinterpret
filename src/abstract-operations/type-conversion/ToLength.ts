import { Value } from '../../values/Value';
import { Realm } from '../../environment/Realm';
import { ToInteger } from './ToInteger';
import { NumberValue } from '../../values/NumberValue';

// ECMA-262 7.1.15
export function ToLength(realm: Realm, argument: Value): NumberValue {
  const lenValue = ToInteger(realm, argument);
  const len = lenValue.value;

  if (len <= +0) {
    return new NumberValue(realm, +0);
  }

  return new NumberValue(realm, Math.min(len, Math.pow(2, 53) - 1));
}
