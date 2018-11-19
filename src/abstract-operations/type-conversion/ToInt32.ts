import { Value } from '../../values/Value';
import { ToNumber } from './ToNumber';
import { Realm } from '../../environment/Realm';

// ECMA-262 7.1.5
export function ToInt32(realm: Realm, argument: Value) {
  const numberValue = ToNumber(realm, argument);
  const number = numberValue.value;

  if (isNaN(number) || number === 0 || !isFinite(number)) return +0;

  const int = number < 0 ? -Math.floor(Math.abs(number)) : Math.floor(Math.abs(number));

  const int32bit = int % Math.pow(2, 32);

  return int32bit >= Math.pow(2, 31) ? int32bit - Math.pow(2, 32) : int32bit;
}
