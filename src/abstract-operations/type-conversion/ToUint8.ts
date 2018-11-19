import { Value } from '../../values/Value';
import { ToNumber } from './ToNumber';
import { Realm } from '../../environment/Realm';

// ECMA-262 7.1.10
export function ToUint8(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number === 0 || !isFinite(number)) return +0;

  const int = number < 0 ? -Math.floor(Math.abs(number)) : Math.floor(Math.abs(number));

  return int % Math.pow(2, 8);
}
